import { db } from 'db';
import { SelectAssetPrice, assetPrices } from 'db/schema';
import { sleep } from 'scripts/common';
import { ONE_SECOND } from 'src/constants';

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ?? 5 * ONE_SECOND;
export class PriceChangeHFUpdater {
  async runLoop() {
    let cachedAssetPriceData: SelectAssetPrice[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('PriceChangeHFUpdater', 'running...');
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
