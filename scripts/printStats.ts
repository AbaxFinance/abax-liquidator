import { getArgvObj } from '@abaxfinance/utils';
import chalk from 'chalk';
import { sleep } from 'scripts/common';
import { getPreviousEvents } from 'scripts/fetchEvents';
import fs from 'fs-extra';

(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const events = getPreviousEvents();
      // const startTs = new Date('2023-08-31T00:00:17.000Z').getTime();
      // const endTs = new Date('2023-09-05T00:00:17.000Z').getTime();
      const lpEvents = events
        // .filter((e) => startTs <= parseInt(e.meta.timestamp) && parseInt(e.meta.timestamp) <= endTs)
        .filter((e) => e.meta.contractName === 'lending_pool');
      const addresses = events
        // .filter((e) => startTs <= parseInt(e.meta.timestamp) && parseInt(e.meta.timestamp) <= endTs)
        .flatMap((e) => [e.event.caller, e.event.from, e.event.to])
        .filter((e) => !!e);
      const lastEventTs = events[events.length - 1];
      const uniqueAddresses = [...new Set(addresses)];
      // fs.writeFileSync('uniq_addresses.json', JSON.stringify(uniqueAddresses, null, 2));

      const res = [
        ['lastEventTimestamp', 'lastBlockNumber', 'totalLength', 'uniqueAddresses', 'allTimeLPEventsCount'],
        [lastEventTs.meta.timestampISO, lastEventTs.meta.blockNumber, events.length, uniqueAddresses.length, lpEvents.length],
      ];

      // console.clear();
      console.table(res);
      await sleep(15 * 1000);
    } catch (e) {
      console.log(new Date().toISOString(), 'error occured, retrying...');
    }
  }
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
