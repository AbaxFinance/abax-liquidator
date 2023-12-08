import { BalanceViewer, LendingPool, getContractObject, type AccountId, type UserConfig, type UserReserveData } from '@abaxfinance/contract-helpers';
import { db } from '@db/index';
import { lpTrackingData, lpUserConfigs, lpUserDatas, type InsertLPUserConfig, type InsertLPUserData } from '@db/schema';
import { nobody } from '@polkadot/keyring/pair/nobody';
import type { KeyringPair } from '@polkadot/keyring/types';
import { BaseActor } from '@src/base-actor/BaseActor';
import { queryProtocolUserData } from '@src/common/chain-data-utils';
import { logger } from '@src/logger';
import { BALANCE_VIEWER_ADDRESS, LENDING_POOL_ADDRESS } from '@src/utils';
import { ApiProviderWrapper } from 'scripts/common';

export type ProtocolUserDataReturnType = {
  userConfig: UserConfig;
  userReserves: Record<string, UserReserveData>;
  userAddress: AccountId;
};

export class UserDataChainUpdater extends BaseActor {
  wsEndpoint: string;
  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
  }
  async loopAction(): Promise<void> {
    const userReserveDatas = await this.getUserReserveDatasFromChain();

    for (const { userConfig, userReserves, userAddress } of userReserveDatas) {
      const userConfigDbValues: InsertLPUserConfig = {
        address: userAddress.toString(),
        borrows: userConfig.borrows.toString(),
        collaterals: userConfig.collaterals.toString(),
        deposits: userConfig.collaterals.toString(),
        marketRuleId: userConfig.marketRuleId.toNumber(),
      };
      await db.insert(lpUserConfigs).values(userConfigDbValues).onConflictDoUpdate({
        target: lpUserConfigs.address,
        set: userConfigDbValues,
      });
      for (const [reserveAddress, userReserve] of Object.entries(userReserves)) {
        const userDataDbValues: InsertLPUserData = {
          address: userAddress.toString(),
          reserveAddress,
          appliedCumulativeDebtIndexE18: userReserve.appliedDebtIndexE18.toString(),
          appliedCumulativeDepositIndexE18: userReserve.appliedDepositIndexE18.toString(),
          debt: userReserve.debt.toString(),
          deposit: userReserve.deposit.toString(),
        };
        await db.insert(lpUserDatas).values(userDataDbValues).onConflictDoUpdate({
          target: lpUserDatas.id,
          set: userDataDbValues,
        });
      }
    }
  }

  async getUserReserveDatasFromChain() {
    const signer = nobody();
    const userAddresses = (await db.select({ address: lpTrackingData.address }).from(lpTrackingData)).map((a) => a.address);
    const userReserveDatas = await this.fetchUserReserveDatas(userAddresses, signer);
    return userReserveDatas;
  }
  private async fetchUserReserveDatas(userAddresses: string[], signer: KeyringPair) {
    const usersWithReserveDatas: ProtocolUserDataReturnType[] = [];
    const CHUNK_SIZE = 10;
    const apiProviderWrapperForUserDataFetch = new ApiProviderWrapper(this.wsEndpoint);
    try {
      for (let i = 0; i < userAddresses.length; i += CHUNK_SIZE) {
        const currentChunk = userAddresses.slice(i, i + CHUNK_SIZE);
        logger.info(`fetching user data chunk (${i}-${i + CHUNK_SIZE})...`);
        const api = await apiProviderWrapperForUserDataFetch.getAndWaitForReadyNoCache();
        const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
        const balanceViewer = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, api);
        const currentChunkRes = await Promise.all(currentChunk.map((ad) => queryProtocolUserData(lendingPool, balanceViewer, ad)));
        usersWithReserveDatas.push(...currentChunkRes);
        await api.disconnect();
        await apiProviderWrapperForUserDataFetch.closeApi();
      }
    } catch (e) {
      logger.info('error while fetching user data...');
      logger.info(e);
      process.exit(1);
    }
    return usersWithReserveDatas;
  }
}
