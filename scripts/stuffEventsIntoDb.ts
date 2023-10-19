import chalk from 'chalk';
import { db } from 'db';
import { getPreviousEvents } from 'scripts/fetchEvents';
import { events } from '../db/schema';

(async () => {
  if (require.main !== module) return;

  // eslint-disable-next-line no-constant-condition
  const eventLog = getPreviousEvents();
  db.insert(events).values(
    eventLog.map((e) => ({
      blockHash: e.meta.blockHash,
      contractAddress: e.meta.contractAddress,
      contractName: e.meta.contractName,
      blockNumber: e.meta.blockNumber,
      data: e.event,
      name: e.meta.eventName,
      timestamp: parseInt(e.meta.timestamp),
    })),
  );
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
