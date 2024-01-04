import { replaceNumericPropsWithStrings } from '@abaxfinance/contract-helpers';
import { db } from '@db/index';
import { lpMarketRules, lpReserveDatas, type InsertLPReserveData } from '@db/schema';
import { BaseActor } from '@src/base-actor/BaseActor';
import { ChainDataFetchStrategy } from '@src/hf-recalculation/ChainDataFetchStrategy';

export class ReserveDataChainUpdater extends BaseActor {
  fetchStrategy = new ChainDataFetchStrategy();
  async loopAction(): Promise<void> {
    const reserveDatas = await this.fetchStrategy.fetchReserveDatas();
    for (const [reserveAddress, reserveData] of Object.entries(reserveDatas)) {
      const reserveDataDbValues: InsertLPReserveData = {
        id: reserveData.id,
        address: reserveAddress,
        maximalTotalDeposit: reserveData.restriction?.maximalTotalDeposit?.toString(),
        maximalTotalDebt: reserveData.restriction?.maximalTotalDebt?.toString(),
        minimalCollateral: reserveData.restriction!.minimalCollateral.toString(),
        minimalDebt: reserveData.restriction!.minimalDebt?.toString(),
        depositIndexE18: reserveData.indexes!.depositIndexE18.toString(),
        debtIndexE18: reserveData.indexes!.debtIndexE18.toString(),
        depositFeeE6: reserveData.fees!.depositFeeE6.toString(),
        debtFeeE6: reserveData.fees!.debtFeeE6.toString(),
        decimalMultiplier: reserveData.decimalMultiplier!.toString(),
        activated: reserveData.data!.activated,
        freezed: reserveData.data!.freezed,
        totalDeposit: reserveData.data!.totalDeposit.toString(),
        currentDepositRateE18: reserveData.data!.currentDepositRateE18.toString(),
        totalDebt: reserveData.data!.totalDebt.toString(),
        currentDebtRateE18: reserveData.data!.currentDebtRateE18.toString(),
        indexesUpdateTimestamp: new Date(parseInt(reserveData.indexes!.updateTimestamp.toString())),
        interestRateModel: replaceNumericPropsWithStrings(reserveData.interestRateModel),
        updateTimestamp: new Date(),
      };
      await db
        .insert(lpReserveDatas)
        .values(reserveDataDbValues)
        .onConflictDoUpdate({
          target: [lpReserveDatas.id, lpReserveDatas.address],
          set: reserveDataDbValues,
        });
    }
    const marketRules = await this.fetchStrategy.fetchMarketRules();
    for (const [id, marketRule] of marketRules) {
      const values = { id, assetRules: replaceNumericPropsWithStrings(marketRule) };
      await db.insert(lpMarketRules).values(values).onConflictDoUpdate({
        target: lpMarketRules.id,
        set: values,
      });
    }
  }
}
