import { getArgvObj } from '@abaxfinance/utils';
import chalk from 'chalk';
import { sleep } from 'scripts/common';
import { getPreviousEventsFromFile } from 'scripts/fetchEvents';
import fs from 'fs-extra';

const PRE_ETH_WARSAW = new Date('2023-08-31T00:00:17.000Z');
const POST_ETH_WARSAW = new Date('2023-09-05T00:00:17.000Z');
const PRE_RERELEASE = new Date('2023-10-30T00:00:17.000Z');

(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const startTs = PRE_RERELEASE.getTime();
      const endTs = Date.now();
      // const events = getPreviousEventsFromFile('scan_results_old').filter(
      const events = getPreviousEventsFromFile().filter((e) => startTs <= parseInt(e.meta.timestamp) && parseInt(e.meta.timestamp) <= endTs);
      const lpEvents = events.filter((e) => e.meta.contractName === 'lending_pool');
      const addresses = events.flatMap((e) => [e.event.caller, e.event.from, e.event.to]).filter((e) => !!e);
      const uniqueAddresses = [...new Set(addresses)];
      // fs.writeFileSync('uniq_addresses.json', JSON.stringify(uniqueAddresses, null, 2));

      const res = [
        ['lastEventTimestamp', 'start', 'end', 'eventCount', 'uniqueAddresses', 'lPEventsCount'],
        [
          events[events.length - 1].meta.timestampISO,
          new Date(startTs).toISOString(),
          new Date(endTs).toISOString(),
          events.length,
          uniqueAddresses.length,
          lpEvents.length,
        ],
      ];

      console.clear();
      console.log(new Date());
      console.table(res);
      await sleep(10 * 1000);
    } catch (e) {
      console.log(e);
      console.log(new Date().toISOString(), 'error occured, retrying...');
    }
  }
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
