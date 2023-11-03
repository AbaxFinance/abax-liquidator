import chalk from 'chalk';
import { db } from 'db';
import { getPreviousEventsFromFile } from 'scripts/fetchEvents';
import { events, lpTrackingData } from '../db/schema';

/*
(0.00, 1.05]    0 critical 5   min interval
(1.05, 1.20]    1 high     10  min interval
(1.20, 1.50]    2 medium   15  min interval
(1.50, 2.00]    3 low      30  min interval
(2.00,  inf]    4 safe     120 min interval
*/
enum HF_PRIORITY {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  SAFE = 4,
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const ONE_MINUTE = 60 * 1000;

const UPDATE_INTERVAL_BY_HF_PRIORITY = {
  [HF_PRIORITY.CRITICAL]: 1 * ONE_MINUTE,
  [HF_PRIORITY.HIGH]: 3 * ONE_MINUTE,
  [HF_PRIORITY.MEDIUM]: 5 * ONE_MINUTE,
  [HF_PRIORITY.LOW]: 15 * ONE_MINUTE,
  [HF_PRIORITY.SAFE]: 120 * ONE_MINUTE,
};

(async () => {
  if (require.main !== module) return;
  console.log(`Deleting rows...`);
  await db.delete(events);
  await db.delete(lpTrackingData);

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

  const addresses: string[] = eventLog.flatMap((e) => [e.event.caller, e.event.from, e.event.to]).filter((e) => !!e);
  const uniqueAddresses = [...new Set(addresses)];
  console.log(`${uniqueAddresses.length} user addresses to load....`);
  await db.insert(lpTrackingData).values(
    uniqueAddresses.map((addr) => ({
      address: addr,
      healthFactor: 0,
      updatePriority: 0,
      updateAtLatest: new Date(Date.now() + UPDATE_INTERVAL_BY_HF_PRIORITY[HF_PRIORITY.CRITICAL]),
    })),
  );
  console.log(`Loaded`);
  process.exit(0);
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(chalk.red(JSON.stringify(e, null, 2)));
  process.exit(1);
});
