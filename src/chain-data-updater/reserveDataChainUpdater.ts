import { BalanceViewer, LendingPool, getContractObject, type MarketRule } from '@abaxfinance/contract-helpers';
import { db } from '@db/index';
import { lpMarketRules, lpReserveDatas, type InsertLPReserveData } from '@db/schema';
import { nobody } from '@polkadot/keyring/pair/nobody';
import { BaseActor } from '@src/base-actor/BaseActor';
import { queryProtocolReserveDatas } from '@src/common/chain-data-utils';
import { MARKET_RULE_IDS } from '@src/constants';
import { deployedContracts } from '@src/deployedContracts';
import { BALANCE_VIEWER_ADDRESS, LENDING_POOL_ADDRESS } from '@src/utils';
import { ApiProviderWrapper } from 'scripts/common';

export class ReserveDataChainUpdater extends BaseActor {
  wsEndpoint: string;
  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
  }
  async loopAction(): Promise<void> {
    const reserveDatas = await this.getReserveDatasFromChain();
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
        interestRateModel: reserveData.interestRateModel,
      };
      await db
        .insert(lpReserveDatas)
        .values(reserveDataDbValues)
        .onConflictDoUpdate({
          target: [lpReserveDatas.id, lpReserveDatas.address],
          set: reserveDataDbValues,
        });
    }
    const marketRules = await this.getMarketRulesFromChain();
    for (const [id, marketRule] of marketRules) {
      const values = { id, assetRules: marketRule };
      await db.insert(lpMarketRules).values(values).onConflictDoUpdate({
        target: lpMarketRules.id,
        set: values,
      });
    }
  }

  async getReserveDatasFromChain() {
    const signer = nobody();
    const apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
    const api = await apiProviderWrapper.getAndWaitForReady();
    const reserveAddresses = deployedContracts['alephzero-testnet'].filter((c) => c.name.startsWith('psp22')).map((c) => c.address);
    const balanceViewerL = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, api);
    const reserveDatas = await queryProtocolReserveDatas(balanceViewerL, reserveAddresses);
    return reserveDatas;
  }
  async getMarketRulesFromChain() {
    const signer = nobody();
    const apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
    const api = await apiProviderWrapper.getAndWaitForReady();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
    const result = await Promise.all(
      MARKET_RULE_IDS.map((id) => lendingPool.query.viewMarketRule(id).then((res) => [id, res.value.ok!] as [number, MarketRule])),
    );
    return result;
  }
}
