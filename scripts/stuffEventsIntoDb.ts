import { getArgvObj } from '@abaxfinance/utils';
import chalk from 'chalk';
import { db } from 'db';
import { sleep } from 'scripts/common';
import { getPreviousEvents } from 'scripts/fetchEvents';
import { events } from '../db/schema';

(async (args: Record<string, unknown>) => {
  if (require.main !== module) return;

  // eslint-disable-next-line no-constant-condition
  const eventLog = getPreviousEvents();
  db.insert(events).values(
    eventLog.map((e) => ({
      /*TODO */
    })),
  );
})(getArgvObj()).catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
