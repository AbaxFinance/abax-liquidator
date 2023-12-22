import type { AnyRegisteredAsset, PRICE_SOURCE } from '@src/price-updating/consts';
import type BN from 'bn.js';

export interface PriceFetchStrategy {
  priceSource: PRICE_SOURCE;
  fetchPricesE18(): Promise<[AnyRegisteredAsset, BN][]>;
}
