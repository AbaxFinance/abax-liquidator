import * as ss58 from '@subsquid/ss58';
import assert from 'assert';
import { ApiProviderWrapper } from 'wookashwackomytest-contract-helpers';
import { getContractsToListenEvents } from '../../utils';

import { Store, TypeormDatabase } from '@subsquid/typeorm-store';

import { parseBlockEvents } from '@src/event-processing/parseBlockEvents';
import type { EventsFromBlockResult } from '@src/types';
import * as LendingPool1 from './abi/lending_pool';
import * as LendingPool2 from './abi/lending_pool2';
import * as LendingPool3 from './abi/lending_pool3';
import { getProcessor, type ProcessorContext } from './processor';
import { readFileSync, writeFileSync } from 'fs';

const REGISTER_INSTANCE = Symbol.for('ts-node.register.instance');
process[REGISTER_INSTANCE] = 'tsx';
const CODEC = 'substrate';

export const lendingPool1Address = ['5CckcttmupmDiZxELpCgnMwWYBBjz8vV5wjhBaPEoG5fnubH', '5FVXfjvF3Z3BqhWfkmxj49Ni6CZAGeEuiw6EChur2jJNF836'];
export const lendingPool2Address = ['5EV43dgPHu5fhaLSA93vbSNZ6Sbn6tj7grJNeo3aX1Tt7JMK', '5DkyRrhvjKvdKmEXTYh2FMa96QQLNLRL76xLR79JRLxPUWX5'];
export const lendingPool3Address = ['5GBai32Vbzizw3xidVUwkjzFydaas7s2B8uudgtiguzmW8yn'];

const contractAddressesToListenTo = [...lendingPool1Address, ...lendingPool2Address, ...lendingPool3Address];
const isAnyLendingPoolAddress = (address: string) => {
  return lendingPool1Address.includes(address) || lendingPool2Address.includes(address) || lendingPool3Address.includes(address);
};

const getAbiAndVersion = (address: string) => {
  if (lendingPool1Address.includes(address)) return [LendingPool1, 1] as const;
  if (lendingPool2Address.includes(address)) return [LendingPool2, 2] as const;
  if (lendingPool3Address.includes(address)) return [LendingPool3, 3] as const;
  throw new Error('Unknown address');
};

type AccRecord = { acc: string; ts: Date; abiVersion: number; block: number; hash: string };
function getAccountsFromEvents(ctx: ProcessorContext<Store>): AccRecord[] {
  const accounts: AccRecord[] = [];
  console.log('batch size', ctx.blocks.length);
  console.log('from:', ctx.blocks[0].header.height, 'to:', ctx.blocks[ctx.blocks.length - 1].header.height);
  for (const block of ctx.blocks) {
    assert(block.header.timestamp, `Block ${block.header.height} had no timestamp`);
    for (const event of block.events) {
      if (event.name === 'Contracts.ContractEmitted') {
        const contractAddr = ss58.codec(CODEC).encode(event.args.contract);
        if (isAnyLendingPoolAddress(contractAddr)) {
          assert(event.extrinsic, `Event ${event} arrived without a parent extrinsic`);
          const [abi, version] = getAbiAndVersion(contractAddr);
          const decodedEvent = abi.decodeEvent(event.args.data);
          // if (decodedEvent.__kind === 'Transfer') {
          //   records.push({
          //     id: event.id,
          //     from: decodedEvent.from && ss58.codec(CODEC).encode(decodedEvent.from),
          //     to: decodedEvent.to && ss58.codec(CODEC).encode(decodedEvent.to),
          //     amount: decodedEvent.value,
          //     block: block.header.height,
          //     timestamp: new Date(block.header.timestamp),
          //     extrinsicHash: event.extrinsic.hash,
          //   });
          // }
          // events.flatMap((e) => [e.event.caller, e.event.from, e.event.to]).filter((e) => !!e);
          if ((decodedEvent as any).caller) {
            accounts.push({
              acc: ss58.codec(CODEC).encode((decodedEvent as any).caller),
              ts: new Date(block.header.timestamp),
              abiVersion: version,
              block: block.header.height,
              hash: block.header.hash,
            });
          }
          if ((decodedEvent as any).from) {
            accounts.push({
              acc: ss58.codec(CODEC).encode((decodedEvent as any).from),
              ts: new Date(block.header.timestamp),
              abiVersion: version,
              block: block.header.height,
              hash: block.header.hash,
            });
          }
          if ((decodedEvent as any).to) {
            accounts.push({
              acc: ss58.codec(CODEC).encode((decodedEvent as any).to),
              ts: new Date(block.header.timestamp),
              abiVersion: version,
              block: block.header.height,
              hash: block.header.hash,
            });
          }
          if ((decodedEvent as any).onBehalfOf) {
            accounts.push({
              acc: ss58.codec(CODEC).encode((decodedEvent as any).onBehalfOf),
              ts: new Date(block.header.timestamp),
              abiVersion: version,
              block: block.header.height,
              hash: block.header.hash,
            });
          }
        }
      }
    }
  }
  return accounts;
}

function getStoredUniqueAddresses() {
  try {
    return JSON.parse(readFileSync('accounts.json').toString());
  } catch (e) {
    return [];
  }
}

(async () => {
  let uniqRecords: AccRecord[] = getStoredUniqueAddresses();
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  const api = await apiProviderWrapper.getAndWaitForReady();
  const contractsToListenTo = getContractsToListenEvents(api);

  // const addressesDecoded = contractsToListenTo.map((c) => ss58.codec(CODEC).decode(c.address));
  const addressesDecoded = contractAddressesToListenTo.map((c) => ss58.codec(CODEC).decode(c));

  const processor = await getProcessor(addressesDecoded);
  const database = new TypeormDatabase({ supportHotBlocks: true });

  processor.run(database, async (ctx) => {
    const newAddresses = getAccountsFromEvents(ctx);
    const uniqueWithNewAddresses = [...uniqRecords, ...newAddresses];
    // filter out duplicates, leave out the first occurence (first timestamp)
    uniqRecords = uniqueWithNewAddresses.filter((v, i, a) => a.findIndex((t) => t.acc === v.acc) === i);
    console.log('unique_addresses count:', uniqRecords.length);
    writeFileSync('accounts.json', JSON.stringify(uniqRecords, null, 2));
  });
})();
