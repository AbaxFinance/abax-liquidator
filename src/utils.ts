// HF priorities:

import { AToken, LendingPool, VToken, getContractObject } from '@abaxfinance/contract-helpers';
import { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { ONE_MINUTE } from 'src/constants';

// ```
// (0.00, 1.05]    0 critical 5   min interval
// (1.05, 1.20]    1 high     10  min interval
// (1.20, 1.50]    2 medium   15  min interval
// (1.50, 2.00]    3 low      30  min interval
// (2.00,  inf]    4 safe     120 min interval
// ```

export const getUpdateIntervalByHFPriority = (hfPriority: number) => {
  switch (hfPriority) {
    case 0:
      return 5 * ONE_MINUTE;
    case 1:
      return 10 * ONE_MINUTE;
    case 2:
      return 15 * ONE_MINUTE;
    case 3:
      return 30 * ONE_MINUTE;
    default:
      return 120 * ONE_MINUTE;
  }
};

export function getLendingPoolContractAddresses(seed: string, api: ApiPromise) {
  const LENDING_POOL_ADDRESS = '5GBai32Vbzizw3xidVUwkjzFydaas7s2B8uudgtiguzmW8yn';
  const ADAI_ADDRESS = '5GusvrnNEfYThkDxdSUZRca9ScTiVyrF3S76UJEQTUXBDdmT';
  const VDAI_ADDRESS = '5EkScoCUiXCraQw5kSbknbugVEhWod9xMv4PRkyo9MHTREXw';
  const AUSDC_ADDRESS = '5EVfH2BRm2ggimfRcuEH8zRYkviyEN69et4fDjHWHzWjirBK';
  const VUSDC_ADDRESS = '5CdF6Vdf9mAG5fjhFuNaLfFLj9i31SjxBsVj5JHBARmL5Xmd';
  const AWETH_ADDRESS = '5DvMrRU79zS29FSSP5k8CyuCK2de59Xvvqwzbm1UzqNWwxFY';
  const VWETH_ADDRESS = '5HY4mmPQuMDakTDeaf6Cj5TJaSbmb7G3fHczcyuyhmU6UeVR';
  const ABTC_ADDRESS = '5GZm7bsGE53Gyf9Cg2GwsTjDrP9skY6A6uSZiCFWDoEZyMtj';
  const VBTC_ADDRESS = '5EEurzNsm5SMDSJBHbtu4GHbkdSsHdjPbWNb28vxpEWkZJWX';
  const AAZERO_ADDRESS = '5Da8px1HEoAvs3m9i55ftfSswDbskqCY4rHr1KAFsTqfiTia';
  const VAZERO_ADDRESS = '5ChJnTSpsQ26zJGyGt7uHHLRjbquAy1JSmaijMujUi9VKfJL';
  const ADOT_ADDRESS = '5D1dwQEhyXzVDuB8RX85xm9iNa4pTtUr2jVpYHNFte7FxRTw';
  const VDOT_ADDRESS = '5HDidr2RT4VGkxyGuJieGAfqYpqphwviB4WULaNp6VNsf2B2';

  const keyring = new Keyring();
  const signer = keyring.createFromUri(seed, {}, 'sr25519');

  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
  const aTokens = [ADAI_ADDRESS, AAZERO_ADDRESS, ABTC_ADDRESS, ADOT_ADDRESS, AUSDC_ADDRESS, AWETH_ADDRESS].map((addr) =>
    getContractObject(AToken, addr, signer, api),
  );
  const vTokens = [VDAI_ADDRESS, VAZERO_ADDRESS, VBTC_ADDRESS, VDOT_ADDRESS, VUSDC_ADDRESS, VWETH_ADDRESS].map((addr) =>
    getContractObject(VToken, addr, signer, api),
  );

  const contracts = [lendingPool, ...aTokens, ...vTokens];
  return contracts;
}

export async function getLatestBlockNumber(api: ApiPromise) {
  const latestSignedBlock = await api.rpc.chain.getBlock();
  const endBlockNumber = latestSignedBlock.block.header.number.toNumber();
  return endBlockNumber;
}
