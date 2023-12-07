export type ChainContractInfo = {
  name: string;
  address: string;
  reserveName?: string;
};

export const deployedContracts: Record<'local' | 'alephzero-testnet' | 'alephzero' | 'custom', ChainContractInfo[]> = {
  local: [],
  'alephzero-testnet': [
    { name: 'psp22_ownable', address: '5F4YGe2yR3R7xQaVQrWz9KokDtT71mcp5qzTADCAxuEyAzcp', reserveName: 'DAI_TEST' },
    { name: 'a_token', address: '5GdG6Qgj8nnzP2S2dvE1k7VhHpzBBsQFxu5K83hN439SkNau', reserveName: 'DAI_TEST' },
    { name: 'v_token', address: '5Cna1A1P1LPBzMjzNExjKotkY2zkRZMKw5BdER9FDf6Kkc3z', reserveName: 'DAI_TEST' },
    { name: 'psp22_ownable', address: '5E4r2RXd7aczvbwLvVj3CcKe2vtxduVnpkJP1DztnE1jLAKx', reserveName: 'USDC_TEST' },
    { name: 'a_token', address: '5Er7rCDTixDeSJekuAbchg93XWTfUwzjpuiTgvna9jQ4Cen5', reserveName: 'USDC_TEST' },
    { name: 'v_token', address: '5G3G6ZrG6PAvoekQKDF99wriiSsb4C339CfnH5U2MzSE2quE', reserveName: 'USDC_TEST' },
    { name: 'psp22_ownable', address: '5GDDKd4iKDBXseSXCqfraWxECM5nWpZmLNTVuGdpcm2WZX2w', reserveName: 'WETH_TEST' },
    { name: 'a_token', address: '5Fvx2jag4Hh1xJxDEBuqj9USGViayFyxmCpDv34JrYF15Yd9', reserveName: 'WETH_TEST' },
    { name: 'v_token', address: '5CsKntureXbsj7eYG4r3hLWeWqTRA3raafNL6Py4LVNucWch', reserveName: 'WETH_TEST' },
    { name: 'psp22_ownable', address: '5GG4WWB9V5dUaoTuZ1BsCVpAjU27XyCAiZtXFm5fqRu6r4fY', reserveName: 'BTC_TEST' },
    { name: 'a_token', address: '5C71K1DYXgVBmw2i8LMgkFcuCdPAPpvVD2XAdaAGemfFHzq2', reserveName: 'BTC_TEST' },
    { name: 'v_token', address: '5F4uujJWtMhCCEf7dznfLxSAkWjfrTQpBAxZyJVYaBZv1yci', reserveName: 'BTC_TEST' },
    { name: 'psp22_ownable', address: '5FwJkGXsRHctjDbDSw6mU6ZvGgsY8PKGWdEEp1M2VcYox7Mh', reserveName: 'AZERO_TEST' },
    { name: 'a_token', address: '5GAXiPPyCkMv2SfnV7zbDkivkSHyARZ7jV75JqgwBJNZcwVC', reserveName: 'AZERO_TEST' },
    { name: 'v_token', address: '5CSfDoJWN42hAhmZNxsNoB2FyupaPMrWNQznw1dtyFPTKip4', reserveName: 'AZERO_TEST' },
    { name: 'psp22_ownable', address: '5DcB6aPqy4MxmtvJED6Mfy1PXyUxWViwgKds9sMXx5mWFajQ', reserveName: 'DOT_TEST' },
    { name: 'a_token', address: '5EntPMU1SMDdAgYANiPReqyn13v2mE6d2E5g7WeLMqPj29cu', reserveName: 'DOT_TEST' },
    { name: 'v_token', address: '5ErtatgpW83iAGAXTwdU4yTVL5zYZUvCbJDhbypV9RNtZrUY', reserveName: 'DOT_TEST' },
    { name: 'test_reserves_minter', address: '5HFs6PnBDncxybKTimd2CjbZ3gaoY3ProfqkmPqHJHUX5yRf' },
    { name: 'balance_viewer', address: '5E1LS6YHNUQAUNkDgWPfHPLLi6KTrWTFDiCtv1fX6ocGj3L2' },
    { name: 'lending_pool', address: '5CaYwwWqGqVEDSYVmMi7qhV9T3kLQmKeF5VGxiz6jt4sZrPE' },
    { name: 'price_feed_provider', address: '5Ci2nvkygjGEJ6GkWQQz3c88wWSsovEGXY9bmF1gd5Yxpztf' },
  ],
  alephzero: [],
  custom: [],
};

function createGetters(deployedContractsToUse: ChainContractInfo[]) {
  return {
    contractInfoRaw: deployedContractsToUse,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    getAddress: (contractName: string) => deployedContractsToUse.find((c) => c.name === contractName)?.address!,
    getReserveName: (address: string) => deployedContractsToUse.find((c) => c.address === address)?.reserveName as string,
    getReserveUnderlyingAddress: (reserveName: string) =>
      deployedContractsToUse.find((c) => c.name.startsWith('psp22') && c.reserveName === reserveName)!.address,
    getATokenAddress: (reserveName: string) => deployedContractsToUse.find((c) => c.name === 'a_token' && c.reserveName === reserveName)!.address,
    getVTokenAddress: (reserveName: string) => deployedContractsToUse.find((c) => c.name === 'v_token' && c.reserveName === reserveName)!.address,
  };
}

export const deployedContractsGetters = createGetters(deployedContracts['alephzero-testnet']);
