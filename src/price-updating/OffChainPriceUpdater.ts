import { BaseActor } from '@src/base-actor/BaseActor';
import { insertPricesIntoDb } from '@src/price-updating/common';
import { KuCoinPriceFetchStrategy } from '@src/price-updating/price-fetch-strategy/KuCoinPriceFetchStrategy';

export class OffChainPriceUpdater extends BaseActor {
  priceFetchStrategy = new KuCoinPriceFetchStrategy();
  async loopAction() {
    const currentPricesE18 = await this.priceFetchStrategy.fetchPricesE18();

    await insertPricesIntoDb(currentPricesE18, this.priceFetchStrategy.priceSource);
  }
}
