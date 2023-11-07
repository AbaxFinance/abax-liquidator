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
import { getLatestBlockNumber, getLendingPoolContractAddresses } from 'src/utils';
import { EventWithMeta, EventsFromBlockResult, IWithAbi, IWithAddress } from 'src/types';
// import { addBlockRangeToTheQueue } from 'src/event-feeder/EventAnalyzeEnsurer';
import { listenToNewEvents } from 'src/event-feeder/EventListener';

const getOutputPathBase = (dirname = 'scan_results') => path.join(path.parse(__filename).dir, dirname);

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

export const getAnalyzedBlocksFromFile = () => {
  try {
    const prevErrPath = getAnalyzedBlocksPath();
    if (!fs.existsSync(prevErrPath)) return [];
    return JSON.parse(fs.readFileSync(prevErrPath, 'utf-8')) as number[];
  } catch (e) {
    console.warn(`Unable to retrieve pending blocks file`);
    return [];
  }
};

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

const arrayRange = (start: number, stop: number, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);

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
  const contracts = getLendingPoolContractAddresses(seed, api);
  const apiToListen = await apiProviderWrapper.getAndWaitForReadyNoCache();
  listenToNewEvents(apiToListen, contracts);

  await processPastBlocks(api, contracts);
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED ERROR\n', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});

async function processPastBlocks(api: ApiPromise, contracts: (LendingPool | AToken | VToken)[]) {
  const blocksToCatchUpToNow = await getBlocksToCatchUpToNow(api);
  console.log('total number of blocks to process to catch up to now: ', blocksToCatchUpToNow.length);

  // ensureQueueItemsFinishOnProcessExitSignal(queue);
  try {
    for (let i = 0; i < blocksToCatchUpToNow.length; i += QUEUE_CHUNK_SIZE) {
      const currentChunk = blocksToCatchUpToNow.slice(i, i + QUEUE_CHUNK_SIZE);
      // addBlockRangeToTheQueue(queue, api, contracts, currentChunk);
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
