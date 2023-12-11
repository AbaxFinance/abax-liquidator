import { db } from '@db/index';
import { assetPrices, lpTrackingData, lpUserDatas } from '@db/schema';
import type { SelectAssetPrice } from '@db/schema';
import { sleep } from '@scripts/common';
import { BaseActor } from '@src/base-actor/BaseActor';
import { ONE_SECOND } from '@src/constants';
import { logger } from '@src/logger';
import { PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME } from '@src/price-updater/priceUpdater';
import { and, eq, ne } from 'drizzle-orm';

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ?? 5 * ONE_SECOND;
export class PriceChangeHFUpdater extends BaseActor {
  cachedAssetPriceData: SelectAssetPrice[] = [];
  async loopAction() {
    logger.info('PriceChangeHFUpdater running...');
    const currentAssetPriceData = await db.select().from(assetPrices);
    for (const currentPriceData of currentAssetPriceData) {
      const cachedPriceData = this.cachedAssetPriceData.find((pd) => pd.address === currentPriceData.address);
      logger.debug(`Processing ${currentPriceData.name} | ${currentPriceData.address}`);
      if (!cachedPriceData) continue;
      logger.debug(`Checking whether price anchor changed for  ${currentPriceData.name}`);
      if (cachedPriceData.anchorPriceE8 !== currentPriceData.anchorPriceE8) {
        logger.info(
          `Price of ${currentPriceData.name} changed by ${
            PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME[currentPriceData.name] * 100
          }%. Recalculating HF for affected addresses...`,
        );
        await recalculateHFByAssetAndUpdateDb(cachedPriceData.address);
      }
    }
    this.cachedAssetPriceData = currentAssetPriceData;

    await sleep(LOOP_INTERVAL);
  }
}

async function recalculateHFByAssetAndUpdateDb(assetAddress: string) {
  const userAddresses = await db
    .select({ address: lpTrackingData.address })
    .from(lpTrackingData)
    .innerJoin(lpUserDatas, eq(lpTrackingData.address, lpUserDatas.address))
    .where(and(eq(lpUserDatas.reserveAddress, assetAddress), ne(lpUserDatas.debt, '0')));
  logger.info(`Affected addresses count: ${userAddresses.length}`);
}
