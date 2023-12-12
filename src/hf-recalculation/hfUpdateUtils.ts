import { replaceNumericPropsWithStrings, type MarketRule } from '@abaxfinance/contract-helpers';
import { E6, E6bn } from '@abaxfinance/utils';
import { db } from '@db/index';
import { lpTrackingData } from '@db/schema';
import { UPDATE_INTERVAL_BY_HF_PRIORITY } from '@src/constants';
import type { ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { getCollateralPowerE6AndBiggestDeposit, getDebtPowerE6BNAndBiggestLoan, getHFPriority } from '@src/hf-recalculation/utils';
import { logger } from '@src/logger';
import type { ReserveDataWithMetadata } from '@src/types';
import amqplib from 'amqplib';
import type BN from 'bn.js';
import { eq } from 'drizzle-orm';
import { LIQUIDATION_EXCHANGE, LIQUIDATION_ROUTING_KEY } from '../messageQueueConsts';
export async function updateHFAndSendLiquidatationRequests(
  usersWithReserveDatas: ProtocolUserDataReturnType[],
  marketRules: Map<number, MarketRule>,
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  pricesE18ByReserveAddress: Record<string, BN>,
  channel: amqplib.Channel,
) {
  for (const { userConfig, userReserves, userAddress } of usersWithReserveDatas) {
    const userAppliedMarketRule = marketRules.get(userConfig.marketRuleId.toNumber())!;
    let healthFactor = Number.MAX_SAFE_INTEGER - 1;
    const { debtPower, biggestDebtData } = getDebtPowerE6BNAndBiggestLoan(
      reserveDatas,
      pricesE18ByReserveAddress,
      userReserves,
      userAppliedMarketRule,
    );
    if (!debtPower.eqn(0)) {
      const { collateralPower, biggestCollateralData } = getCollateralPowerE6AndBiggestDeposit(
        userConfig,
        reserveDatas,
        pricesE18ByReserveAddress,
        userReserves,
        userAppliedMarketRule,
      );
      healthFactor = parseFloat(collateralPower.mul(E6bn).div(debtPower).toString()) / E6;
      if (collateralPower.lte(debtPower)) {
        logger.info(`${userAddress} CP: ${collateralPower.toString()} | DP: ${debtPower.toString()}`);
        logger.info(`${userAddress} should be liquidated | HF: ${healthFactor}`);
        channel.publish(
          LIQUIDATION_EXCHANGE,
          LIQUIDATION_ROUTING_KEY,
          Buffer.from(
            JSON.stringify(replaceNumericPropsWithStrings({ userAddress, debtPower, biggestDebtData, collateralPower, biggestCollateralData })),
          ),
          {
            contentType: 'application/json',
            persistent: true,
          },
        );
      } else {
        logger.debug(`${userAddress} is safe | HF: ${healthFactor}`);
      }
    }
    const hfUpdatePriority = getHFPriority(healthFactor);
    await db
      .update(lpTrackingData)
      .set({
        address: userAddress.toString(),
        healthFactor: healthFactor,
        updatePriority: hfUpdatePriority,
        updateAtLatest: new Date(Date.now() + UPDATE_INTERVAL_BY_HF_PRIORITY[hfUpdatePriority]),
      })
      .where(eq(lpTrackingData.address, userAddress.toString()));
    logger.debug(`updated hf priority for ${userAddress}`);
  }
}
