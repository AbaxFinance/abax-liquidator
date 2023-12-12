import { ReserveDataChainUpdater } from '@src/chain-data-updater/ReserveDataChainUpdater';
import { UserDataChainUpdater } from '@src/chain-data-updater/UserDataChainUpdater';
import { EventAnalyzeEnsurer } from '@src/event-feeder/EventAnalyzeEnsurer';
import { EventListener } from '@src/event-feeder/EventListener';
import { PeriodicHFUpdater } from '@src/hf-recalculation/PeriodicHFUpdater';
import { PriceChangeHFUpdater } from '@src/hf-recalculation/PriceChangeHFUpdater';
import { Liquidator } from '@src/liquidator/Liquidator';
import { logger } from '@src/logger';
import { PriceUpdater } from '@src/price-updater/PriceUpdater';

//OBSOLETE: USED FOR REFERENCE PURPOSES

(async () => {
  if (require.main !== module) return;

  const userDataChainUpdater = new UserDataChainUpdater();
  const reserveDataChainUpdater = new ReserveDataChainUpdater();
  const priceChangeHFUpdater = new PriceChangeHFUpdater();
  const periodicHFUpdater = new PeriodicHFUpdater();
  const priceUpdater = new PriceUpdater();
  const liquidator = new Liquidator();
  const eventListenerFeeder = new EventListener();
  const eventAnalyzeEnsurer = new EventAnalyzeEnsurer();

  // eslint-disable-next-line array-bracket-newline
  const res = await Promise.all([
    // priceUpdater.runLoop(),
    // eventListenerFeeder.runLoop(),
    // eventAnalyzeEnsurer.runLoop(),
    // userDataChainUpdater.runLoop(),
    // reserveDataChainUpdater.runLoop(),
    // priceChangeHFUpdater.runLoop(),
    // periodicHFUpdater.runLoop(),
    // liquidator.runLoop(),
    // eslint-disable-next-line array-bracket-newline
  ]);
  logger.error(JSON.stringify(res, null, 2));
})().catch((e) => {
  logger.error('UNHANDLED');
  logger.error(e);
  process.exit(1);
});
