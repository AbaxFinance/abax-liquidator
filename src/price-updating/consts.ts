import { deployedContractsGetters } from '@src/deployedContracts';

export enum PRICE_SOURCE {
  KUCOIN,
  DIA_ORACLE,
}

export type AnyRegisteredAsset = 'AZERO' | 'BTC' | 'USDC' | 'ETH' | 'DOT' | 'DAI';

export const RESERVE_UNDERLYING_ADDRESS_BY_NAME: Record<AnyRegisteredAsset, string> = {
  AZERO: deployedContractsGetters.getReserveUnderlyingAddress('AZERO_TEST'),
  BTC: deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'),
  USDC: deployedContractsGetters.getReserveUnderlyingAddress('USDC_TEST'),
  ETH: deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'),
  DOT: deployedContractsGetters.getReserveUnderlyingAddress('DOT_TEST'),
  DAI: deployedContractsGetters.getReserveUnderlyingAddress('DAI_TEST'),
};

export const INIT_ASSET_PRICE_DATA = [
  {
    name: 'AZERO',
    address: deployedContractsGetters.getReserveUnderlyingAddress('AZERO_TEST'),
    currentPriceE18: '0',
    anchorPriceE18: '1',
    updateTimestamp: 0,
  },
  {
    name: 'BTC',
    address: deployedContractsGetters.getReserveUnderlyingAddress('BTC_TEST'),
    currentPriceE18: '0',
    anchorPriceE18: '1',
    updateTimestamp: 0,
  },
  {
    name: 'USDC',
    address: deployedContractsGetters.getReserveUnderlyingAddress('USDC_TEST'),
    currentPriceE18: '0',
    anchorPriceE18: '1',
    updateTimestamp: 0,
  },
  {
    name: 'ETH',
    address: deployedContractsGetters.getReserveUnderlyingAddress('WETH_TEST'),
    currentPriceE18: '0',
    anchorPriceE18: '1',
    updateTimestamp: 0,
  },
  {
    name: 'DOT',
    address: deployedContractsGetters.getReserveUnderlyingAddress('DOT_TEST'),
    currentPriceE18: '0',
    anchorPriceE18: '1',
    updateTimestamp: 0,
  },
  {
    name: 'DAI',
    address: deployedContractsGetters.getReserveUnderlyingAddress('DAI_TEST'),
    currentPriceE18: '0',
    anchorPriceE18: '1',
    updateTimestamp: 0,
  },
];

export const PRICE_CHANGE_THRESHOLD_BY_RESERVE_NAME = {
  AZERO: 0.01,
  BTC: 0.01,
  USDC: 0.01,
  ETH: 0.01,
  DOT: 0.01,
  DAI: 0.01,
} satisfies Record<AnyRegisteredAsset, number>;
