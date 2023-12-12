import { db } from '@db/index';
import { lpTrackingData } from '@db/schema';
import { BaseMessagingActor } from '@src/base-actor/BaseMessagingActor';
import { deployedContractsGetters } from '@src/deployedContracts';
import { DbDataFetchStrategy } from '@src/hf-recalculation/DbDataFetchStrategy';
import { PriceDbFetchStrategy } from '@src/hf-recalculation/PriceDbFetchStrategy';
import { updateHFAndSendLiquidatationRequests } from '@src/hf-recalculation/hfUpdateUtils';
import { logger } from '@src/logger';
import { lt } from 'drizzle-orm';

export class PeriodicHFUpdater extends BaseMessagingActor {
  lpDataFetchStrategy = new DbDataFetchStrategy(); //TODO DI
  priceFetchStrategy = new PriceDbFetchStrategy();

  async loopAction() {
    const channel = await this.getChannel();
    const addressesToUpdate = (
      await db.select({ address: lpTrackingData.address }).from(lpTrackingData).where(lt(lpTrackingData.updateAtLatest, new Date()))
    ).map((a) => a.address);
    logger.info(`Updating HF for ${addressesToUpdate.length} addresses...`);
    const reserveAddresses = deployedContractsGetters.getReserveUnderlyingAssetContracts().map((c) => c.address);
    const reserveDatas = await this.lpDataFetchStrategy.fetchReserveDatas(reserveAddresses);
    const marketRules = await this.lpDataFetchStrategy.fetchMarketRules();
    const usersWithReserveDatas = await this.lpDataFetchStrategy.fetchUserReserveDatas(addressesToUpdate);

    const pricesE18ByReserveAddress = await this.priceFetchStrategy.getPricesE18(reserveAddresses);
    await updateHFAndSendLiquidatationRequests(usersWithReserveDatas, marketRules, reserveDatas, pricesE18ByReserveAddress, channel);
  }
}
