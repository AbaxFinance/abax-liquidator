import { BaseActor } from '@src/base-actor/BaseActor';
import { insertPricesIntoDb } from '@src/price-updating/common';
import { DIAOraclePriceFetchStrategy } from '@src/price-updating/price-fetch-strategy/DIAOraclePriceFetchStrategy';
export class DIAOraclePriceUpdater extends BaseActor {
  priceFetchStrategy = new DIAOraclePriceFetchStrategy();
  async loopAction() {
    const currentPricesE18 = await this.priceFetchStrategy.fetchPricesE18();

    await insertPricesIntoDb(currentPricesE18, this.priceFetchStrategy.priceSource);
  }
}
