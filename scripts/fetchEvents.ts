import { handleEventReturn } from '@727-ventures/typechain-types';
import { ApiPromise } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import Keyring from '@polkadot/keyring';
import chalk from 'chalk';
import fs from 'fs-extra';
import PQueue, { DefaultAddOptions } from 'p-queue';
import path from 'path';
import { AToken, LendingPool, VToken, getEventTypeDescription, replaceRNBNPropsWithStrings } from '@abaxfinance/contract-helpers';
import { apiProviderWrapper, sleep } from './common';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { getArgvObj } from '@abaxfinance/utils';
import {
  getContractObject,
  EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL,
  EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN,
  EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN,
} from '@abaxfinance/contract-helpers';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { TimeSpanFormatter } from 'scripts/benchmarking/utils';
import LargeSet from 'large-set';
type FetchResult = { endBlockNumber: number };
type EventsFromBlockResult = { blockNumber: number; eventsByContractAddress: Record<string, EventWithMeta[]>; error?: Error; blockHash: BlockHash };

export type EventWithMeta = {
  event: any;
  meta: {
    contractAddress: string;
    contractName: string;
    timestamp: string;
    timestampISO: string;
    eventName: string;
    blockNumber: number;
    blockHash: string;
  };
};

interface IWithAddress {
  address: string;
}

interface IWithAbi {
  abi: Abi;
}

const LENDING_POOL_ADDRESS = '5CckcttmupmDiZxELpCgnMwWYBBjz8vV5wjhBaPEoG5fnubH';
const ADAI_ADDRESS = '5FXGwoxtZaacLYngaA2AB6RjmQPB7Y8agnLqVc272dwiQ11y';
const VDAI_ADDRESS = '5EzkPqEt6pzYps3tUUSr1e9hDitM94DkX8FRCiK3vn4ZEVjW';
const AUSDC_ADDRESS = '5FjXQDiNdZb5HtSrr9cBj7kn9UegPq4gAGiJkrEMeqjqXrHv';
const VUSDC_ADDRESS = '5HUGx5ckPsxDn3mBiqSQnr4KD4wMfSeNDmDpr4tfco99hzzN';
const AWETH_ADDRESS = '5FUHz6QqPEweYeV1Rme6GSkw36KZ3TURRWLq5iApimhzVMSh';
const VWETH_ADDRESS = '5CRcj6UTcodA3zu4REcaqDGd19KqjRbFCCu3jxw2JCuGYvBg';
const ABTC_ADDRESS = '5CbDjWgs8o8j38HBFS5MSvz1VjxKws6VXzkUPqVzpiPDRqnp';
const VBTC_ADDRESS = '5FkiL5atvKUYx7JN97yPZCjxL37rREZ3t5nRnWfC3rbuJwFr';
const AAZERO_ADDRESS = '5EXMJVkZRyRGuHuHpc8yJqYAwL2zkKQ8esYej63uP6FFzEic';
const VAZERO_ADDRESS = '5CXBiqVfxYYsL2notX8J1VzrkhQmqJWmns9VtSAmnhdR5Hm9';
const ADOT_ADDRESS = '5HYAH78h6c7nzBraUAX2fyMLqk8EwVTohsj7xCzQUBqx7WQm';
const VDOT_ADDRESS = '5EBdpgCVH34siyNv51hFfJSK3udow214W6JFScf4reLhqzqX';
const START_BLOCK_NUMBER_EARLIEST = 36500600;

const outputPathBase = path.join(path.parse(__filename).dir, 'scan_results');
const lastResultsPath = path.join(outputPathBase, 'whole_run_results.json');
fs.ensureDir(outputPathBase);

const getLastFetchResult = async (): Promise<Partial<FetchResult>> => {
  try {
    const lastResult = JSON.parse(await fs.readFile(lastResultsPath, 'utf8')) as FetchResult;
    return lastResult;
  } catch (e) {
    console.warn('Failed to retrieve last fetch result');
    return { endBlockNumber: undefined };
  }
};

export const getPreviousEvents = () => {
  try {
    const eventsPath = getEventsLogPath();
    if (!fs.existsSync(eventsPath)) return [];
    return JSON.parse(fs.readFileSync(eventsPath, 'utf8')) as EventWithMeta[];
  } catch (e) {
    console.warn(`Unable to retrieve eventLog`);
    return [];
  }
};

const getPendingBlocks = () => {
  try {
    const prevErrPath = getEventPendingBlocksPath();
    if (!fs.existsSync(prevErrPath)) return [];
    return JSON.parse(fs.readFileSync(prevErrPath, 'utf-8')) as number[];
  } catch (e) {
    console.warn(`Unable to retrieve pending blocks file`);
    return [];
  }
};

function ensureQueueItemsFinishOnProcessExitSignal(queue: PQueue<PriorityQueue, DefaultAddOptions>) {
  ['SIGINT', 'SIGQUIT', 'SIGTERM'].map((signal) =>
    process.on(signal, () => {
      if (process.env.DEBUG) console.log(signal);
      if (process.env.DEBUG) console.log('Pausing queue...');
      queue.pause();
      const intervalID = setInterval(() => {
        if (queue.pending > 0) {
          if (process.env.DEBUG) console.log(new Date(), `pending: ${queue.pending} items`);
          return;
        }
        if (process.env.DEBUG) console.log(new Date(), 'no more items pending in queue...');
        clearInterval(intervalID);
        process.exit(0);
      }, 500);
    }),
  );
}

function storeLastSuccessfulBlock(endBlockNumber: number) {
  const fetchResult = { endBlockNumber } satisfies FetchResult;
  fs.writeFileSync(lastResultsPath, JSON.stringify(fetchResult), 'utf-8');
}

async function getLatestBlockNumber(api: ApiPromise) {
  const latestSignedBlock = await api.rpc.chain.getBlock();
  const endBlockNumber = latestSignedBlock.block.header.number.toNumber();
  return endBlockNumber;
}

const benchInterval = 500;
async function createStoreEventsAndErrors(api: ApiPromise, eventLog: EventWithMeta[]): Promise<(result: EventsFromBlockResult) => void> {
  return async (result) => {
    if (Object.keys(result.eventsByContractAddress).length > 0) {
      for (const [contractName, events] of Object.entries(result.eventsByContractAddress)) {
        eventLog.push(...events);
        console.log(new Date(), `pushed ${events.length} events for ${contractName}`);
        fs.writeFileSync(getEventsLogPath(), JSON.stringify(eventLog, null, 2), 'utf-8');
      }
    }
    if (blockToResumeWithOnSIGINTContainer.blockNumber) blockToResumeWithOnSIGINTContainer.blockNumber = result.blockNumber;
    if (result.blockNumber % benchInterval === 0) {
      const now = Date.now();
      const apiAt = await api.at(result.blockHash);
      const timestamp = await apiAt.query.timestamp.now();
      const timestampISO = new Date(parseInt(timestamp.toString())).toISOString();
      if (!benchTimeIntermediateStart) {
        console.log(new Date(), `Last analyzed block: ${result.blockNumber} (${timestampISO})`);
      } else {
        console.log(
          new Date(),
          `Last analyzed block: ${result.blockNumber} (${timestampISO}) Speed: ${new TimeSpanFormatter().format(
            's.f',
            (now - benchTimeIntermediateStart) / 5,
          )}[seconds.fraction] per ${benchInterval / 5} blocks`,
        );
      }
      benchTimeIntermediateStart = now;
    }
    const idx = pendingBlocks.indexOf(result.blockNumber);
    if (idx !== -1) pendingBlocks.splice(idx, 1);
  };
}

function getEventPendingBlocksPath() {
  return path.join(outputPathBase, `pendingBlocks.json`);
}

function getEventsLogPath() {
  return path.join(outputPathBase, `eventLog.json`);
}

async function getEventsByContract<TContract extends IWithAbi & IWithAddress>(
  blockNumber: number,
  api: ApiPromise,
  contracts: TContract[],
): Promise<EventsFromBlockResult> {
  const eventsToReturnByContractAddress: Record<string, EventWithMeta[]> = {};
  const blockHash: BlockHash = (await api.rpc.chain.getBlockHash(blockNumber)) as any;
  const apiAt = await api.at(blockHash);
  const events: any = await apiAt.query.system.events();
  const timestamp = await apiAt.query.timestamp.now();

  for (const record of events) {
    const { event } = record;

    if (event.method === 'ContractEmitted') {
      const [address, data] = record.event.data;

      for (const contract of contracts) {
        if (address.toString() === contract.address.toString()) {
          const decodeEventResult = contract.abi.decodeEvent(data);
          const { args: eventArgs, event: ev } = decodeEventResult;

          const _event: Record<string, any> = {};
          for (let argI = 0; argI < eventArgs.length; argI++) {
            _event[ev.args[argI].name] = eventArgs[argI].toJSON();
          }
          const eventName = ev.identifier.toString();
          const contractName = contract.abi.info.contract.name.toString();

          //TODO
          const eventDataTypeDescriptionToUse =
            contractName === 'a_token'
              ? EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN
              : contractName === 'v_token'
              ? EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN
              : EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL;
          const eventRet = handleEventReturn(_event, getEventTypeDescription(eventName, eventDataTypeDescriptionToUse));

          const eventRetWithMeta = {
            event: eventRet,
            meta: {
              contractName,
              contractAddress: address.toString() as string,
              eventName,
              timestamp: timestamp.toString(),
              timestampISO: new Date(parseInt(timestamp.toString())).toISOString(),
              blockNumber,
              blockHash: blockHash.toString(),
            },
          } satisfies EventWithMeta;
          eventsToReturnByContractAddress[eventRetWithMeta.meta.contractAddress] = [
            ...(eventsToReturnByContractAddress[eventRetWithMeta.meta.contractAddress] ?? []),
            replaceRNBNPropsWithStrings(eventRetWithMeta),
          ];
        }
      }
    }
  }
  return { blockNumber, blockHash, eventsByContractAddress: eventsToReturnByContractAddress };
}

// eslint-disable-next-line eqeqeq
const RUN_CONTINUOUSLY = (process.env.RUN_CONTINUOUSLY == 'true' || process.env.RUN_CONTINUOUSLY == '1') ?? false;

let benchTimeIntermediateStart: number | null = null;
const arrayRange = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step);
async function runContinously<TContract extends IWithAbi & IWithAddress>(
  initStartBlockNumber: number,
  api: ApiPromise,
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  contracts: TContract[],
  eventLog: EventWithMeta[],
) {
  let startBlockNumber = initStartBlockNumber + 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const endBlockNumberFromApi = await getLatestBlockNumber(api);
    const blocksToAdd = arrayRange(startBlockNumber, endBlockNumberFromApi);
    console.warn(`Adding blocks to the queue...`);
    pendingBlocks.push(...blocksToAdd);
    addBlockRangeToTheQueue(queue, api, contracts, eventLog, blocksToAdd);
    startBlockNumber = endBlockNumberFromApi + 1;
    await sleep(1000);
  }
}

async function getStartEndBlockNumbers(api: ApiPromise) {
  const { endBlockNumber: prevRunEndBlockNumber } = await getLastFetchResult();
  const startBlockNumber = (prevRunEndBlockNumber ?? START_BLOCK_NUMBER_EARLIEST) + 1;
  const endBlockNumberFromApi = await getLatestBlockNumber(api);
  return { startBlockNumber, endBlockNumber: endBlockNumberFromApi };
}

function addBlockRangeToTheQueue<TContract extends IWithAbi & IWithAddress>(
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  api: ApiPromise,
  contracts: TContract[],
  eventLog: EventWithMeta[],
  blockNumbers: number[],
) {
  console.log(new Date(), `adding ${blockNumbers.length} blocks to the queue from range...`);
  for (const blockNumber of blockNumbers) {
    queue
      .add(() => getEventsByContract(blockNumber, api, contracts))
      .then((res) => createStoreEventsAndErrors(api, eventLog).then((handleFunc) => handleFunc(res)))
      .catch((e) => {
        console.log(e);
        fs.writeFileSync(getEventPendingBlocksPath(), JSON.stringify(pendingBlocks), 'utf-8');
        if (blockToResumeWithOnSIGINTContainer.blockNumber) storeLastSuccessfulBlock(blockToResumeWithOnSIGINTContainer.blockNumber);
        process.exit(1);
      });
  }
}

// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################
// #############################################################################################

const pendingBlocks: number[] = [];
const eventLog: EventWithMeta[] = [];

const blockToResumeWithOnSIGINTContainer: { blockNumber: number } = { blockNumber: 0 };

const queue = new PQueue({ concurrency: 30, autoStart: false });
const CHUNK_SIZE = 10_000;
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';
  const api = await apiProviderWrapper.getAndWaitForReady();

  const keyring = new Keyring();
  const signer = keyring.createFromUri(seed, {}, 'sr25519');
  const lendingPool = await getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
  const aTokens = await Promise.all(
    [ADAI_ADDRESS, AAZERO_ADDRESS, ABTC_ADDRESS, ADOT_ADDRESS, AUSDC_ADDRESS, AWETH_ADDRESS].map((addr) =>
      getContractObject(AToken, addr, signer, api),
    ),
  );
  const vTokens = await Promise.all(
    [VDAI_ADDRESS, VAZERO_ADDRESS, VBTC_ADDRESS, VDOT_ADDRESS, VUSDC_ADDRESS, VWETH_ADDRESS].map((addr) =>
      getContractObject(VToken, addr, signer, api),
    ),
  );
  const contracts = [lendingPool, ...aTokens, ...vTokens];
  //TODO DB
  const prevLog = getPreviousEvents();
  for (const e of prevLog) {
    eventLog.push(e);
  }
  ensureQueueItemsFinishOnProcessExitSignal(queue);
  const set = new LargeSet<number>();
  getPendingBlocks().forEach((b) => set.add(b));
  for (const val of set.values()) {
    pendingBlocks.push(val);
  }
  console.log('total number of pending blocks to process : ', pendingBlocks.length);

  try {
    for (let i = 0; i < pendingBlocks.length; i += CHUNK_SIZE) {
      fs.writeFileSync(getEventPendingBlocksPath(), JSON.stringify(pendingBlocks), 'utf-8');
      const chunk = pendingBlocks.slice(i, i + CHUNK_SIZE);
      addBlockRangeToTheQueue(queue, api, contracts, eventLog, chunk);

      console.log(`amount of pending blocks to process:`, queue.size);
      queue.start();
      await queue.onIdle();

      queue.pause();
    }
  } catch (e) {
    fs.writeFileSync(getEventPendingBlocksPath(), JSON.stringify(pendingBlocks), 'utf-8');
    console.log('error while analyzing past blocks...');
    console.log(e);
    process.exit(1);
  }

  const res = await getStartEndBlockNumbers(api);
  fs.writeFileSync(getEventPendingBlocksPath(), JSON.stringify(pendingBlocks), 'utf-8');

  blockToResumeWithOnSIGINTContainer.blockNumber = res.startBlockNumber;
  try {
    const blocksToAdd = arrayRange(res.startBlockNumber, res.endBlockNumber);
    console.warn(`Amount of blocks to add to catch up to 'now': ${blocksToAdd.length}`);
    for (let i = 0; i < blocksToAdd.length; i += CHUNK_SIZE) {
      const chunk = blocksToAdd.slice(i, i + CHUNK_SIZE);
      for (const b of chunk) {
        pendingBlocks.push(b);
      }

      addBlockRangeToTheQueue(queue, api, contracts, eventLog, chunk);

      console.log(`amount of blocks to process:`, queue.size);
      queue.start();
      await queue.onIdle();

      queue.pause();
    }
  } catch (e) {
    console.log('error while analyzing past blocks...');
    console.log(e);
    process.exit(1);
  }

  if (!RUN_CONTINUOUSLY) {
    console.log(`Continuous mode off. Exiting...`);
    await api.disconnect();
    process.exit(0);
  }

  console.log('Continuous mode on. Running continuous scan...');
  await runContinously(res.endBlockNumber, api, queue, contracts, eventLog);
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED', e);
  fs.writeFileSync(getEventPendingBlocksPath(), JSON.stringify(pendingBlocks), 'utf-8');
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
