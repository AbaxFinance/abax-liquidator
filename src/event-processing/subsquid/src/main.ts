import { In } from 'typeorm';
import assert from 'assert';
import { toHex } from '@subsquid/util-internal-hex';
import * as ss58 from '@subsquid/ss58';
import { getContractsToListenEvents } from '../../utils';
import { ApiPromise } from '@polkadot/api';
import { ApiProviderWrapper } from '@abaxfinance/contract-helpers';

import { Store, TypeormDatabase } from '@subsquid/typeorm-store';

import { getProcessor, type ProcessorContext } from './processor';
import { parseBlockEvents } from '../../shared';
import type { EventsFromBlockResult } from '@src/types';

function getEvents(ctx: ProcessorContext<Store>, contracts: any[]) {
  const records: EventsFromBlockResult[] = [];
  for (const block of ctx.blocks) {
    assert(block.header.timestamp, `Block ${block.header.height} had no timestamp`);
    const parsedEvents = parseBlockEvents(
      block.events,
      contracts,
      block.header.timestamp.toString(),
      block.header.height,
      block.header.hash.toString(),
    );
    if (Object.values(parsedEvents.eventsByContractAddress).some((e) => e.length > 0)) records.push(parsedEvents);
  }
  return records;
}
(async () => {
  let eventsCount = 0;

  const wsEndpoint = process.env.RPC_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  const api = await apiProviderWrapper.getAndWaitForReady();
  const contractsToListenTo = getContractsToListenEvents(api);
  const CODEC = 'substrate';

  const addressesDecoded = contractsToListenTo.map((c) => ss58.codec(CODEC).decode(c.address));

  const processor = await getProcessor(addressesDecoded);

  processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const records = getEvents(ctx, contractsToListenTo);
    eventsCount += Object.values(records).reduce((acc, r) => acc + Object.values(r.eventsByContractAddress).length, 0);
    console.log(eventsCount);
  });
})();
