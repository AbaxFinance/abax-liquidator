import { ApiProviderWrapper } from 'wookashwackomytest-contract-helpers';
import { ApiPromise } from '@polkadot/api';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import { BaseActor } from '@src/base-actor/BaseActor';
import { storeEventsAndErrors } from '@src/event-processing/shared';
import { getContractsToListenEvents } from '@src/event-processing/utils';
import { logger } from '@src/logger';
import type { IWithAbi, IWithAddress } from '@src/types';
import { parseBlockEvents } from '@src/event-processing/parseBlockEvents';

export class EventListener extends BaseActor {
  apiProviderWrapper: ApiProviderWrapper;

  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    logger.info('EventFeeder running...');

    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const contracts = getContractsToListenEvents(api);
    listenToNewEvents(api, contracts);
  }
}

async function listenToNewEvents<TContract extends IWithAbi & IWithAddress>(api: ApiPromise, contracts: TContract[]) {
  try {
    logger.info('#### attaching listener to api.query.system.events ####');
    api.query.system.events(function (eventsRet: { createdAtHash: { toHuman: () => BlockHash } }) {
      const blockHash = eventsRet.createdAtHash.toHuman();
      api.derive.chain.getBlock(blockHash).then((block) => {
        const blockNumber = block.block.header.number;
        const timestampExtrinistic = block.extrinsics.find(
          (ex) => ex.extrinsic.method.method.toString() === 'set' && ex.extrinsic.method.section.toString() === 'timestamp',
        );
        if (!timestampExtrinistic) throw new Error('There is no timestamp extrinistic in block :C');

        const contractsEmittedEvents = (eventsRet as any).filter((e: any) => e.event.method === 'ContractEmitted');
        if (contractsEmittedEvents.length !== 0) {
          const res = parseBlockEvents(
            eventsRet,
            contracts,
            timestampExtrinistic.extrinsic.method.args[0].toString(),
            blockNumber.toNumber(),
            blockHash.toString(),
          );
          storeEventsAndErrors(res);
        }
      });
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
