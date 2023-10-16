import { handleEventReturn } from '@727-ventures/typechain-types';
import { ApiPromise } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import Keyring from '@polkadot/keyring';
import chalk from 'chalk';
import fs from 'fs-extra';
import PQueue, { DefaultAddOptions } from 'p-queue';
import path from 'path';
import { LendingPool, getEventTypeDescription, replaceRNBNPropsWithStrings } from '@abaxfinance/contract-helpers';
import { apiProviderWrapper, sleep } from './common';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { getArgvObj } from '@abaxfinance/utils';
import { getContractObject, EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL } from '@abaxfinance/contract-helpers';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { TimeSpanFormatter } from 'scripts/benchmarking/utils';
type FetchResult = { startBlockNumber: number; endBlockNumber: number; success: boolean };
type EventsFromBlockResult = { contractName: string; blockNumber: number; eventsToReturn: EventWithMeta[]; error?: Error; blockHash: BlockHash };

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

type FetchEventError = {
  error: any;
  blockNumber: number;
};

interface IWithAddress {
  address: string;
}

interface IWithAbi {
  abi: Abi;
}

const LENDING_POOL_ADDRESS = '5CckcttmupmDiZxELpCgnMwWYBBjz8vV5wjhBaPEoG5fnubH';
const START_BLOCK_NUMBER_EARLIEST = 36500600;

const keyring = new Keyring();

const outputPathBase = path.join(path.parse(__filename).dir, 'scan_results');
const lastResultsPath = path.join(outputPathBase, 'whole_run_results.json');
fs.ensureDir(outputPathBase);

const getLastFetchResult = async (): Promise<Partial<FetchResult>> => {
  try {
    const lastResult = JSON.parse(await fs.readFile(lastResultsPath, 'utf8')) as FetchResult;
    return lastResult;
  } catch (e) {
    console.warn('Failed to retrieve last fetch result');
    return { startBlockNumber: undefined, endBlockNumber: undefined, success: false };
  }
};

export const getPreviousEvents = (contractName: string) => {
  try {
    const eventsPath = getEventsLogPath(contractName);
    if (!fs.existsSync(eventsPath)) return [];
    return JSON.parse(fs.readFileSync(eventsPath, 'utf8')) as EventWithMeta[];
  } catch (e) {
    console.warn(`Unable to retrieve previous events for ${contractName}`);
    return [];
  }
};

const getPreviousErrors = (contractName: string) => {
  try {
    const prevErrPath = getEventErrorsPath(contractName);
    if (!fs.existsSync(prevErrPath)) return [];
    return JSON.parse(fs.readFileSync(prevErrPath, 'utf-8')) as FetchEventError[];
  } catch (e) {
    console.warn(`Unable to retrieve previous errors for ${contractName}`);
    return [];
  }
};

function ensureQueueItemsFinishOnProcessExitSignal(
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  startBlockNumber: number,
  blockToResumeWithOnSIGINTContainer: { blockNumber: number },
  errorLog: FetchEventError[],
) {
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
        storeWholeRunResults(startBlockNumber, blockToResumeWithOnSIGINTContainer.blockNumber, errorLog.length === 0);
        clearInterval(intervalID);
        process.exit(0);
      }, 500);
    }),
  );
}

function storeWholeRunResults(startBlockNumber: number, endBlockNumber: number, success: boolean) {
  const fetchResult = { startBlockNumber, endBlockNumber, success } satisfies FetchResult;

  // fs.writeFileSync(path.join(outputPathBase, `whole_run_results.log.${new Date().toISOString()}.json`), JSON.stringify(fetchResult), 'utf-8');
  fs.writeFileSync(lastResultsPath, JSON.stringify(fetchResult), 'utf-8');
}

async function getLatestBlockNumber(api: ApiPromise) {
  const latestSignedBlock = await api.rpc.chain.getBlock();
  const endBlockNumber = latestSignedBlock.block.header.number.toNumber();
  return endBlockNumber;
}

async function createStoreEventsAndErrors(
  api: ApiPromise,
  eventLog: EventWithMeta[],
  errorLog: FetchEventError[],
  blockToResumeWithOnSIGINTContainer: { blockNumber: number },
): Promise<(result: EventsFromBlockResult) => void> {
  return async (result) => {
    if (result.eventsToReturn.length > 0) {
      eventLog.push(...result.eventsToReturn);
      console.log(new Date(), `pushed ${result.eventsToReturn.length} events for ${result.contractName}`);
      fs.writeFileSync(getEventsLogPath(result.contractName), JSON.stringify(eventLog), 'utf-8');
    }
    if (result.error) {
      errorLog.push({ error: result.error, blockNumber: result.blockNumber });
      fs.writeFileSync(getEventErrorsPath(result.contractName), JSON.stringify(errorLog), 'utf-8');
    }
    blockToResumeWithOnSIGINTContainer.blockNumber = result.blockNumber;
    if (result.blockNumber % 200 === 0) {
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
            (now - benchTimeIntermediateStart) / 2,
          )}[seconds.fraction] per 100 blocks`,
        );
      }
      benchTimeIntermediateStart = now;
      api = await apiProviderWrapper.getAndWaitForReady(false);
    }
  };
}

function getEventErrorsPath(contractName: string) {
  return path.join(outputPathBase, `${contractName}__errorLog.json`);
}

function getEventsLogPath(contractName: string) {
  return path.join(outputPathBase, `${contractName}__events.json`);
}

async function getEventsByContract<TContract extends IWithAbi & IWithAddress>(
  blockNumber: number,
  api: ApiPromise,
  contract: TContract,
): Promise<EventsFromBlockResult> {
  const eventsToReturn: EventWithMeta[] = [];
  const contractName = contract.abi.info.contract.name.toString();
  let blockHash: BlockHash = '' as any;
  try {
    blockHash = (await api.rpc.chain.getBlockHash(blockNumber)) as any;
    const apiAt = await api.at(blockHash);
    const events: any = await apiAt.query.system.events();

    for (const record of events) {
      const { event } = record;

      if (event.method === 'ContractEmitted') {
        const [address, data] = record.event.data;

        if (address.toString() === contract.address.toString()) {
          const decodeEventResult = contract.abi.decodeEvent(data);
          const { args: eventArgs, event: ev } = decodeEventResult;
          const timestamp = await apiAt.query.timestamp.now();

          const _event: Record<string, any> = {};
          for (let argI = 0; argI < eventArgs.length; argI++) {
            _event[ev.args[argI].name] = eventArgs[argI].toJSON();
          }
          const eventName = ev.identifier.toString();
          const eventRet = handleEventReturn(_event, getEventTypeDescription(eventName, EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL));

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
          eventsToReturn.push(replaceRNBNPropsWithStrings(eventRetWithMeta));
        }
      }
    }
  } catch (e: any) {
    console.log('storing and exiting', e);
    fs.writeFileSync(getEventErrorsPath(contractName), JSON.stringify(errorLog), 'utf-8');
    storeWholeRunResults(startBlockNumber, endBlockNumber, errorLog.length === 0);
    process.exit(1);
  }
  return { contractName, blockNumber, blockHash, eventsToReturn };
}

// eslint-disable-next-line eqeqeq
const RUN_CONTINUOUSLY = (process.env.RUN_CONTINUOUSLY == 'true' || process.env.RUN_CONTINUOUSLY == '1') ?? false;

let benchTimeIntermediateStart: number | null = null;

async function runContinously(
  initStartBlockNumber: number,
  api: ApiPromise,
  errorLog: FetchEventError[],
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  lendingPool: LendingPool,
  eventLog: EventWithMeta[],
  blockToResumeWithOnSIGINTContainer: { blockNumber: number },
) {
  let startBlockNumber = initStartBlockNumber + 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const endBlockNumberFromApi = await getLatestBlockNumber(api);
    addBlocksToTheQueue(errorLog, queue, api, lendingPool, eventLog, blockToResumeWithOnSIGINTContainer, startBlockNumber, endBlockNumberFromApi);
    startBlockNumber = endBlockNumberFromApi + 1;
    await sleep(1000);
  }
}

async function getStartEndBlockNumbers(api: ApiPromise) {
  const { endBlockNumber: prevRunEndBlockNumber } = await getLastFetchResult();
  const startBlockNumber = (prevRunEndBlockNumber ?? START_BLOCK_NUMBER_EARLIEST) + 1;
  const endBlockNumberFromApi = startBlockNumber + 500_000; // await getLatestBlockNumber(api);
  return { startBlockNumber, endBlockNumber: endBlockNumberFromApi };
}

function addBlocksToTheQueue(
  errorLog: FetchEventError[],
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  api: ApiPromise,
  lendingPool: LendingPool,
  eventLog: EventWithMeta[],
  blockToResumeWithOnSIGINTContainer: { blockNumber: number },
  startBlockNumber: number,
  endBlockNumber: number,
) {
  console.log(new Date(), 'adding blocks to the queue from range...', { startBlockNumber, endBlockNumber });
  const blockNumbersToReanalyze = errorLog.splice(0, errorLog.length).map((errInfo) => errInfo.blockNumber);
  if (blockNumbersToReanalyze.length > 0) {
    console.warn(`Adding failed blocks to the queue...`, blockNumbersToReanalyze);
    for (const blockNumber of blockNumbersToReanalyze) {
      queue
        .add(() => getEventsByContract(blockNumber, api, lendingPool as any))
        .then((res) => createStoreEventsAndErrors(api, eventLog, errorLog, blockToResumeWithOnSIGINTContainer).then((handleFunc) => handleFunc(res)))
        .catch((e) => {
          throw new Error('rethrowing from queue', e);
        });
    }
    fs.writeFileSync(getEventErrorsPath(lendingPool.name), JSON.stringify([]), 'utf-8');
  }

  for (let blockNumber = startBlockNumber; blockNumber < endBlockNumber; blockNumber++) {
    queue
      .add(() => getEventsByContract(blockNumber, api, lendingPool as any))
      .then((res) => createStoreEventsAndErrors(api, eventLog, errorLog, blockToResumeWithOnSIGINTContainer).then((handleFunc) => handleFunc(res)))
      .catch((e) => {
        throw new Error('rethrowing from queue', e);
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

let errorLog: FetchEventError[] = [];
let startBlockNumber: number;
let endBlockNumber: number;

const queue = new PQueue({ concurrency: 100, autoStart: false });
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';
  const api = await apiProviderWrapper.getAndWaitForReady();
  const res = await getStartEndBlockNumbers(api);
  startBlockNumber = res.startBlockNumber;
  endBlockNumber = res.endBlockNumber;

  const signer = keyring.createFromUri(seed, {}, 'sr25519');
  const lendingPool = await getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);

  //TODO DB
  errorLog = getPreviousErrors(lendingPool.abi.info.contract.name.toString());
  const eventLog: EventWithMeta[] = getPreviousEvents(lendingPool.abi.info.contract.name.toString());

  const blockToResumeWithOnSIGINTContainer: { blockNumber: number } = { blockNumber: startBlockNumber };
  try {
    addBlocksToTheQueue(errorLog, queue, api, lendingPool, eventLog, blockToResumeWithOnSIGINTContainer, startBlockNumber, endBlockNumber);
    ensureQueueItemsFinishOnProcessExitSignal(queue, startBlockNumber, blockToResumeWithOnSIGINTContainer, errorLog);

    console.log(`amount of blocks to process:`, queue.size);
    queue.start();
    await queue.onIdle();
  } catch (e) {
    console.log('error while analyzing past blocks...');
    console.log('storing results and exiting');
    storeWholeRunResults(startBlockNumber, endBlockNumber, errorLog.length === 0);
    console.log(e);
    process.exit(1);
  }

  storeWholeRunResults(startBlockNumber, endBlockNumber, errorLog.length === 0);
  if (!RUN_CONTINUOUSLY) {
    console.log(`Continuous mode off. Exiting...`);
    await api.disconnect();
    process.exit(0);
  }

  console.log('Continuous mode on. Running continuous scan...');
  await runContinously(endBlockNumber, api, errorLog, queue, lendingPool, eventLog, blockToResumeWithOnSIGINTContainer);
})(getArgvObj()).catch((e) => {
  if (startBlockNumber && endBlockNumber) storeWholeRunResults(startBlockNumber, endBlockNumber, errorLog.length === 0);
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
