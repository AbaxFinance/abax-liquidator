import chalk from 'chalk';
import { db } from 'db';
import { getPreviousEventsFromFile } from 'scripts/fetchEvents';
import { events } from '../db/schema';

(async () => {
  if (require.main !== module) return;
  console.log(`Deleting rows...`);
  await db.delete(events);

  // eslint-disable-next-line no-constant-condition
  const eventLog = getPreviousEventsFromFile();
  console.log(`${eventLog.length} event to load....`);
  await db.insert(events).values(
    eventLog.map((e) => ({
      blockHash: e.meta.blockHash,
      contractAddress: e.meta.contractAddress,
      contractName: e.meta.contractName,
      blockNumber: e.meta.blockNumber,
      data: e.event,
      name: e.meta.eventName,
      blockTimestamp: new Date(e.meta.timestampISO),
    })),
  );
  console.log(`Loaded`);
  process.exit(0);
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
