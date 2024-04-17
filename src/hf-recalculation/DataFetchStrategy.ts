import type { AccountId, MarketRule, UserConfig, UserReserveData } from 'wookashwackomytest-contract-helpers';
import type { ReserveDataWithMetadata } from '@src/types';

export type ProtocolUserDataReturnType = {
  userConfig: UserConfig;
  userReserves: Record<string, UserReserveData>;
  userAddress: AccountId;
};
export interface DataFetchStrategy {
  fetchReserveDatas(reserveAddresses: string[]): Promise<Record<string, ReserveDataWithMetadata>>;
  fetchMarketRules(): Promise<Map<number, MarketRule>>;
  fetchUserReserveDatas(userAddresses: string[]): Promise<ProtocolUserDataReturnType[]>;
}
