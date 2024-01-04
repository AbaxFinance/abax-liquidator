import type { ApiPromise } from '@polkadot/api';
import { getLendingPoolContracts, getReserveTokenContracts } from '@src/utils';

export function getContractsToListenEvents(api: ApiPromise) {
  return [...getLendingPoolContracts(api), ...getReserveTokenContracts(api)];
}
