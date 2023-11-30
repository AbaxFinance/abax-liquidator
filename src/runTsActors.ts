import chalk from 'chalk';
import { db } from 'db';
import { getPreviousEventsFromFile } from 'scripts/fetchEvents';
import { events } from '../db/schema';
import { UserDataChainUpdater } from './userDataChainUpdater';
import { ReserveDataChainUpdater } from './reserveDataChainUpdater';
import { PriceChangeHFUpdater } from 'src/hf-recalculation/PriceChangeHFUpdater';
import { PeriodicHFUpdater } from 'src/hf-recalculation/PeriodicHFUpdater';
import { Liquidator } from './liquidator/liquidator';
import { EventListener } from 'src/event-feeder/EventListener';
import { EventAnalyzeEnsurer } from 'src/event-feeder/EventAnalyzeEnsurer';
import { PriceUpdater } from 'src/priceUpdater';

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
  console.error(JSON.stringify(res, null, 2));
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
