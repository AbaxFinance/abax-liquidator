import { analyzedBlocks } from '@db/schema';
import { sleep } from '@src/utils';
import { db } from 'db';
import { getTableName, sql } from 'drizzle-orm';

(async () => {
  if (require.main !== module) return;

  let prevCount = 0;
  const INTERVAL_SECONDS = 10;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const countQueryRes = await db.execute<{ blockscount: number }>(sql.raw(`SELECT COUNT(*) as blockscount FROM "${getTableName(analyzedBlocks)}"`));
    const analyzedBlocksCount = countQueryRes[0].blockscount;
    if (prevCount > 0)
      console.log(`analyzedBlocksCount: ${analyzedBlocksCount}, change per second: ${(analyzedBlocksCount - prevCount) / INTERVAL_SECONDS}`);
    prevCount = analyzedBlocksCount;
    await sleep(INTERVAL_SECONDS * 1000);
  }
})().catch((e) => {
  console.log('UNHANDLED', e);
  console.error(JSON.stringify(e, null, 2));
  process.exit(1);
});
