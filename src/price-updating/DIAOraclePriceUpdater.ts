import { ApiProviderWrapper, DiaOracle, getContractObject } from '@abaxfinance/contract-helpers';
import { nobody } from '@polkadot/keyring/pair/nobody';
import { BaseActor } from '@src/base-actor/BaseActor';
import { insertPricesIntoDb } from '@src/price-updating/common';
import { PRICE_SOURCE } from '@src/price-updating/consts';
import { BN } from 'bn.js';
import { zip } from 'lodash';
import { E8, E6 } from '@abaxfinance/utils';

type AnyRegisteredAsset = 'AZERO' | 'BTC' | 'USDC' | 'ETH' | 'DOT' | 'DAI';
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

export class DIAOraclePriceUpdater extends BaseActor {
  wsEndpoint: string;

  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
  }
  async loopAction() {
    const apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
    const api = await apiProviderWrapper.getAndWaitForReady();
    const diaOracle = getContractObject(DiaOracle, DIA_ORACLE_ADDRESS, nobody(), api);
    const queryRes = await diaOracle.query.getLatestPrices(Object.values(QUERY_STRING_BY_RESERVE_NAME));

    const currentPricesE8: [AnyRegisteredAsset, number][] = zip(Object.keys(QUERY_STRING_BY_RESERVE_NAME), queryRes.value.ok!).map(
      ([reserveName, oracleRes]) => {
        const divisor = new BN((10 ** 4).toString());
        return [reserveName!, parseInt(oracleRes![1].rawNumber.div(divisor).toString()) / E6] as [AnyRegisteredAsset, number];
      },
    );

    await insertPricesIntoDb(currentPricesE8, PRICE_SOURCE.DIA_ORACLE);
  }
}
