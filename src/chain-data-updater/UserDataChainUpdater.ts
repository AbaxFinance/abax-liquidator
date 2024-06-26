import { type AccountId, type UserConfig, type UserReserveData } from 'wookashwackomytest-contract-helpers';
import { db } from '@db/index';
import { lpTrackingData, lpUserConfigs, lpUserDatas, type InsertLPUserConfig, type InsertLPUserData } from '@db/schema';
import { BaseMessagingActor } from '@src/base-actor/BaseMessagingActor';
import { ChainDataFetchStrategy } from '@src/hf-recalculation/ChainDataFetchStrategy';
import type { ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { logger } from '@src/logger';
import { USER_DATA_QUEUE_NAME, USER_DATA_ROUTING_KEY } from '../messageQueueConsts';
import { lt } from 'drizzle-orm';

export class UserDataChainUpdater extends BaseMessagingActor {
  fetchStrategy = new ChainDataFetchStrategy();

  constructor() {
    super(USER_DATA_QUEUE_NAME, USER_DATA_ROUTING_KEY);
  }

  async loopAction(): Promise<void> {
    const userAddresses = await this.getAllAddresses();
    await this.updateUserReserveDatas(userAddresses);
  }
  async getAllAddresses() {
    return (await db.select({ address: lpTrackingData.address }).from(lpTrackingData).where(lt(lpTrackingData.updateAtLatest, new Date()))).map(
      (a) => a.address,
    );
  }
  private async updateUserReserveDatas(userAddresses: string[]) {
    const CHUNK_SIZE = 10;
    try {
      for (let i = 0; i < userAddresses.length; i += CHUNK_SIZE) {
        const currentChunk = userAddresses.slice(i, i + CHUNK_SIZE);
        if (userAddresses.length > CHUNK_SIZE) logger.info(`fetching user data chunk (${i}-${i + CHUNK_SIZE})...`);
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
  }

  private async updateDb(userAddress: AccountId, userConfig: UserConfig, userReserves: Record<string, UserReserveData>) {
    const updateTimestamp = new Date();
    const userConfigDbValues: InsertLPUserConfig = {
      address: userAddress.toString(),
      borrows: userConfig.borrows.toString(),
      collaterals: userConfig.collaterals.toString(),
      deposits: userConfig.collaterals.toString(),
      marketRuleId: userConfig.marketRuleId.toNumber(),
      updateTimestamp,
    };
    await db
      .insert(lpUserConfigs)
      .values(userConfigDbValues)
      .onConflictDoUpdate({
        target: [lpUserConfigs.address, lpUserConfigs.updateTimestamp],
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
        updateTimestamp,
      };
      await db
        .insert(lpUserDatas)
        .values(userDataDbValues)
        .onConflictDoUpdate({
          target: [lpUserDatas.address, lpUserDatas.reserveAddress, lpUserDatas.updateTimestamp],
          set: userDataDbValues,
        });
    }
  }
}
