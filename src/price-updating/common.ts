import { db } from '@db/index';
import { assetPrices, type InsertAssetPrice, type SelectAssetPrice } from '@db/schema';
import { logger } from '@src/logger';
import {
  INIT_ASSET_PRICE_DATA,
  type AnyRegisteredAsset,
  type PRICE_SOURCE,
  PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME,
} from '@src/price-updating/consts';
import BN from 'bn.js';
import { eq, sql } from 'drizzle-orm';
import { E6, E6bn } from '@abaxfinance/utils';

export async function insertPricesIntoDb(currentPricesE8: [AnyRegisteredAsset, BN][], priceSource: PRICE_SOURCE) {
  const assetPriceData: SelectAssetPrice[] = await db.select().from(assetPrices).where(eq(assetPrices.source, priceSource));
  logger.debug('Inserting asset prices...');

  const updateTs = new Date();
  const valuesToInsert = (
    (assetPriceData.length > 0 ? assetPriceData : INIT_ASSET_PRICE_DATA) as {
      name: string;
      address: string;
      currentPriceE18: string;
      anchorPriceE18: string;
      updateTimestamp: number;
    }[]
  )
    .map((apd) => {
      const currentPriceE18 = currentPricesE8.find((cp) => cp[0] === apd.name)![1];
      if (new BN(apd.currentPriceE18).eq(currentPriceE18)) return null;
      return {
        address: apd.address,
        name: apd.name,
        updateTimestamp: updateTs,
        currentPriceE18: currentPriceE18.toString(),
        anchorPriceE18:
          parseInt(new BN(apd.anchorPriceE18).sub(currentPriceE18).abs().mul(E6bn).div(new BN(apd.anchorPriceE18)).toString()) / E6 >
          PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME[apd.name]
            ? currentPriceE18.toString()
            : apd.anchorPriceE18,
        source: priceSource,
      } as InsertAssetPrice;
    })
    .filter((v) => !!v) as InsertAssetPrice[];
  if (valuesToInsert.length === 0) {
    logger.info(`No price change for price source ${priceSource}`);
    return;
  }
  await db
    .insert(assetPrices)
    .values(valuesToInsert)
    .onConflictDoUpdate({
      target: [assetPrices.address, assetPrices.source],
      set: {
        ...Object.fromEntries(Object.keys(assetPrices).map((x) => [x, sql.raw(`excluded."${x}"`)])),
      },
    });
}
