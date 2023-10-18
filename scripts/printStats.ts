import { getArgvObj } from '@abaxfinance/utils';
import chalk from 'chalk';
import { sleep } from 'scripts/common';
import { getPreviousEvents } from 'scripts/fetchEvents';

(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const events = getPreviousEvents();
      // const startTs = new Date('2023-08-31T00:00:17.000Z').getTime();
      // const endTs = new Date('2023-09-05T00:00:17.000Z').getTime();
      const addresses = events
        // .filter((e) => startTs <= parseInt(e.meta.timestamp) && parseInt(e.meta.timestamp) <= endTs)
        .flatMap((e) => [e.event.caller, e.event.from, e.event.to])
        .filter((e) => !!e);
      const lastEventTs = events[events.length - 1];

      const res = [
        ['timestamp', 'lastEventTimestamp', 'totalLength', 'uniqueAddresses'],
        [new Date().toISOString(), lastEventTs.meta.timestampISO, events.length, [...new Set(addresses)].length],
      ];
      console.table(res);
      await sleep(15 * 1000);
      console.clear();
    } catch (e) {
      console.log(new Date().toISOString(), 'error occured, retrying...');
    }
  }
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
