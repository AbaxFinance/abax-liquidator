import { ReserveDataChainUpdater } from '@src/chain-data-updater/ReserveDataChainUpdater';
import { UserDataChainUpdater } from '@src/chain-data-updater/UserDataChainUpdater';
import { PastBlocksProcessor } from '@src/event-processing/PastBlocksProcessor';
import { EventListener } from '@src/event-processing/EventListener';
import { PeriodicHFUpdater } from '@src/hf-recalculation/PeriodicHFUpdater';
import { PriceChangeHFUpdater } from '@src/hf-recalculation/PriceChangeHFUpdater';
import { Liquidator } from '@src/liquidator/Liquidator';
import { logger } from '@src/logger';
import { OffChainPriceUpdater } from '@src/price-updating/OffChainPriceUpdater';

//OBSOLETE: USED FOR REFERENCE PURPOSES

(async () => {
  if (require.main !== module) return;

  const userDataChainUpdater = new UserDataChainUpdater();
  const reserveDataChainUpdater = new ReserveDataChainUpdater();
  const priceChangeHFUpdater = new PriceChangeHFUpdater();
  const periodicHFUpdater = new PeriodicHFUpdater();
  const priceUpdater = new OffChainPriceUpdater();
  const liquidator = new Liquidator();
  const eventListenerFeeder = new EventListener();
  const eventAnalyzeEnsurer = new PastBlocksProcessor();

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
