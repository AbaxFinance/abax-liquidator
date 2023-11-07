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
import { analyzedBlocks, events } from 'db/schema';
import { PostgresError } from 'postgres';
import { ApiProviderWrapper } from 'scripts/common';
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
      await db
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
      console.log(new Date(), `pushed ${eventsToInsert.length} events for ${contractName} | block: ${result.blockNumber}`);
    }
  }
  return result;
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
