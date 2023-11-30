import { AToken, LendingPool, VToken } from '@abaxfinance/contract-helpers';
import { ApiPromise } from '@polkadot/api';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { db } from 'db';
import { analyzedBlocks } from 'db/schema';
import { getTableName, sql } from 'drizzle-orm';
import PQueue, { DefaultAddOptions } from 'p-queue';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { TimeSpanFormatter } from 'scripts/benchmarking/utils';
import { ApiProviderWrapper, sleep } from 'scripts/common';
import { parseBlockEvents, storeEventsAndErrors } from 'src/event-feeder/EventListener';
import { logger } from 'src/logger';
import { EventsFromBlockResult, IWithAbi, IWithAddress } from 'src/types';
import { getLatestBlockNumber, getLendingPoolContractAddresses } from 'src/utils';

const QUEUE_CHUNK_SIZE = 10_000;
const START_BLOCK_NUMBER_PRE_DEPLOYMENT = 44719900;
const BENCH_BLOCKS_INTERVAL = 500;
const BENCH_STATS_DIVIDER = BENCH_BLOCKS_INTERVAL / 100;

export class EventAnalyzeEnsurer {
  apiProviderWrapper: ApiProviderWrapper;
  queue: any;
  blockBenchCounter = 0;
  benchTimeIntermediateStart: number | null = null;

  constructor() {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
    this.queue = new PQueue({ concurrency: 30, autoStart: false });
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info('EventAnalyzeEnsurer', 'running...');
      const seed = process.env.SEED;
      if (!seed) throw 'could not determine seed';

      const api = await this.apiProviderWrapper.getAndWaitForReady();
      const contracts = getLendingPoolContractAddresses(seed, api);
      await this.ensureBlockAnalysis(this.queue, api, contracts);
      logger.info('EventAnalyzeEnsurer', 'sleeping for 1 min...');
      await sleep(1 * 60 * 1000);
    }
  }
  addBlockRangeToTheQueue<TContract extends IWithAbi & IWithAddress>(
    queue: PQueue<PriorityQueue, DefaultAddOptions>,
    api: ApiPromise,
    contracts: TContract[],
    blockNumbers: number[],
  ) {
    logger.info(`adding ${blockNumbers.length} blocks to the queue from range...[${blockNumbers[0]}...${blockNumbers[blockNumbers.length - 1]}]`);
    for (const blockNumber of blockNumbers) {
      queue
        .add(() => getEventsByContract(blockNumber, api, contracts))
        .then((res) => storeEventsAndErrors(res))
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

  async ensureBlockAnalysis(queue: PQueue, api: ApiPromise, contracts: (LendingPool | AToken | VToken)[]) {
    const blocksToCatchUpToNow = await getBlocksToCatchUpToNow(api);
    logger.info('total number of blocks to process to catch up to now: ', blocksToCatchUpToNow.length);

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

async function getEventsByContract<TContract extends IWithAbi & IWithAddress>(
  blockNumber: number,
  api: ApiPromise,
  contracts: TContract[],
): Promise<EventsFromBlockResult> {
  const blockHash: BlockHash = (await api.rpc.chain.getBlockHash(blockNumber)) as any;
  const apiAt = await api.at(blockHash);
  const eventsToParse: any = await apiAt.query.system.events();
  const timestamp = await apiAt.query.timestamp.now();

  return parseBlockEvents<TContract>(eventsToParse, contracts, timestamp.toString(), blockNumber, blockHash);
}

async function getBlocksToCatchUpToNow(api: ApiPromise) {
  const ret = await getMissingOrFailedToAnalyzeBlocks();

  const blocksToAnalyze: number[] = [];
  for (const { nstart, nend } of ret) {
    for (let currB = nstart; currB <= nend; currB++) {
      blocksToAnalyze.push(currB);
    }
  }

  const lastBlockNumberInDb = await getLastBlockNumberInDb();
  const latestBlockNumber = await getLatestBlockNumber(api);
  for (let currB = lastBlockNumberInDb; currB < latestBlockNumber; currB++) {
    blocksToAnalyze.push(currB);
  }
  return blocksToAnalyze.sort();
}

async function getMissingOrFailedToAnalyzeBlocks() {
  return await db.execute<{ nstart: number; nend: number }>(
    sql.raw(`
  SELECT nstart,
         nend
  FROM
    (SELECT m."${analyzedBlocks.blockNumber.name}" + 1 AS nstart,
       (SELECT min("${analyzedBlocks.blockNumber.name}") - 1
        FROM "${getTableName(analyzedBlocks)}" x
        WHERE x."${analyzedBlocks.blockNumber.name}" > m."${analyzedBlocks.blockNumber.name}") AS nend
     FROM "${getTableName(analyzedBlocks)}" m
     LEFT JOIN
       (SELECT r."${analyzedBlocks.blockNumber.name}"-1 AS bn
        FROM "${getTableName(analyzedBlocks)}" r) AS r ON (m."${analyzedBlocks.blockNumber.name}" = r."bn")
     WHERE r."bn" IS NULL ) x
  WHERE nend IS NOT NULL
  ORDER BY nstart
    `),
  );
}

async function getLastBlockNumberInDb() {
  const lastBlockNumberRes = await db.execute<{ maxblocknumber: number }>(
    sql.raw(`SELECT max("${analyzedBlocks.blockNumber.name}") as maxblocknumber FROM "${getTableName(analyzedBlocks)}"`),
  );
  const lastBlockNumberInDb = lastBlockNumberRes[0]?.maxblocknumber ?? START_BLOCK_NUMBER_PRE_DEPLOYMENT;
  return lastBlockNumberInDb;
}

export function ensureQueueItemsFinishOnProcessExitSignal(queue: PQueue<PriorityQueue, DefaultAddOptions>) {
  ['SIGINT', 'SIGQUIT', 'SIGTERM'].map((signal) =>
    process.on(signal, () => {
      if (process.env.DEBUG) logger.info(signal);
      if (process.env.DEBUG) logger.info('Pausing queue...');
      queue.pause();
      const intervalID = setInterval(() => {
        if (queue.pending > 0) {
          if (process.env.DEBUG) logger.info(`pending: ${queue.pending} items`);
          return;
        }
        if (process.env.DEBUG) logger.info('no more items pending in queue...');
        clearInterval(intervalID);
        process.exit(0);
      }, 500);
    }),
  );
}
