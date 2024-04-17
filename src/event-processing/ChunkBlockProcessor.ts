import { AToken, ApiProviderWrapper, LendingPool, Psp22Emitable, Psp22Ownable, VToken } from 'wookashwackomytest-contract-helpers';
import { ApiPromise } from '@polkadot/api';
import { TimeSpanFormatter } from '@scripts/utils';
import { BaseActor } from '@src/base-actor/BaseActor';
import {
  ensureQueueItemsFinishOnProcessExitSignal,
  getEventsByContract,
  getLastBlockNumberInDbFromRange,
  getMissingOrFailedToAnalyzeBlocksFromRange,
  storeEventsAndErrors,
} from '@src/event-processing/shared';
import { getContractsToListenEvents } from '@src/event-processing/utils';
import { logger } from '@src/logger';
import type { EventsFromBlockResult, IWithAbi, IWithAddress } from '@src/types';
import PQueue from 'p-queue';

const QUEUE_CHUNK_SIZE = 20_000;
const BENCH_BLOCKS_INTERVAL = 500;
const BENCH_STATS_DIVIDER = BENCH_BLOCKS_INTERVAL / 100;

export class ChunkBlockProcessor extends BaseActor {
  apiProviderWrapper: ApiProviderWrapper;
  queue: any;
  blockBenchCounter = 0;
  benchTimeIntermediateStart: number | null = null;

  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
    this.queue = new PQueue({ concurrency: 50, autoStart: false });
  }

  async runLoop() {
    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const contracts = getContractsToListenEvents(api);
    await this.runAnalysis(this.queue, api, contracts);
    logger.info('ChunkBlockProcessor | Done analyzing chunk');
  }
  addBlockRangeToTheQueue<TContract extends IWithAbi & IWithAddress>(queue: PQueue, api: ApiPromise, contracts: TContract[], blockNumbers: number[]) {
    logger.info(`adding ${blockNumbers.length} blocks to the queue from range...[${blockNumbers[0]}...${blockNumbers[blockNumbers.length - 1]}]`);
    for (const blockNumber of blockNumbers) {
      queue
        .add(() => getEventsByContract(blockNumber, api, contracts))
        .then((res) => storeEventsAndErrors(res!))
        .then((resOrFailed) => {
          this.blockBenchCounter++;
          if (resOrFailed && (resOrFailed as EventsFromBlockResult).blockTimestamp && this.blockBenchCounter >= BENCH_BLOCKS_INTERVAL) {
            this.blockBenchCounter = 0;
            this.printStats(resOrFailed);
          }
        })
        .catch((e) => {
          logger.info(e);
          process.exit(1);
        });
    }
  }

  async runAnalysis(queue: PQueue, api: ApiPromise, contracts: (LendingPool | AToken | VToken | Psp22Emitable | Psp22Ownable)[]) {
    const blocksToAnalyze = await getBlocksToAnalyze();
    logger.info(`total number of blocks to process to analyze: ${blocksToAnalyze.length}`);

    ensureQueueItemsFinishOnProcessExitSignal(queue);
    try {
      for (let i = 0; i < blocksToAnalyze.length; i += QUEUE_CHUNK_SIZE) {
        const currentChunk = blocksToAnalyze.slice(i, i + QUEUE_CHUNK_SIZE);
        this.addBlockRangeToTheQueue(queue, api, contracts, currentChunk);
        queue.start();
        await queue.onIdle();

        queue.pause();
      }
      logger.info(`#### analyzed past/missing/pending blocks ####`);
    } catch (e) {
      logger.info('error while analyzing blocks...');
      logger.info(e);
      process.exit(1);
    }
  }
  printStats(result: EventsFromBlockResult) {
    const now = Date.now();
    const timestampISO = new Date(parseInt(result.blockTimestamp.toString())).toISOString();
    if (!this.benchTimeIntermediateStart) {
      logger.info(`Last analyzed block: ${result.blockNumber} (${timestampISO})`);
    } else {
      logger.info(
        `Last analyzed block: ${result.blockNumber} (${timestampISO}) Speed: ${new TimeSpanFormatter(false).format(
          's.f',
          (now - this.benchTimeIntermediateStart) / BENCH_STATS_DIVIDER,
        )}seconds per ${BENCH_BLOCKS_INTERVAL / BENCH_STATS_DIVIDER} blocks`,
      );
    }
    this.benchTimeIntermediateStart = now;
  }
}

async function getBlocksToAnalyze() {
  const start = process.env.START_BLOCK ? parseInt(process.env.START_BLOCK) : NaN;
  const end = process.env.END_BLOCK ? parseInt(process.env.END_BLOCK) : NaN;
  const ret = await getMissingOrFailedToAnalyzeBlocksFromRange({ start, end });
  const blocksToAnalyze: number[] = [];
  for (const { nstart, nend } of ret) {
    for (let currB = nstart; currB <= nend; currB++) {
      if (start > currB || end < currB) continue; //TODO
      blocksToAnalyze.push(currB);
    }
  }

  const lastAnalyzedBlockNumber = await getLastBlockNumberInDbFromRange({ start, end });
  for (let currB = lastAnalyzedBlockNumber; currB < end; currB++) {
    if (start > currB || end < currB) continue; //TODO
    blocksToAnalyze.push(currB);
  }
  return blocksToAnalyze.sort();
}
