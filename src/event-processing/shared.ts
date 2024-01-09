import type { ApiPromise } from '@polkadot/api';
import type { EventWithMeta, EventsFromBlockResult, IWithAbi, IWithAddress } from '@src/types';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { db } from '@db/index';
import { analyzedBlocks, events, lpTrackingData } from '@db/schema';
import { eq, getTableName, sql } from 'drizzle-orm';
import { logger } from '@src/logger';
import type PQueue from 'p-queue';
import { PostgresError } from 'postgres';
import { HF_PRIORITY, UPDATE_INTERVAL_BY_HF_PRIORITY } from '@src/constants';
import { u8aToHex } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { handleEventReturn } from 'wookashwackomytest-typechain-types';
import {
  EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN,
  EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL,
  EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_EMITABLE,
  EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_OWNABLE,
  EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN,
  getEventTypeDescription,
  replaceNumericPropsWithStrings,
} from '@abaxfinance/contract-helpers';

const START_BLOCK_NUMBER_PRE_DEPLOYMENT = 48565327;
export async function getEventsByContract<TContract extends IWithAbi & IWithAddress>(
  blockNumber: number,
  api: ApiPromise,
  contracts: TContract[],
): Promise<EventsFromBlockResult> {
  const blockHash = (await api.rpc.chain.getBlockHash(blockNumber)).toString();
  const apiAt = await api.at(blockHash);
  const eventsToParse: any = await apiAt.query.system.events();
  const contractsEmittedEvents = eventsToParse.filter((e: any) => e.event.method === 'ContractEmitted');
  if (contractsEmittedEvents.length === 0) {
    return { blockTimestamp: '', blockNumber, blockHash, eventsByContractAddress: {} };
  }
  const timestamp = await apiAt.query.timestamp.now();

  return parseBlockEvents<TContract>(contractsEmittedEvents, contracts, timestamp.toString(), blockNumber, blockHash.toString());
}

export async function getMissingOrFailedToAnalyzeBlocksFromRange(constraints?: { start: number; end: number }) {
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
    WHERE nend IS NOT NULL ${constraints ? `AND nstart >= ${constraints.start} AND nend <= ${constraints.end}` : ''}
    ORDER BY nstart
      `),
  );
}

export async function getLastBlockNumberInDbFromRange(constraints?: { start: number; end: number }) {
  const lastBlockNumberRes = await db.execute<{ maxblocknumber: number }>(
    sql.raw(
      `SELECT max("${analyzedBlocks.blockNumber.name}") as maxblocknumber FROM "${getTableName(analyzedBlocks)}" ${
        constraints ? `WHERE "${analyzedBlocks.blockNumber.name}" <= ${constraints.end}` : ''
      }`,
    ),
  );
  const startBlockNumberQueryRes = await db
    .select({ blockNumber: analyzedBlocks.blockNumber })
    .from(analyzedBlocks)
    .where(eq(analyzedBlocks.blockNumber, constraints?.start ?? START_BLOCK_NUMBER_PRE_DEPLOYMENT));
  if (startBlockNumberQueryRes.length === 0) {
    const fakeGenesisBlock = (constraints?.start ?? START_BLOCK_NUMBER_PRE_DEPLOYMENT) - 100;
    logger.warn(`starting block missing in db. Populating db with fake analyzed genesis block ${fakeGenesisBlock}`);
    await db.insert(analyzedBlocks).values({ blockNumber: fakeGenesisBlock }).onConflictDoNothing();
  }
  const lastBlockNumberInDb = lastBlockNumberRes[0]?.maxblocknumber ?? constraints?.start ?? START_BLOCK_NUMBER_PRE_DEPLOYMENT;
  return lastBlockNumberInDb;
}

export function ensureQueueItemsFinishOnProcessExitSignal(queue: PQueue) {
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

export async function storeEventsAndErrors(result: EventsFromBlockResult) {
  try {
    await db.insert(analyzedBlocks).values({ blockNumber: result.blockNumber });
  } catch (e) {
    if (e instanceof PostgresError && e.message.includes('duplicate key value violates unique constraint')) {
      logger.warn(`duplicate analysis of block ${result.blockNumber}`);
      return false;
    } else {
      throw e;
    }
  }

  if (Object.keys(result.eventsByContractAddress).length > 0) {
    for (const [contractName, eventsToInsert] of Object.entries(result.eventsByContractAddress)) {
      await Promise.all([saveToEventsTable(eventsToInsert, contractName, result), saveToLpTrackingTable(eventsToInsert, result)]);
    }
  }
  return result;
}

async function saveToLpTrackingTable(eventsToInsert: EventWithMeta[], result: EventsFromBlockResult) {
  const allAddresses: string[] = eventsToInsert
    .flatMap((e) => [e.event.caller, e.event.from, e.event.to, e.event.user, e.event.onBehalfOf])
    .filter((e) => !!e);
  if (allAddresses.length === 0) {
    logger.warn(`Events present but no unique addresses to log. Block hash: ${result.blockHash} | events: ${JSON.stringify(eventsToInsert)}`);
    return;
  }
  const uniqueAddresses = [...new Set(allAddresses)];
  logger.info(`${uniqueAddresses.length} user addresses to load....`);

  const insertedAddresses = await db
    .insert(lpTrackingData)
    .values(
      uniqueAddresses.map((addr) => ({
        address: addr,
        healthFactor: 0,
        updatePriority: 0,
        updateAtLatest: new Date(Date.now() + UPDATE_INTERVAL_BY_HF_PRIORITY[HF_PRIORITY.CRITICAL]),
      })),
    )
    .returning({ address: lpTrackingData.address })
    .onConflictDoNothing();
  logger.info(`pushed ${insertedAddresses.length} addresses for | block: ${result.blockNumber}`);
}

async function saveToEventsTable(eventsToInsert: EventWithMeta[], contractName: string, result: EventsFromBlockResult) {
  const insertedIds = await db
    .insert(events)
    .values(
      eventsToInsert.map((e) => ({
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
    .onConflictDoNothing();
  if (insertedIds.length > 0) {
    logger.info(`pushed ${insertedIds.length} events for ${contractName} | block: ${result.blockNumber}`);
  }
  return insertedIds;
}

export function parseBlockEvents<TContract extends IWithAbi & IWithAddress>(
  eventsToParse: any,
  contracts: TContract[],
  timestamp: string,
  blockNumber: number,
  blockHash: string,
) {
  const eventsToReturnByContractAddress: Record<string, EventWithMeta[]> = {};
  for (const record of eventsToParse) {
    const { event } = record;

    if (event.method === 'ContractEmitted') {
      const [address, data] = record.event.data;

      for (const contract of contracts) {
        if (address.toString() !== contract.address.toString()) continue;
        const decodeEventResult = contract.abi.decodeEvent(data);
        const { args: eventArgs, event: ev } = decodeEventResult;

        const _event: Record<string, any> = {};
        for (let argI = 0; argI < eventArgs.length; argI++) {
          _event[ev.args[argI].name] = eventArgs[argI].toJSON();
        }
        const eventName = ev.identifier.toString();
        const contractName = contract.abi.info.contract.name.toString();

        const eventDataTypeDescriptionToUse = getEventDataTypeDescriptionToUse(contractName);
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
          replaceNumericPropsWithStrings(eventRetWithMeta),
        ];
      }
    }
  }
  return { blockTimestamp: timestamp, blockNumber, blockHash, eventsByContractAddress: eventsToReturnByContractAddress };
}

function getEventDataTypeDescriptionToUse(contractName: string) {
  switch (contractName) {
    case 'a_token':
      return EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN;
    case 'v_token':
      return EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN;
    case 'psp22_ownable':
      return EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_OWNABLE;
    case 'psp22_emitable':
      return EVENT_DATA_TYPE_DESCRIPTIONS_PSP22_EMITABLE;
    default:
      return EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL;
  }
}
