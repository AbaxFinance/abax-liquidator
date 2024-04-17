import { ApiProviderWrapper, DiaOracle, getContractObject } from 'wookashwackomytest-contract-helpers';
import { E6 } from 'wookashwackomytest-utils';
import { nobody } from '@polkadot/keyring/pair/nobody';
import { PRICE_SOURCE, type AnyRegisteredAsset } from '@src/price-updating/consts';
import type { PriceFetchStrategy } from '@src/price-updating/price-fetch-strategy/PriceFetchStrategy';
import BN from 'bn.js';
import { zip } from 'lodash';

type QueryString =
  | 'BTC/USD'
  | 'ETH/USD'
  | 'USDC/USD'
  | 'USDT/USD'
  | 'DOT/USD'
  | 'SOL/USD'
  | 'AVAX/USD'
  | 'EUR/USD'
  | 'BNB/USD'
  | 'DOGE/USD'
  | 'MATIC/USD'
  | 'DAI/USD'
  | 'AZERO/USD';

const QUERY_STRING_BY_RESERVE_NAME = {
  AZERO: 'AZERO/USD',
  BTC: 'BTC/USD',
  USDC: 'USDC/USD',
  ETH: 'ETH/USD',
  DOT: 'DOT/USD',
  DAI: 'DAI/USD', //TODO
} satisfies Record<AnyRegisteredAsset, QueryString>;

const DIA_ORACLE_ADDRESS = '5F5z8pZoLgkGapEksFWc2h7ZxH2vdh1A9agnhXvfdCeAfS9b';

export class DIAOraclePriceFetchStrategy implements PriceFetchStrategy {
  priceSource: PRICE_SOURCE = PRICE_SOURCE.DIA_ORACLE;
  private wsEndpoint: string;

  constructor() {
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
  }
  async fetchPricesE18() {
    const apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
    const api = await apiProviderWrapper.getAndWaitForReady();
    const diaOracle = getContractObject(DiaOracle, DIA_ORACLE_ADDRESS, nobody(), api);
    const queryRes = await diaOracle.query.getLatestPrices(Object.values(QUERY_STRING_BY_RESERVE_NAME));

    const currentPricesE18: [AnyRegisteredAsset, BN][] = zip(Object.keys(QUERY_STRING_BY_RESERVE_NAME), queryRes.value.ok!).map(
      ([reserveName, oracleResE18]) => {
        return [reserveName!, oracleResE18![1].rawNumber] as [AnyRegisteredAsset, BN];
      },
    );
    return currentPricesE18;
  }
}
