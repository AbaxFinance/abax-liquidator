import { handleEventReturn } from '@727-ventures/typechain-types';
import { ApiPromise } from '@polkadot/api';
import { Abi } from '@polkadot/api-contract';
import Keyring from '@polkadot/keyring';
import chalk from 'chalk';
import fs from 'fs-extra';
import PQueue, { DefaultAddOptions } from 'p-queue';
import path from 'path';
import LendingPool from 'typechain/contracts/lending_pool';
import EVENTS_TYPE_DESCRIPTIONS from 'typechain/event-data/lending_pool.json';
import { getEventTypeDescription } from 'typechain/shared/utils';
import { apiProviderWrapper, argvObj, getContractObject } from './common';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { EventWithMeta, getPreviousEvents } from './fetchEvents';
import { BorrowVariable } from 'typechain/event-types/lending_pool';

const LENDING_POOL_ADDRESS = '5C9MoPeD8rEATyW77U6fmUcnzGpvoLvqQ9QTMiA9oByGwffx';

const keyring = new Keyring();
(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;
  const outputJsonFolder = (args['path'] as string) ?? process.argv[2] ?? process.env.PWD;
  if (!outputJsonFolder) throw 'could not determine path';
  const wsEndpoint = process.env.WS_ENDPOINT;
  if (!wsEndpoint) throw 'could not determine wsEndpoint';
  const seed = process.env.SEED;
  if (!seed) throw 'could not determine seed';
  const api = await apiProviderWrapper.getAndWaitForReady();

  const signer = keyring.createFromUri(seed, {}, 'sr25519');
  const lendingPool = await getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer);

  const eventLog: EventWithMeta[] = getPreviousEvents(lendingPool.abi.info.contract.name.toString());

  console.log(eventLog.length);
  const borrowEvents = eventLog.filter((e) => e.meta.eventName === 'BorrowVariable');
  const uniqueAddresses = Array.from(
    borrowEvents.map((be) => (be.event as BorrowVariable).onBehalfOf.toString()).reduce((set, e) => set.add(e), new Set<string>()),
  );

  console.log(uniqueAddresses);

  await api.disconnect();
  process.exit(0);
})(argvObj).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
