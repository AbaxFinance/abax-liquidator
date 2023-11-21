import { handleEventReturn } from '@727-ventures/typechain-types';
import {
  EVENT_DATA_TYPE_DESCRIPTIONS_A_TOKEN,
  EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL,
  EVENT_DATA_TYPE_DESCRIPTIONS_V_TOKEN,
  getEventTypeDescription,
  replaceRNBNPropsWithStrings,
} from '@abaxfinance/contract-helpers';
import { ApiPromise } from '@polkadot/api';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { u8aToHex } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';
import { db } from 'db';
import { analyzedBlocks, events, lpTrackingData } from 'db/schema';
import { PostgresError } from 'postgres';
import { ApiProviderWrapper } from 'scripts/common';
import { HF_PRIORITY, UPDATE_INTERVAL_BY_HF_PRIORITY } from 'src/constants';
import { EventWithMeta, EventsFromBlockResult, IWithAbi, IWithAddress } from 'src/types';
import { getLendingPoolContractAddresses } from 'src/utils';

export class EventListener {
  apiProviderWrapper: ApiProviderWrapper;

  constructor() {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    console.log('EventFeeder', 'running...');
    const seed = process.env.SEED;
    if (!seed) throw 'could not determine seed';

    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const contracts = getLendingPoolContractAddresses(seed, api);
    listenToNewEvents(api, contracts);
  }
}
// let blockAlreadyAnalyzed = (await db.select().from(analyzedBlocks).where(eq(analyzedBlocks.blockNumber, result.blockNumber)).limit(1)).length > 0;
export async function storeEventsAndErrors(result: EventsFromBlockResult) {
  try {
    await db.insert(analyzedBlocks).values({ blockNumber: result.blockNumber });
  } catch (e) {
    if (e instanceof PostgresError && e.message.includes('duplicate key value violates unique constraint')) {
      console.warn(`duplicate analysis of block ${result.blockNumber}`);
      return false;
    } else {
      throw e;
    }
  }
  if (Object.keys(result.eventsByContractAddress).length > 0) {
    for (const [contractName, eventsToInsert] of Object.entries(result.eventsByContractAddress)) {
      await saveToEventsTable(eventsToInsert, contractName, result);
      await saveToLpTrackingTable(eventsToInsert, result);
    }
  }
  return result;
}

async function saveToLpTrackingTable(eventsToInsert: EventWithMeta[], result: EventsFromBlockResult) {
  const allAddresses: string[] = eventsToInsert
    .flatMap((e) => [e.event.caller, e.event.from, e.event.to, e.event.user, e.event.onBehalfOf])
    .filter((e) => !!e);
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
  if (insertedIds.length > 0) {
    console.log(new Date(), `pushed ${insertedIds.length} addresses for | block: ${result.blockNumber}`);
  }
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
    console.log(new Date(), `pushed ${insertedIds.length} events for ${contractName} | block: ${result.blockNumber}`);
  }
  return insertedIds;
}

export function parseBlockEvents<TContract extends IWithAbi & IWithAddress>(
  eventsToParse: any,
  contracts: TContract[],
  timestamp: string,
  blockNumber: number,
  blockHash: BlockHash,
) {
  const eventsToReturnByContractAddress: Record<string, EventWithMeta[]> = {};
  for (const record of eventsToParse) {
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
            replaceRNBNPropsWithStrings(eventRetWithMeta),
          ];
        }
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
    default:
      return EVENT_DATA_TYPE_DESCRIPTIONS_LENDING_POOL;
  }
}
export async function listenToNewEvents<TContract extends IWithAbi & IWithAddress>(api: ApiPromise, contracts: TContract[]) {
  try {
    console.log('#### attaching listener to api.query.system.events ####');
    api.query.system.events(function (eventsRet: { createdAtHash: { toHuman: () => BlockHash } }) {
      const blockHash = eventsRet.createdAtHash.toHuman();
      api.derive.chain.getBlock(blockHash).then((block) => {
        const blockNumber = block.block.header.number;
        const timestampExtrinistic = block.extrinsics.find(
          (ex) => ex.extrinsic.method.method.toString() === 'set' && ex.extrinsic.method.section.toString() === 'timestamp',
        );
        if (!timestampExtrinistic) throw new Error('There is no timestamp extrinistic in block :C');
        const res = parseBlockEvents(
          eventsRet,
          contracts,
          timestampExtrinistic.extrinsic.method.args[0].toString(),
          blockNumber.toNumber(),
          blockHash,
        );
        storeEventsAndErrors(res);
      });
    });
  } catch (e) {
    console.error(e);
    console.error('ERROR WHILE ANALYZING BLOCK || RETRYING');
    listenToNewEvents(api, contracts);
  }
}
