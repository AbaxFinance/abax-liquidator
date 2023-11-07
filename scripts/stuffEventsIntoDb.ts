import { u8aToHex } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';
import chalk from 'chalk';
import { db } from 'db';
import { getAnalyzedBlocksFromFile, getPreviousEventsFromFile } from 'scripts/fetchEvents';
import { analyzedBlocks, events, lpTrackingData } from '../db/schema';
import { getTableName, sql } from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';
import { EventWithMeta } from '/home/lukas/repos/abax/abax-liquidator/src/types';
enum HF_PRIORITY {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  SAFE = 4,
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const ONE_MINUTE = 60 * 1000;

const UPDATE_INTERVAL_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: 1 * ONE_MINUTE,
  [HF_PRIORITY.HIGH]: 3 * ONE_MINUTE,
  [HF_PRIORITY.MEDIUM]: 5 * ONE_MINUTE,
  [HF_PRIORITY.LOW]: 15 * ONE_MINUTE,
  [HF_PRIORITY.SAFE]: 120 * ONE_MINUTE,
};

const HF_RANGE_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: [0.0, 1.05] as const,
  [HF_PRIORITY.HIGH]: [1.05, 1.2] as const,
  [HF_PRIORITY.MEDIUM]: [1.2, 1.5] as const,
  [HF_PRIORITY.LOW]: [1.5, 2.0] as const,
  [HF_PRIORITY.SAFE]: [2.0, Number.MAX_SAFE_INTEGER] as const,
};
async function pruneDatabase() {
  console.log(`Deleting all rows from events/lpTrackingData/analyzedBlocks...`);
  await db.delete(events);
  await db.delete(lpTrackingData);
  await db.delete(analyzedBlocks);
  console.log(`Deleted...`);
}
(async () => {
  if (require.main !== module) return;
  await pruneDatabase();
  return;
  const eventLog = getPreviousEventsFromFile();
  await populateEventsTable(eventLog);
  await populatelpTrackingDataTable(eventLog);
  const analyzedBlocksList = getAnalyzedBlocksFromFile();
  await populateAnalyzedBlocksTable(analyzedBlocksList);
  process.exit(0);
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
async function populatelpTrackingDataTable(eventLog: EventWithMeta[]) {
  const allAddresses: string[] = eventLog.flatMap((e) => [e.event.caller, e.event.from, e.event.to]).filter((e) => !!e);
  const uniqueAddresses = [...new Set(allAddresses)];
  console.log(`${uniqueAddresses.length} user addresses to load....`);
  const insertedIds = await db
    .insert(lpTrackingData)
    .values(
      uniqueAddresses.map((addr) => ({
        address: addr,
        healthFactor: 0,
        updatePriority: 0,
        updateAtLatest: new Date(Date.now() + UPDATE_INTERVAL_BY_HF_PRIORITY[HF_PRIORITY.CRITICAL]),
      })),
    )
    .returning({ insertedId: lpTrackingData.id })
    .onConflictDoNothing();
  console.log(`Loaded ${insertedIds.length} addresses`);
}

async function populateEventsTable(eventLog: EventWithMeta[]) {
  console.log(`${eventLog.length} events to load....`);
  const insertedIds = await db
    .insert(events)
    .values(
      eventLog.map((e) => ({
        blockHash: e.meta.blockHash,
        contractAddress: e.meta.contractAddress,
        contractName: e.meta.contractName,
        blockNumber: e.meta.blockNumber,
        data: e.event,
        name: e.meta.eventName,
        blockTimestamp: new Date(e.meta.timestampISO),
        hash: u8aToHex(blake2AsU8a(JSON.stringify(e), 256), undefined, false),
      })),
    )
    .returning({ insertedId: events.id })
    .onConflictDoNothing();
  console.log(`Loaded ${insertedIds.length} events`);
  return insertedIds;
}

async function populateAnalyzedBlocksTable(analyzedBlocksList: number[]) {
  const CHUNK_SIZE = 65_000;
  console.log(`${analyzedBlocksList.length} events to load.... ${Math.ceil(analyzedBlocksList.length / CHUNK_SIZE)} chunks`);
  const insertedBlockNumbers: number[] = [];
  try {
    for (let i = 0; i < analyzedBlocksList.length; i += CHUNK_SIZE) {
      const currentChunk = analyzedBlocksList.slice(i, i + CHUNK_SIZE);
      console.log(`loading chunk...${currentChunk.length} to load...`);
      const chunkInsertedBlockNumbers = await db
        .insert(analyzedBlocks)
        .values(currentChunk.map((n) => ({ blockNumber: n })))
        .returning({ blockNumber: analyzedBlocks.blockNumber })
        .onConflictDoNothing();
      insertedBlockNumbers.push(...chunkInsertedBlockNumbers.map((n) => n.blockNumber));
    }
    console.log(`#### analyzed past/missing/pending blocks ####`);
  } catch (e) {
    console.log('error while analyzing blocks...');
    console.log(e);
    process.exit(1);
  }

  console.log(`Loaded ${insertedBlockNumbers.length} analyzed block ids`);
  return insertedBlockNumbers;
}
