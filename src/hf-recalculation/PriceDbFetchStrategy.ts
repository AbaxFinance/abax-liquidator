import { E12bn, E8 } from '@abaxfinance/utils';
import { db } from '@db/index';
import { assetPrices } from '@db/schema';
import { logger } from '@src/logger';
import BN from 'bn.js';
import { inArray } from 'drizzle-orm';
export class PriceDbFetchStrategy {
  async getPricesE18(reserveAddresses?: string[]) {
    const pricesE8ByReserveAddressFromDb = reserveAddresses
      ? await db
          .select({ currentPrice: assetPrices.currentPriceE8, address: assetPrices.address })
          .from(assetPrices)
          .where(inArray(assetPrices.address, reserveAddresses))
      : await db.select({ currentPrice: assetPrices.currentPriceE8, address: assetPrices.address }).from(assetPrices);
    return pricesE8ByReserveAddressFromDb.reduce(
      (acc, { currentPrice, address }) => {
        try {
          acc[address] = new BN((parseFloat(currentPrice) * E8).toString()).mul(E12bn).divn(10 ** 2);
        } catch (e) {
          logger.info({ currentPrice, address, e });
          throw e;
        }
        return acc;
      },
      {} as Record<string, BN>,
    );
  }
}
