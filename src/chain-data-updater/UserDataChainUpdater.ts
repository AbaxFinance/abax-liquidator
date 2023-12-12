import { type AccountId, type UserConfig, type UserReserveData } from '@abaxfinance/contract-helpers';
import { db } from '@db/index';
import { lpTrackingData, lpUserConfigs, lpUserDatas, type InsertLPUserConfig, type InsertLPUserData } from '@db/schema';
import { BaseActor } from '@src/base-actor/BaseActor';
import { ChainDataFetchStrategy } from '@src/hf-recalculation/ChainDataFetchStrategy';
import type { ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { logger } from '@src/logger';

export class UserDataChainUpdater extends BaseActor {
  fetchStrategy = new ChainDataFetchStrategy();

  async loopAction(): Promise<void> {
    const userAddresses = await this.getAllAddresses();
    await this.updateUserReserveDatas(userAddresses);
  }
  async getAllAddresses() {
    return (await db.select({ address: lpTrackingData.address }).from(lpTrackingData)).map((a) => a.address);
  }
  private async updateUserReserveDatas(userAddresses: string[]) {
    const usersWithReserveDatas: ProtocolUserDataReturnType[] = [];
    const CHUNK_SIZE = 10;
    try {
      for (let i = 0; i < userAddresses.length; i += CHUNK_SIZE) {
        const currentChunk = userAddresses.slice(i, i + CHUNK_SIZE);
        logger.info(`fetching user data chunk (${i}-${i + CHUNK_SIZE})...`);
        const currentChunkRes = await this.fetchStrategy.fetchUserReserveDatas(currentChunk);
        for (const { userConfig, userReserves, userAddress } of currentChunkRes) {
          await this.updateDb(userAddress, userConfig, userReserves);
        }
      }
    } catch (e) {
      logger.info('error while fetching user data...');
      logger.info(e);
      process.exit(1);
    }
    return usersWithReserveDatas;
  }

  private async updateDb(userAddress: AccountId, userConfig: UserConfig, userReserves: Record<string, UserReserveData>) {
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
      await db
        .insert(lpUserDatas)
        .values(userDataDbValues)
        .onConflictDoUpdate({
          target: [lpUserDatas.address, lpUserDatas.reserveAddress],
          set: userDataDbValues,
        });
    }
  }
}
