import chalk from 'chalk';
import { ReserveDataChainUpdater } from '@src/chain-data-updater/reserveDataChainUpdater';
import { UserDataChainUpdater } from '@src/chain-data-updater/userDataChainUpdater';
import { EventAnalyzeEnsurer } from '@src/event-feeder/EventAnalyzeEnsurer';
import { EventListener } from '@src/event-feeder/EventListener';
import { PeriodicHFUpdater } from '@src/hf-recalculation/PeriodicHFUpdater';
import { PriceChangeHFUpdater } from '@src/hf-recalculation/PriceChangeHFUpdater';
import { Liquidator } from '@src/liquidator/liquidator';
import { logger } from './logger';
import { PriceUpdater } from '@src/price-updater/priceUpdater';

(async () => {
  if (require.main !== module) return;

  //TODO run as separate processes?
  //TODO run as separate services/docker containers?
  const userDataChainUpdater = new UserDataChainUpdater();
  const reserveDataChainUpdater = new ReserveDataChainUpdater();
  const priceChangeHFUpdater = new PriceChangeHFUpdater();
  const periodicHFUpdater = new PeriodicHFUpdater();
  const periodicHFUpdater2 = new PeriodicHFUpdater();
  const priceUpdater = new PriceUpdater();
  const liquidator = new Liquidator();
  const eventListenerFeeder = new EventListener();
  const eventAnalyzeEnsurer = new EventAnalyzeEnsurer();

  const res = await Promise.all([
    priceUpdater.runLoop(),
    // eventListenerFeeder.runLoop(),
    // eventAnalyzeEnsurer.runLoop(),
    // userDataChainUpdater.runLoop(),
    // reserveDataChainUpdater.runLoop(),
    // priceChangeHFUpdater.runLoop(),
    periodicHFUpdater.runLoop(),
    // periodicHFUpdater2.runLoop(),
    liquidator.runLoop(),
  ]);
  logger.error(JSON.stringify(res, null, 2));
})().catch((e) => {
  logger.info('UNHANDLED', e);
  logger.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
