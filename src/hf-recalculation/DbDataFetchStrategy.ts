import type { AccountId, InterestRateModel, MarketRule, UserConfig, UserReserveData } from '@abaxfinance/contract-helpers';
import { db } from '@db/index';
import { lpMarketRules, lpReserveDatas, lpUserConfigs, lpUserDatas } from '@db/schema';
import { MARKET_RULE_IDS } from '@src/constants';
import type { DataFetchStrategy, ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { logger } from '@src/logger';
import type { ReserveDataWithMetadata } from '@src/types';
import { eq, inArray } from 'drizzle-orm';
import { ReturnNumber } from 'wookashwackomytest-typechain-types';
export class DbDataFetchStrategy implements DataFetchStrategy {
  async fetchReserveDatas(reserveAddresses?: string[]): Promise<Record<string, ReserveDataWithMetadata>> {
    const dbRes = reserveAddresses
      ? await db.select().from(lpReserveDatas).where(inArray(lpReserveDatas.address, reserveAddresses))
      : await db.select().from(lpReserveDatas);

    return dbRes.reduce(
      (acc, curr) => {
        acc[curr.address] = {
          id: curr.id,
          restriction: {
            maximalTotalDeposit: curr.maximalTotalDeposit ? new ReturnNumber(curr.maximalTotalDeposit) : null,
            maximalTotalDebt: curr.maximalTotalDebt ? new ReturnNumber(curr.maximalTotalDebt) : null,
            minimalCollateral: new ReturnNumber(curr.minimalCollateral),
            minimalDebt: new ReturnNumber(curr.minimalDebt),
          },
          indexes: {
            depositIndexE18: new ReturnNumber(curr.depositIndexE18),
            debtIndexE18: new ReturnNumber(curr.debtIndexE18),
            updateTimestamp: new ReturnNumber(curr.indexesUpdateTimestamp.getTime()),
          },
          fees: {
            depositFeeE6: new ReturnNumber(curr.depositFeeE6),
            debtFeeE6: new ReturnNumber(curr.debtFeeE6),
          },
          decimalMultiplier: new ReturnNumber(curr.decimalMultiplier),
          data: {
            activated: curr.activated,
            freezed: curr.freezed,
            totalDeposit: new ReturnNumber(curr.totalDeposit),
            currentDepositRateE18: new ReturnNumber(curr.currentDepositRateE18),
            totalDebt: new ReturnNumber(curr.totalDebt),
            currentDebtRateE18: new ReturnNumber(curr.currentDebtRateE18),
          },
          interestRateModel: curr.interestRateModel as InterestRateModel,
        };
        return acc;
      },
      {} as Record<string, ReserveDataWithMetadata>,
    );
  }
  async fetchMarketRules(): Promise<Map<number, MarketRule>> {
    const marketRules = new Map<number, MarketRule>();
    const res = await db.select({ id: lpMarketRules.id, assetRules: lpMarketRules.assetRules }).from(lpMarketRules);
    for (const row of res) {
      const marketRule: MarketRule = row.assetRules?.map((ar) =>
        ar
          ? {
              collateralCoefficientE6: ar.collateralCoefficientE6 ? new ReturnNumber(ar.collateralCoefficientE6) : null,
              borrowCoefficientE6: ar.borrowCoefficientE6 ? new ReturnNumber(ar.borrowCoefficientE6) : null,
              penaltyE6: ar.penaltyE6 ? new ReturnNumber(ar.penaltyE6) : null,
            }
          : ar,
      );
      marketRules.set(row.id, marketRule);
    }
    if (marketRules.size !== MARKET_RULE_IDS.length) throw new Error(`Failed to fetch market rules`);
    return marketRules;
  }
  async fetchUserReserveDatas(userAddresses: AccountId[]) {
    const usersWithReserveDatas: ProtocolUserDataReturnType[] = [];
    for (const userAddress of userAddresses) {
      const userConfigRows = await db.select().from(lpUserConfigs).where(eq(lpUserConfigs.address, userAddress.toString()));
      if (userConfigRows.length > 1) logger.warn(`more than 1 user config in the database for address: ${userAddress.toString()}`);
      if (userConfigRows.length === 0) logger.warn(`no user config in the database for address: ${userAddress.toString()}`);
      const userConfig: UserConfig = {
        deposits: new ReturnNumber(userConfigRows[0].deposits),
        collaterals: new ReturnNumber(userConfigRows[0].collaterals),
        borrows: new ReturnNumber(userConfigRows[0].borrows),
        marketRuleId: new ReturnNumber(userConfigRows[0].marketRuleId),
      };
      const userReserveDatas = await db.select().from(lpUserDatas).where(eq(lpUserDatas.address, userAddress.toString()));
      const userReserves = userReserveDatas.reduce(
        (acc, curr) => {
          acc[curr.reserveAddress] = {
            deposit: new ReturnNumber(curr.deposit),
            debt: new ReturnNumber(curr.debt),
            appliedDepositIndexE18: new ReturnNumber(curr.appliedCumulativeDepositIndexE18),
            appliedDebtIndexE18: new ReturnNumber(curr.appliedCumulativeDebtIndexE18),
          };
          return acc;
        },
        {} as Record<string, UserReserveData>,
      );

      usersWithReserveDatas.push({ userConfig, userReserves, userAddress });
    }
    return usersWithReserveDatas;
  }
}
