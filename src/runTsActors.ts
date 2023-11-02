import chalk from 'chalk';
import { db } from 'db';
import { getPreviousEventsFromFile } from 'scripts/fetchEvents';
import { events } from '../db/schema';
import { UserDataChainUpdater } from './userDataChainUpdater';
import { ReserveDataChainUpdater } from './reserveDataChainUpdater';
import { PriceChangeHFUpdater } from 'src/priceChangeHFUpdater';
import { PeriodicHFUpdater } from 'src/periodicHFUpdater';
import { Liquidator } from './liquidator';
import { EventFeeder } from 'src/eventFeeder';
import { PriceUpdater } from 'src/priceUpdater';

(async () => {
  if (require.main !== module) return;

  //TODO run as separate processes?
  //TODO run as separate services/docker containers?
  const userDataChainUpdater = new UserDataChainUpdater();
  const reserveDataChainUpdater = new ReserveDataChainUpdater();
  const priceChangeHFUpdater = new PriceChangeHFUpdater();
  const periodicHFUpdater = new PeriodicHFUpdater();
  const priceUpdater = new PriceUpdater();
  const liquidator = new Liquidator();
  const eventListenerFeeder = new EventFeeder();

  const res = await Promise.all([
    priceUpdater.runLoop(),
    userDataChainUpdater.runLoop(),
    reserveDataChainUpdater.runLoop(),
    priceChangeHFUpdater.runLoop(),
    periodicHFUpdater.runLoop(),
    liquidator.runLoop(),
    eventListenerFeeder.runLoop(),
  ]);
  console.error(JSON.stringify(res, null, 2));
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
