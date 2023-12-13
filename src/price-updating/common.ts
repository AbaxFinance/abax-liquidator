import { db } from '@db/index';
import { assetPrices, type InsertAssetPrice } from '@db/schema';
import { logger } from '@src/logger';
import {
  INIT_ASSET_PRICE_DATA,
  type AnyRegisteredAsset,
  type PRICE_SOURCE,
  PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME,
} from '@src/price-updating/consts';
import { eq, sql } from 'drizzle-orm';

export async function insertPricesIntoDb(currentPricesE8: [AnyRegisteredAsset, number][], priceSource: PRICE_SOURCE) {
  const assetPriceData = await db.select().from(assetPrices).where(eq(assetPrices.source, priceSource));
  logger.debug('Inserting asset prices...');

  const updateTs = new Date();
  const valuesToInsert = (assetPriceData.length > 0 ? assetPriceData : INIT_ASSET_PRICE_DATA).map((apd) => {
    const currentPriceE8 = currentPricesE8.find((cp) => cp[0] === apd.name)![1];
    return {
      address: apd.address,
      name: apd.name,
      updateTimestamp: updateTs,
      currentPriceE8: currentPriceE8.toString(),
      anchorPriceE8:
        // // eslint-disable-next-line no-constant-condition
        // true || //TODO
        Math.abs(parseInt(apd.anchorPriceE8) - currentPriceE8) / parseInt(apd.anchorPriceE8) > PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME[apd.name]
          ? currentPriceE8.toString()
          : apd.anchorPriceE8,
      source: priceSource,
    } as InsertAssetPrice;
  });
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
