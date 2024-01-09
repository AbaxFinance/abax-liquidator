import { AToken, ApiProviderWrapper, LendingPool, Psp22Emitable, Psp22Ownable, VToken } from '@abaxfinance/contract-helpers';
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
import { getLatestBlockNumber } from '@src/utils';
import PQueue from 'p-queue';

const QUEUE_CHUNK_SIZE = 20_000;
const BENCH_BLOCKS_INTERVAL = 500;
const BENCH_STATS_DIVIDER = BENCH_BLOCKS_INTERVAL / 100;

export class PastBlocksProcessor extends BaseActor {
  apiProviderWrapper: ApiProviderWrapper;
  queue: any;
  blockBenchCounter = 0;
  benchTimeIntermediateStart: number | null = null;

  constructor() {
    super();
    const wsEndpoint = process.env.RPC_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
    this.queue = new PQueue({ concurrency: 40, autoStart: false });
  }

  async loopAction() {
    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const contracts = getContractsToListenEvents(api);
    await this.ensureBlockAnalysis(this.queue, api, contracts);
    logger.info('EventAnalyzeEnsurer', 'sleeping for 1 min...');
  }
  addBlockRangeToTheQueue<TContract extends IWithAbi & IWithAddress>(queue: PQueue, api: ApiPromise, contracts: TContract[], blockNumbers: number[]) {
    logger.info(`adding ${blockNumbers.length} blocks to the queue from range...[${blockNumbers[0]}...${blockNumbers[blockNumbers.length - 1]}]`);
    for (const blockNumber of blockNumbers) {
      queue
        .add(() => getEventsByContract(blockNumber, api, contracts))
        .then((res) => storeEventsAndErrors(res!))
        .then((resOrFailed) => {
          this.blockBenchCounter++;
          if (resOrFailed && this.blockBenchCounter >= BENCH_BLOCKS_INTERVAL) {
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

  async ensureBlockAnalysis(queue: PQueue, api: ApiPromise, contracts: (LendingPool | AToken | VToken | Psp22Emitable | Psp22Ownable)[]) {
    const blocksToCatchUpToNow = await getBlocksToCatchUpToNow(api);
    logger.info(`total number of blocks to process to catch up to now: ${blocksToCatchUpToNow.length}`);

    ensureQueueItemsFinishOnProcessExitSignal(queue);
    try {
      for (let i = 0; i < blocksToCatchUpToNow.length; i += QUEUE_CHUNK_SIZE) {
        const currentChunk = blocksToCatchUpToNow.slice(i, i + QUEUE_CHUNK_SIZE);
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
    if (!result.blockTimestamp) return; //TODO
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

async function getBlocksToCatchUpToNow(api: ApiPromise) {
  const ret = await getMissingOrFailedToAnalyzeBlocksFromRange();

  const blocksToAnalyze: number[] = [];
  for (const { nstart, nend } of ret) {
    for (let currB = nstart; currB <= nend; currB++) {
      blocksToAnalyze.push(currB);
    }
  }

  const lastBlockNumberInDb = await getLastBlockNumberInDbFromRange();
  const latestBlockNumber = await getLatestBlockNumber(api);
  for (let currB = lastBlockNumberInDb; currB < latestBlockNumber; currB++) {
    blocksToAnalyze.push(currB);
  }
  return blocksToAnalyze.sort();
}
