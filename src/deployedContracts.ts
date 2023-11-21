export type ChainContractInfo = {
  name: string;
  address: string;
  reserveName?: string;
};

export const deployedContracts: Record<'local' | 'alephzero-testnet' | 'alephzero' | 'custom', ChainContractInfo[]> = {
  local: [],
  'alephzero-testnet': [
    { name: 'psp22_ownable', address: '5ELYqHS8YZ2hAEnCiqGJg8Ztc6JoFFKHpvgUbuz9oW9vc5at', reserveName: 'DAI_TEST' },
    { name: 'a_token', address: '5GusvrnNEfYThkDxdSUZRca9ScTiVyrF3S76UJEQTUXBDdmT', reserveName: 'DAI_TEST' },
    { name: 'v_token', address: '5EkScoCUiXCraQw5kSbknbugVEhWod9xMv4PRkyo9MHTREXw', reserveName: 'DAI_TEST' },
    { name: 'psp22_ownable', address: '5GXDPgrjJC7cyr9B1jCm5UqLGuephaEKGoAeHKfodB3TVghP', reserveName: 'USDC_TEST' },
    { name: 'a_token', address: '5EVfH2BRm2ggimfRcuEH8zRYkviyEN69et4fDjHWHzWjirBK', reserveName: 'USDC_TEST' },
    { name: 'v_token', address: '5CdF6Vdf9mAG5fjhFuNaLfFLj9i31SjxBsVj5JHBARmL5Xmd', reserveName: 'USDC_TEST' },
    { name: 'psp22_ownable', address: '5DgMoQHDKSJryNGR4DXo5H267Hmnf9ph5ZMLPXBtPxcZfN3P', reserveName: 'WETH_TEST' },
    { name: 'a_token', address: '5DvMrRU79zS29FSSP5k8CyuCK2de59Xvvqwzbm1UzqNWwxFY', reserveName: 'WETH_TEST' },
    { name: 'v_token', address: '5HY4mmPQuMDakTDeaf6Cj5TJaSbmb7G3fHczcyuyhmU6UeVR', reserveName: 'WETH_TEST' },
    { name: 'psp22_ownable', address: '5CJCSzTY2wZQaDp9PrzC1LsVfTEp9sGBHcAY3vjv9JLakfX9', reserveName: 'BTC_TEST' },
    { name: 'a_token', address: '5GZm7bsGE53Gyf9Cg2GwsTjDrP9skY6A6uSZiCFWDoEZyMtj', reserveName: 'BTC_TEST' },
    { name: 'v_token', address: '5EEurzNsm5SMDSJBHbtu4GHbkdSsHdjPbWNb28vxpEWkZJWX', reserveName: 'BTC_TEST' },
    { name: 'psp22_ownable', address: '5CLLmNswXre58cuz6hBnyscpieFYUyqq5vwvopiW3q41SSYF', reserveName: 'AZERO_TEST' },
    { name: 'a_token', address: '5Da8px1HEoAvs3m9i55ftfSswDbskqCY4rHr1KAFsTqfiTia', reserveName: 'AZERO_TEST' },
    { name: 'v_token', address: '5ChJnTSpsQ26zJGyGt7uHHLRjbquAy1JSmaijMujUi9VKfJL', reserveName: 'AZERO_TEST' },
    { name: 'psp22_ownable', address: '5EwcHvcGBC9jnVzmPJUzwgZJLxUkrWCzzZfoqpjZ45o9C9Gh', reserveName: 'DOT_TEST' },
    { name: 'a_token', address: '5D1dwQEhyXzVDuB8RX85xm9iNa4pTtUr2jVpYHNFte7FxRTw', reserveName: 'DOT_TEST' },
    { name: 'v_token', address: '5HDidr2RT4VGkxyGuJieGAfqYpqphwviB4WULaNp6VNsf2B2', reserveName: 'DOT_TEST' },
    { name: 'test_reserves_minter', address: '5GYR6XGWx538v1TDcqCrXr3kFvL9QooAQbJSuu9rPcW7FGfy' },
    { name: 'balance_viewer', address: '5C5znDGZwaFTbaoaRJqcd54Mwu7qRYwmydWdez6BkAfRPRcb' },
    { name: 'lending_pool', address: '5GBai32Vbzizw3xidVUwkjzFydaas7s2B8uudgtiguzmW8yn' },
    { name: 'price_feed_provider', address: '5CC7y37Tb8ARxfQ4N17yMab6AjiT5rRRLnKtCxfJ8G8G8xBb' },
  ],
  alephzero: [],
  custom: [],
};
