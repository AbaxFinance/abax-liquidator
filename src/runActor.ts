import { ReserveDataChainUpdater } from '@src/chain-data-updater/ReserveDataChainUpdater';
import { UserDataChainUpdater } from '@src/chain-data-updater/UserDataChainUpdater';
import { EventListener } from '@src/event-processing/EventListener';
import { PastBlocksProcessor } from '@src/event-processing/PastBlocksProcessor';
import { PeriodicHFUpdater } from '@src/hf-recalculation/PeriodicHFUpdater';
import { PriceChangeHFUpdater } from '@src/hf-recalculation/PriceChangeHFUpdater';
import { Liquidator } from '@src/liquidator/Liquidator';
import { OffChainPriceUpdater } from '@src/price-updating/OffChainPriceUpdater';
import { logger } from './logger';
import { DIAOraclePriceUpdater } from '@src/price-updating/DIAOraclePriceUpdater';

enum ACTOR_TYPE {
  RESERVE_DATA_CHAIN_UPDATER = 'RESERVE_DATA_CHAIN_UPDATER',
  USER_DATA_CHAIN_UPDATER = 'USER_DATA_CHAIN_UPDATER',
  PAST_BLOCKS_PROCESSOR = 'PAST_BLOCKS_PROCESSOR',
  EVENT_LISTENER = 'EVENT_LISTENER',
  PERIODIC_HFUPDATER = 'PERIODIC_HFUPDATER',
  PRICE_CHANGE_HFUPDATER = 'PRICE_CHANGE_HFUPDATER',
  LIQUIDATOR = 'LIQUIDATOR',
  OFFCHAIN_PRICE_UPDATER = 'OFFCHAIN_PRICE_UPDATER',
  DIA_ORACLE_PRICE_UPDATER = 'DIA_ORACLE_PRICE_UPDATER',
}

function createActorToRun(actorType: string) {
  switch (actorType) {
    case ACTOR_TYPE.RESERVE_DATA_CHAIN_UPDATER: {
      return new ReserveDataChainUpdater();
    }
    case ACTOR_TYPE.USER_DATA_CHAIN_UPDATER: {
      return new UserDataChainUpdater();
    }
    case ACTOR_TYPE.PAST_BLOCKS_PROCESSOR: {
      return new PastBlocksProcessor();
    }
    case ACTOR_TYPE.EVENT_LISTENER: {
      return new EventListener();
    }
    case ACTOR_TYPE.PERIODIC_HFUPDATER: {
      return new PeriodicHFUpdater();
    }
    case ACTOR_TYPE.PRICE_CHANGE_HFUPDATER: {
      return new PriceChangeHFUpdater();
    }
    case ACTOR_TYPE.LIQUIDATOR: {
      return new Liquidator();
    }
    case ACTOR_TYPE.OFFCHAIN_PRICE_UPDATER: {
      return new OffChainPriceUpdater();
    }
    case ACTOR_TYPE.DIA_ORACLE_PRICE_UPDATER: {
      return new DIAOraclePriceUpdater();
    }
  }
  throw new Error('Unsupported actor type');
}

(async () => {
  if (require.main !== module) return;
  const actorType = process.env.ACTOR_TO_RUN;
  if (!actorType) throw new Error('Missing actor type env variable');
  const actor = createActorToRun(actorType);
  await actor.runLoop();
})().catch((e) => {
  logger.error('UNHANDLED');
  logger.error(e);
  process.exit(1);
});
