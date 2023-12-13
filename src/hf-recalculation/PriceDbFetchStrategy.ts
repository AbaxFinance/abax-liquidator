import { E12bn, E8 } from '@abaxfinance/utils';
import { db } from '@db/index';
import { assetPrices } from '@db/schema';
import { logger } from '@src/logger';
import { PRICE_SOURCE } from '@src/price-updating/consts';
import { getKeyByValue } from '@src/utils';
import BN from 'bn.js';
import { and, eq, inArray } from 'drizzle-orm';
export class PriceDbFetchStrategy {
  async getPricesE18(reserveAddresses?: string[]) {
    const priceSource: PRICE_SOURCE = process.env.PRICE_SOURCE ? (parseInt(process.env.PRICE_SOURCE) as PRICE_SOURCE) : PRICE_SOURCE.KUCOIN;
    logger.debug(`Fetching prices using ${getKeyByValue(PRICE_SOURCE, priceSource)}`);
    const pricesE8ByReserveAddressFromDb = reserveAddresses
      ? await db
          .select({ currentPrice: assetPrices.currentPriceE8, address: assetPrices.address })
          .from(assetPrices)
          .where(and(inArray(assetPrices.address, reserveAddresses), eq(assetPrices.source, priceSource)))
      : await db
          .select({ currentPrice: assetPrices.currentPriceE8, address: assetPrices.address })
          .from(assetPrices)
          .where(eq(assetPrices.source, priceSource));
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
