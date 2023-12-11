// HF priorities:

import type { UserConfig } from '@abaxfinance/contract-helpers';
import { AToken, LendingPool, VToken, getContractObject } from '@abaxfinance/contract-helpers';
import { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import { deployedContractsGetters } from '@src/deployedContracts';
import type { ReserveDataWithMetadata } from '@src/types';
export const arrayRange = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, index) => start + index * step);

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => !Number.isNaN(k)) as K[];
}
export const LENDING_POOL_ADDRESS = deployedContractsGetters.getAddress('lending_pool');
export const BALANCE_VIEWER_ADDRESS = deployedContractsGetters.getAddress('balance_viewer');
export const TEST_RESERVES_MINTER_ADDRESS = deployedContractsGetters.getAddress('test_reserves_minter');

export function getLendingPoolContractAddresses(seed: string, api: ApiPromise) {
  const keyring = new Keyring();
  const signer = keyring.createFromUri(seed, {}, 'sr25519');

  const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
  const aTokens = deployedContractsGetters.contractInfoRaw
    .filter((c) => c.name === 'a_token')
    .map((c) => getContractObject(AToken, c.address, signer, api));
  const vTokens = deployedContractsGetters.contractInfoRaw
    .filter((c) => c.name === 'a_token')
    .map((c) => getContractObject(VToken, c.address, signer, api));

  const contracts = [lendingPool, ...aTokens, ...vTokens];
  return contracts;
}

export async function getLatestBlockNumber(api: ApiPromise) {
  const latestSignedBlock = await api.rpc.chain.getBlock();
  const endBlockNumber = latestSignedBlock.block.header.number.toNumber();
  return endBlockNumber;
}

export const getIsUsedAsCollateral = (userConfig: UserConfig, reserve: ReserveDataWithMetadata) => {
  return ((userConfig.collaterals.toNumber() >> reserve.id) & 1) === 1;
};

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};
