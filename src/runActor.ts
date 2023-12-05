import chalk from 'chalk';
import { ReserveDataChainUpdater } from '@src/chain-data-updater/reserveDataChainUpdater';
import { UserDataChainUpdater } from '@src/chain-data-updater/userDataChainUpdater';
import { EventAnalyzeEnsurer } from '@src/event-feeder/EventAnalyzeEnsurer';
import { EventListener } from '@src/event-feeder/EventListener';
import { PeriodicHFUpdater } from '@src/hf-recalculation/PeriodicHFUpdater';
import { PriceChangeHFUpdater } from '@src/hf-recalculation/PriceChangeHFUpdater';
import { Liquidator } from '@src/liquidator/liquidator';
import { PriceUpdater } from '@src/price-updater/priceUpdater';
import { logger } from '@src/logger';

enum ACTOR_TYPE {
  RESERVE_DATA_CHAIN_UPDATER = 'RESERVE_DATA_CHAIN_UPDATER',
  USER_DATA_CHAIN_UPDATER = 'USER_DATA_CHAIN_UPDATER',
  EVENT_ANALYZE_ENSURER = 'EVENT_ANALYZE_ENSURER',
  EVENT_LISTENER = 'EVENT_LISTENER',
  PERIODIC_HFUPDATER = 'PERIODIC_HFUPDATER',
  PRICE_CHANGE_HFUPDATER = 'PRICE_CHANGE_HFUPDATER',
  LIQUIDATOR = 'LIQUIDATOR',
  PRICE_UPDATER = 'PRICE_UPDATER',
}

function createActorToRun(actorType: string) {
  switch (actorType) {
    case ACTOR_TYPE.RESERVE_DATA_CHAIN_UPDATER: {
      return new ReserveDataChainUpdater();
    }
    case ACTOR_TYPE.USER_DATA_CHAIN_UPDATER: {
      return new UserDataChainUpdater();
    }
    case ACTOR_TYPE.EVENT_ANALYZE_ENSURER: {
      return new EventAnalyzeEnsurer();
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
    case ACTOR_TYPE.PRICE_UPDATER: {
      return new PriceUpdater();
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
  logger.info('UNHANDLED', e);
  logger.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
