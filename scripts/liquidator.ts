import Keyring from '@polkadot/keyring';
import chalk from 'chalk';
import LendingPool from 'typechain/contracts/lending_pool';
import { AbiEvent } from '@polkadot/api-contract/types';
import { handleEventReturn } from '@727-ventures/typechain-types';
import { getEventTypeDescription } from 'typechain/shared/utils';
import { ApiPromise } from '@polkadot/api';
import PQueue from 'p-queue';
import EVENTS_TYPE_DESCRIPTIONS from 'typechain/event-data/lending_pool.json';
import fs from 'fs-extra';
import path from 'path';
import { apiProviderWrapper, getContractObject } from './common';

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

  const START_BLOCK_NO = 29335000;
  // const END_BLOCK_NO = 29425297
  const latestSignedBlock = await api.rpc.chain.getBlock();
  const END_BLOCK_NO = latestSignedBlock.block.header.number.toNumber();

  const eventLog: EventWithMeta[] = [];
  const errorLog: { error: any; blockNumber: number }[] = [];
  const queue = new PQueue({ concurrency: 10, autoStart: false });
  for (let i = START_BLOCK_NO; i < END_BLOCK_NO; i++) {
    queue
      .add(() => printEventsByContract(i, api, lendingPool))
      .then((result) => {
        if (result.eventsToReturn.length > 0) {
          eventLog.push(...result.eventsToReturn);
          console.log(new Date(), `pushed ${result.eventsToReturn.length} events`);
        }
        if (result.error) {
          errorLog.push({ error: result.error, blockNumber: result.blockNumber });
        }
        fs.writeFileSync(`${path.basename(__filename)}__eventLog.json`, JSON.stringify(eventLog), 'utf-8');
        fs.writeFileSync(`${path.basename(__filename)}__errorLog.json`, JSON.stringify(errorLog), 'utf-8');
      });
  }

  console.log(`amount of promises:`, queue.size);
  queue.start();

  await queue.onIdle();
  console.log(`signer(owner): ${signer.address}`);
  console.log(`lending pool: ${lendingPool.address}`);

  lendingPool;

  await api.disconnect();
  process.exit(0);
})(argvObj).catch((e) => {
  console.log(e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});

type EventWithMeta = {
  event: any;
  meta: {
    contractAddress: string;
    timestamp: string;
    eventName: string;
    blockNumber: number;
    blockHash: string;
  };
};
async function printEventsByContract(
  blockNumber: number,
  api: ApiPromise,
  lendingPool: LendingPool,
  isRetryCall: boolean = false,
): Promise<{ blockNumber: number; eventsToReturn: EventWithMeta[]; error?: Error }> {
  const eventsToReturn: EventWithMeta[] = [];
  try {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const apiAt = await api.at(blockHash);
    const events: any = await apiAt.query.system.events();

    for (const record of events) {
      const { event } = record;

      if (event.method === 'ContractEmitted') {
        const [address, data] = record.event.data;

        if (address.toString() === lendingPool.address.toString()) {
          const decodeEventResult = lendingPool.abi.decodeEvent(data);
          const { args: eventArgs, event: ev } = decodeEventResult;
          const timestamp = await api.query.timestamp.now();

          const _event: Record<string, any> = {};
          for (let argI = 0; argI < eventArgs.length; argI++) {
            _event[ev.args[argI].name] = eventArgs[argI].toJSON();
          }
          const eventName = ev.identifier.toString();
          const eventRet = handleEventReturn(_event, getEventTypeDescription(eventName, EVENTS_TYPE_DESCRIPTIONS));

          const eventRetWithMeta = {
            event: eventRet,
            meta: {
              contractAddress: address.toString() as string,
              eventName,
              timestamp: timestamp.toString(),
              blockNumber,
              blockHash: blockHash.toString(),
            },
          } satisfies EventWithMeta;
          eventsToReturn.push(eventRetWithMeta);
        }
      }
    }
  } catch (e: any) {
    if (
      !isRetryCall &&
      (e.message.toLowerCase().includes('websocket is not connected') || e.message.toLowerCase().includes('disconnected from wss'))
    ) {
      console.warn(e.message, 'retrying...');
      const freshApi = await apiProviderWrapper.getAndWaitForReady(false);
      return printEventsByContract(blockNumber, freshApi, lendingPool, isRetryCall);
    }
    console.error(e);
    return { blockNumber, eventsToReturn, error: e };
  }
  return { blockNumber, eventsToReturn };
}
