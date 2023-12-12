import { db } from '@db/index';
import { assetPrices, lpTrackingData, lpUserDatas } from '@db/schema';
import type { SelectAssetPrice } from '@db/schema';
import { sleep } from '@scripts/common';
import { BaseActor } from '@src/base-actor/BaseActor';
import { BaseMessagingActor } from '@src/base-actor/BaseMessagingActor';
import { ONE_SECOND } from '@src/constants';
import { deployedContractsGetters } from '@src/deployedContracts';
import { DbDataFetchStrategy } from '@src/hf-recalculation/DbDataFetchStrategy';
import { PriceDbFetchStrategy } from '@src/hf-recalculation/PriceDbFetchStrategy';
import { updateHFAndSendLiquidatationRequests } from '@src/hf-recalculation/hfUpdateUtils';
import { logger } from '@src/logger';
import { PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME } from '@src/price-updating/OffChainPriceUpdater';
import { and, eq, inArray, ne } from 'drizzle-orm';

const LOOP_INTERVAL = process.env.LOOP_INTERVAL ?? 5 * ONE_SECOND;
export class PriceChangeHFUpdater extends BaseMessagingActor {
  lpDataFetchStrategy = new DbDataFetchStrategy(); //TODO DI
  priceFetchStrategy = new PriceDbFetchStrategy();
  cachedAssetPriceData: SelectAssetPrice[] = [];
  async loopAction() {
    logger.info('PriceChangeHFUpdater running...');
    const priceDatasFromDb = await db.select().from(assetPrices);
    const assetsToRecalculateHFFor: string[] = [];
    for (const priceDataFromDb of priceDatasFromDb) {
      const cachedPriceData = this.cachedAssetPriceData.find((pd) => pd.address === priceDataFromDb.address);
      logger.debug(`Processing ${priceDataFromDb.name} | ${priceDataFromDb.address}`);
      if (!cachedPriceData) continue;
      logger.debug(`Checking whether price anchor changed for  ${priceDataFromDb.name}`);
      if (cachedPriceData.anchorPriceE8 !== priceDataFromDb.anchorPriceE8) {
        logger.info(
          `Price of ${priceDataFromDb.name} changed by ${
            PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME[priceDataFromDb.name] * 100
          }%. Recalculating HF for affected addresses...`,
        );
        assetsToRecalculateHFFor.push(priceDataFromDb.address);
      }
    }
    if (assetsToRecalculateHFFor.length > 0) {
      await this.recalculateHFByAssetAddresses(assetsToRecalculateHFFor);
    } else {
      logger.info(`No price moves of reserves...`);
    }
    this.cachedAssetPriceData = priceDatasFromDb;
  }
  async recalculateHFByAssetAddresses(assetAddresses: string[]) {
    const channel = await this.getChannel();
    const addressesToUpdate = (
      await db
        .select({ address: lpTrackingData.address })
        .from(lpTrackingData)
        .innerJoin(lpUserDatas, eq(lpTrackingData.address, lpUserDatas.address))
        .where(and(inArray(lpUserDatas.reserveAddress, assetAddresses), ne(lpUserDatas.debt, '0')))
    ).map((a) => a.address);
    logger.info(`Affected addresses count: ${addressesToUpdate.length}`);

    const reserveAddresses = deployedContractsGetters.getReserveUnderlyingAssetContracts().map((c) => c.address);
    const reserveDatas = await this.lpDataFetchStrategy.fetchReserveDatas(reserveAddresses);
    const marketRules = await this.lpDataFetchStrategy.fetchMarketRules();
    const usersWithReserveDatas = await this.lpDataFetchStrategy.fetchUserReserveDatas(addressesToUpdate);

    const pricesE18ByReserveAddress = await this.priceFetchStrategy.getPricesE18(assetAddresses);
    await updateHFAndSendLiquidatationRequests(usersWithReserveDatas, marketRules, reserveDatas, pricesE18ByReserveAddress, channel);
  }
}
