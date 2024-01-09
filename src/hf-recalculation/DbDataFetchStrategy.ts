import type { AccountId, InterestRateModel, MarketRule, UserConfig, UserReserveData } from '@abaxfinance/contract-helpers';
import { db } from '@db/index';
import { lpMarketRules, lpReserveDatas, lpUserConfigs, lpUserDatas } from '@db/schema';
import { MARKET_RULE_IDS } from '@src/constants';
import type { DataFetchStrategy, ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { logger } from '@src/logger';
import type { ReserveDataWithMetadata } from '@src/types';
import { and, eq, inArray, max, sql, getTableName } from 'drizzle-orm';
import { QueryBuilder } from 'drizzle-orm/pg-core';
import { alias } from 'drizzle-orm/pg-core';
import { ReturnNumber } from 'wookashwackomytest-typechain-types';
export class DbDataFetchStrategy implements DataFetchStrategy {
  async fetchReserveDatas(reserveAddresses?: string[]): Promise<Record<string, ReserveDataWithMetadata>> {
    // const dbRes = reserveAddresses
    //   ? await db.select().from(lpReserveDatas).where(inArray(lpReserveDatas.address, reserveAddresses))
    //   : await db.select().from(lpReserveDatas);

    //TODO
    const query = sql.raw(`
    SELECT lp_r."id", lp_r."address", lp_r."maximalTotalDeposit", lp_r."maximalTotalDebt", lp_r."minimalCollateral", lp_r."minimalDebt", lp_r."depositIndexE18", lp_r."debtIndexE18", lp_r."indexesUpdateTimestamp", lp_r."depositFeeE6", lp_r."debtFeeE6", lp_r."decimalMultiplier", lp_r."activated", lp_r."freezed", lp_r."totalDeposit", lp_r."currentDepositRateE18", lp_r."totalDebt", lp_r."currentDebtRateE18", lp_r."interestRateModel"
    FROM public."lp_reserveDatas" lp_r JOIN (
      SELECT "address", MAX("updateTimestamp") as updateTimestamp
      FROM public."lp_reserveDatas"
      ${reserveAddresses ? `WHERE "address" IN(${reserveAddresses.map((addr) => `'${addr}'`).join(',')})` : ``}
      GROUP BY "address"
    ) lp_r_max
    ON lp_r."address" = lp_r_max."address" AND lp_r."updateTimestamp" = lp_r_max.updateTimestamp
  `);
    const dbRes: any[] = await db.execute(query);

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
          interestRateModel: (curr.interestRateModel
            ? JSON.parse(curr.interestRateModel).map((n) => new ReturnNumber(n)) //TODO
            : curr.interestRateModel) as InterestRateModel,
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
      // const userConfigRows = await db.select().from(lpUserConfigs).where(eq(lpUserConfigs.address, userAddress.toString()));
      const userConfigRows: any[] = await db.execute(sql`
        SELECT lp_c."address", lp_c."deposits", lp_c."collaterals", lp_c."borrows", lp_c."marketRuleId"
        FROM public."lp_userConfigs" lp_c JOIN (
          SELECT "address", MAX("updateTimestamp") as updateTimestamp
          FROM public."lp_userConfigs"
          WHERE "address" = ${userAddress.toString()}
          GROUP BY "address"
        ) lp_c_max
        ON lp_c."address" = lp_c_max."address" AND lp_c."updateTimestamp" = lp_c_max.updateTimestamp
      `);
      if (userConfigRows.length > 1) logger.warn(`more than 1 user config in the database for address: ${userAddress.toString()}`);
      if (userConfigRows.length === 0) logger.warn(`no user config in the database for address: ${userAddress.toString()}`);
      const userConfig: UserConfig = {
        deposits: new ReturnNumber(userConfigRows[0].deposits),
        collaterals: new ReturnNumber(userConfigRows[0].collaterals),
        borrows: new ReturnNumber(userConfigRows[0].borrows),
        marketRuleId: new ReturnNumber(userConfigRows[0].marketRuleId),
      };

      // const innerQuery = new QueryBuilder()
      //   .select({ address: lpUserDatas.address, maxTs: max(lpUserDatas.updateTimestamp) })
      //   .from(lpUserDatas)
      //   .where(eq(lpUserDatas.address, userAddress.toString()))
      //   .groupBy(lpUserDatas.address, lpUserDatas.reserveAddress)
      //   .toSQL();
      // logger.info(innerQuery);
      // const userReserveDatas = await db
      //   .select({
      //     address: lpUserDatas.address,
      //     reserveAddress: lpUserDatas.reserveAddress,
      //     deposit: lpUserDatas.deposit,
      //     debt: lpUserDatas.debt,
      //     appliedCumulativeDepositIndexE18: lpUserDatas.appliedCumulativeDepositIndexE18,
      //     appliedCumulativeDebtIndexE18: lpUserDatas.appliedCumulativeDebtIndexE18,
      //     updateTimestamp: lpUserDatas.updateTimestamp,
      //   })
      //   .from(alias(lpUserDatas, 'lp_u'))
      //   .innerJoin(
      //     sql`${innerQuery} lp_u_max`,
      //     and(
      //       sql`lp_u.${lpUserDatas.address.name} = lp_u_max.${lpUserDatas.address.name}`,
      //       sql`lp_u.${lpUserDatas.reserveAddress.name} = lp_u_max.${lpUserDatas.reserveAddress.name}`,
      //       sql`lp_u.${lpUserDatas.updateTimestamp.name} = lp_u_max.maxTs`,
      //     ),
      //   );
      const userReserveDatas: any[] = await db.execute(sql`
      SELECT lp_u."address", lp_u."reserveAddress", deposit, debt, "appliedCumulativeDepositIndexE18", "appliedCumulativeDebtIndexE18", "updateTimestamp"
      FROM public."lp_userDatas" lp_u JOIN (
      SELECT "address","reserveAddress", MAX("updateTimestamp") as updateTimestamp
      FROM public."lp_userDatas"
      WHERE "address" = ${userAddress.toString()}
      GROUP BY "address","reserveAddress"
      ) lp_u_max
      ON lp_u."reserveAddress" = lp_u_max."reserveAddress" AND lp_u."address" = lp_u_max."address" AND lp_u."updateTimestamp" = lp_u_max.updateTimestamp`);

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
