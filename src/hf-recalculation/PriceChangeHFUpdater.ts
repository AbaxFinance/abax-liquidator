import { db } from '@db/index';
import { assetPrices } from '@db/schema';
import type { SelectAssetPrice } from '@db/schema';
import { sleep } from '@scripts/common';
import { BaseActor } from '@src/base-actor/BaseActor';
import { ONE_SECOND } from '@src/constants';
import { logger } from '@src/logger';

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ?? 5 * ONE_SECOND;
export class PriceChangeHFUpdater extends BaseActor {
  async runLoop() {
    let cachedAssetPriceData: SelectAssetPrice[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info('PriceChangeHFUpdater', 'running...');
      const currentAssetPriceData = await db.select().from(assetPrices);
      for (const currentPriceData of currentAssetPriceData) {
        const cachedPriceData = cachedAssetPriceData.find((pd) => pd.address === currentPriceData.address);
        if (!cachedPriceData) continue;
        if (cachedPriceData.anchorPriceE8 !== currentPriceData.anchorPriceE8) {
          await recalculateHFByAssetAndUpdateDb(cachedPriceData.name);
        }
      }
      cachedAssetPriceData = currentAssetPriceData;

      await sleep(LOOP_INTERVAL);
    }
  }
}

async function recalculateHFByAssetAndUpdateDb(assetName: string) {
  //
}
