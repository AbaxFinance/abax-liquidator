import { handleEventReturn } from '@727-ventures/typechain-types';
import { ApiPromise } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import Keyring from '@polkadot/keyring';
import chalk from 'chalk';
import fs from 'fs-extra';
import PQueue, { DefaultAddOptions } from 'p-queue';
import path from 'path';
import { AToken, LendingPool, VToken, getEventTypeDescription, replaceRNBNPropsWithStrings } from '@abaxfinance/contract-helpers';
import { apiProviderWrapper } from './common';
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

const getOutputPathBase = (dirname = 'scan_results') => path.join(path.parse(__filename).dir, dirname);
type EventsFromBlockResult = {
  blockTimestamp: string;
  blockNumber: number;
  eventsByContractAddress: Record<string, EventWithMeta[]>;
  error?: Error;
  blockHash: BlockHash;
};

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

export const getPreviousEventsFromFile = (dirname?: string) => {
  try {
    const eventsPath = getEventsLogPath(dirname);
    if (!fs.existsSync(eventsPath)) return [];
    return JSON.parse(fs.readFileSync(eventsPath, 'utf8')) as EventWithMeta[];
  } catch (e) {
    console.warn(`Unable to retrieve eventLog`);
    return [];
  }
};

const getAnalyzedBlocksFromFile = () => {
  try {
    const prevErrPath = getAnalyzedBlocksPath();
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

async function getLatestBlockNumber(api: ApiPromise) {
  const latestSignedBlock = await api.rpc.chain.getBlock();
  const endBlockNumber = latestSignedBlock.block.header.number.toNumber();
  return endBlockNumber;
}

const SAVE_INTERVAL = 500;
const BENCH_STATS_DIVIDER = SAVE_INTERVAL / 100;
let blockBenchCounter = 0;
let benchTimeIntermediateStart: number | null = null;
function storeEventsAndErrors(result: EventsFromBlockResult, listenMode = false) {
  if (analyzedBlocksSet.has(result.blockNumber)) {
    console.warn(`duplicate analysis of block ${result.blockNumber}`);
    return;
  } else {
    analyzedBlocksSet.add(result.blockNumber);
    blockBenchCounter++;
  }
  if (Object.keys(result.eventsByContractAddress).length > 0) {
    for (const [contractName, events] of Object.entries(result.eventsByContractAddress)) {
      eventLog.push(...events);
      console.log(new Date(), `pushed ${events.length} events for ${contractName} | block: ${result.blockNumber}`);
    }
  }
  if (blockBenchCounter >= SAVE_INTERVAL || listenMode) {
    blockBenchCounter = 0;
    fs.writeFileSync(getEventsLogPath(), JSON.stringify(eventLog, null, 2), 'utf-8');
    storeAnalyzedBlocks();
    if (!listenMode) printStats(result);
  }
}

function printStats(result: EventsFromBlockResult) {
  const now = Date.now();
  const timestampISO = new Date(parseInt(result.blockTimestamp.toString())).toISOString();
  if (!benchTimeIntermediateStart) {
    console.log(new Date(), `Last analyzed block: ${result.blockNumber} (${timestampISO})`);
  } else {
    console.log(
      new Date(),
      `Last analyzed block: ${result.blockNumber} (${timestampISO}) Speed: ${new TimeSpanFormatter(false).format(
        's.f',
        (now - benchTimeIntermediateStart) / BENCH_STATS_DIVIDER,
      )}seconds per ${SAVE_INTERVAL / BENCH_STATS_DIVIDER} blocks`,
    );
  }
  benchTimeIntermediateStart = now;
}

function storeAnalyzedBlocks() {
  const blocksToStore: number[] = [];
  for (const val of analyzedBlocksSet.values()) {
    blocksToStore.push(val);
  }
  fs.writeFileSync(getAnalyzedBlocksPath(), JSON.stringify(blocksToStore, null, 2), 'utf-8');
}

function getAnalyzedBlocksPath() {
  return path.join(getOutputPathBase(), `analyzedBlocks.json`);
}

function getEventsLogPath(dirname?: string) {
  return path.join(getOutputPathBase(dirname), `eventLog.json`);
}

async function getEventsByContract<TContract extends IWithAbi & IWithAddress>(
  blockNumber: number,
  api: ApiPromise,
  contracts: TContract[],
): Promise<EventsFromBlockResult> {
  const blockHash: BlockHash = (await api.rpc.chain.getBlockHash(blockNumber)) as any;
  const apiAt = await api.at(blockHash);
  const events: any = await apiAt.query.system.events();
  const timestamp = await apiAt.query.timestamp.now();

  return parseBlockEvents<TContract>(events, contracts, timestamp.toString(), blockNumber, blockHash);
}

const arrayRange = (start: number, stop: number, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);
function parseBlockEvents<TContract extends IWithAbi & IWithAddress>(
  events: any,
  contracts: TContract[],
  timestamp: string,
  blockNumber: number,
  blockHash: BlockHash,
) {
  const eventsToReturnByContractAddress: Record<string, EventWithMeta[]> = {};
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
  return { blockTimestamp: timestamp, blockNumber, blockHash, eventsByContractAddress: eventsToReturnByContractAddress };
}

async function listenToNewEvents<TContract extends IWithAbi & IWithAddress>(contracts: TContract[]) {
  const freshApi = await apiProviderWrapper.getAndWaitForReadyNoCache();
  try {
    console.log('#### attaching listener to api.query.system.events ####');
    freshApi.query.system.events(function (events: { createdAtHash: { toHuman: () => BlockHash } }) {
      const blockHash = events.createdAtHash.toHuman();
      freshApi.derive.chain.getBlock(blockHash).then((block) => {
        const blockNumber = block.block.header.number;
        const timestampExtrinistic = block.extrinsics.find(
          (ex) => ex.extrinsic.method.method.toString() === 'set' && ex.extrinsic.method.section.toString() === 'timestamp',
        );
        if (!timestampExtrinistic) throw new Error('There is no timestamp extrinistic in block :C');
        const res = parseBlockEvents(events, contracts, timestampExtrinistic.extrinsic.method.args[0].toString(), blockNumber.toNumber(), blockHash);
        storeEventsAndErrors(res, true);
      });
    });
  } catch (e) {
    console.error(e);
    console.error('ERROR WHILE ANALYZING BLOCK || RETRYING');
    await freshApi.disconnect();
    listenToNewEvents(contracts);
  }
}

function addBlockRangeToTheQueue<TContract extends IWithAbi & IWithAddress>(
  queue: PQueue<PriorityQueue, DefaultAddOptions>,
  api: ApiPromise,
  contracts: TContract[],
  blockNumbers: number[],
) {
  console.log(
    new Date(),
    `adding ${blockNumbers.length} blocks to the queue from range...[${blockNumbers[0]}...${blockNumbers[blockNumbers.length - 1]}]`,
  );
  for (const blockNumber of blockNumbers) {
    queue
      .add(() => getEventsByContract(blockNumber, api, contracts))
      .then((res) => storeEventsAndErrors(res))
      .catch((e) => {
        console.log(e);
        process.exit(1);
      });
  }
}
const eventLog: EventWithMeta[] = [];
const analyzedBlocksSet = new LargeSet<number>();
const queue = new PQueue({ concurrency: 30, autoStart: false });
const QUEUE_CHUNK_SIZE = 10_000;
const START_BLOCK_NUMBER_PRE_DEPLOYMENT = 44719900;
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';
  fs.ensureDir(getOutputPathBase());
  const api = await apiProviderWrapper.getAndWaitForReady();

  //TODO DB
  populateInMemoryEventLog();
  populateAlreadyAnalyzedBlockNumbers();
  ///
  const contracts = getContractsToFetchEventsFor(seed, api);
  listenToNewEvents(contracts);

  await processPastBlocks(api, contracts);
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED ERROR\n', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});

async function processPastBlocks(api: ApiPromise, contracts: (LendingPool | AToken | VToken)[]) {
  const blocksToCatchUpToNow = await getBlocksToCatchUpToNow(api);
  console.log('total number of blocks to process to catch up to now: ', blocksToCatchUpToNow.length);

  ensureQueueItemsFinishOnProcessExitSignal(queue);
  try {
    for (let i = 0; i < blocksToCatchUpToNow.length; i += QUEUE_CHUNK_SIZE) {
      const currentChunk = blocksToCatchUpToNow.slice(i, i + QUEUE_CHUNK_SIZE);
      addBlockRangeToTheQueue(queue, api, contracts, currentChunk);
      queue.start();
      await queue.onIdle();

      queue.pause();
    }
    console.log(`#### analyzed past/missing/pending blocks ####`);
  } catch (e) {
    console.log('error while analyzing blocks...');
    console.log(e);
    process.exit(1);
  }
}

async function getBlocksToCatchUpToNow(api: ApiPromise) {
  const blocksToCatchUpSet = new LargeSet<number>();
  const latestBlockNumber = await getLatestBlockNumber(api);
  for (let currentBlockNumber = START_BLOCK_NUMBER_PRE_DEPLOYMENT; currentBlockNumber <= latestBlockNumber; currentBlockNumber++) {
    if (!analyzedBlocksSet.has(currentBlockNumber)) blocksToCatchUpSet.add(currentBlockNumber);
  }

  const blocksToAnalyze: number[] = [];
  for (const val of blocksToCatchUpSet.values()) {
    blocksToAnalyze.push(val);
  }
  return blocksToAnalyze;
}

function getContractsToFetchEventsFor(seed: string, api: ApiPromise) {
  const LENDING_POOL_ADDRESS = '5GBai32Vbzizw3xidVUwkjzFydaas7s2B8uudgtiguzmW8yn';
  const ADAI_ADDRESS = '5GusvrnNEfYThkDxdSUZRca9ScTiVyrF3S76UJEQTUXBDdmT';
  const VDAI_ADDRESS = '5EkScoCUiXCraQw5kSbknbugVEhWod9xMv4PRkyo9MHTREXw';
  const AUSDC_ADDRESS = '5EVfH2BRm2ggimfRcuEH8zRYkviyEN69et4fDjHWHzWjirBK';
  const VUSDC_ADDRESS = '5CdF6Vdf9mAG5fjhFuNaLfFLj9i31SjxBsVj5JHBARmL5Xmd';
  const AWETH_ADDRESS = '5DvMrRU79zS29FSSP5k8CyuCK2de59Xvvqwzbm1UzqNWwxFY';
  const VWETH_ADDRESS = '5HY4mmPQuMDakTDeaf6Cj5TJaSbmb7G3fHczcyuyhmU6UeVR';
  const ABTC_ADDRESS = '5GZm7bsGE53Gyf9Cg2GwsTjDrP9skY6A6uSZiCFWDoEZyMtj';
  const VBTC_ADDRESS = '5EEurzNsm5SMDSJBHbtu4GHbkdSsHdjPbWNb28vxpEWkZJWX';
  const AAZERO_ADDRESS = '5Da8px1HEoAvs3m9i55ftfSswDbskqCY4rHr1KAFsTqfiTia';
  const VAZERO_ADDRESS = '5ChJnTSpsQ26zJGyGt7uHHLRjbquAy1JSmaijMujUi9VKfJL';
  const ADOT_ADDRESS = '5D1dwQEhyXzVDuB8RX85xm9iNa4pTtUr2jVpYHNFte7FxRTw';
  const VDOT_ADDRESS = '5HDidr2RT4VGkxyGuJieGAfqYpqphwviB4WULaNp6VNsf2B2';

  const keyring = new Keyring();
  const signer = keyring.createFromUri(seed, {}, 'sr25519');

  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
  const aTokens = [ADAI_ADDRESS, AAZERO_ADDRESS, ABTC_ADDRESS, ADOT_ADDRESS, AUSDC_ADDRESS, AWETH_ADDRESS].map((addr) =>
    getContractObject(AToken, addr, signer, api),
  );
  const vTokens = [VDAI_ADDRESS, VAZERO_ADDRESS, VBTC_ADDRESS, VDOT_ADDRESS, VUSDC_ADDRESS, VWETH_ADDRESS].map((addr) =>
    getContractObject(VToken, addr, signer, api),
  );

  const contracts = [lendingPool, ...aTokens, ...vTokens];
  return contracts;
}

function populateAlreadyAnalyzedBlockNumbers() {
  const analyzedBlocksFromStorage = getAnalyzedBlocksFromFile();
  analyzedBlocksFromStorage.forEach((b) => {
    analyzedBlocksSet.add(b);
  });
}

function populateInMemoryEventLog() {
  const prevLog = getPreviousEventsFromFile();
  for (const e of prevLog) {
    eventLog.push(e);
  }
}
