import { db } from '@db/index';
import { lpTrackingData } from '@db/schema';
import { UPDATE_INTERVAL_BY_HF_PRIORITY } from '@src/constants';
import type { ProtocolUserDataReturnType } from '@src/hf-recalculation/DataFetchStrategy';
import { getCollateralPowerE6AndBiggestDeposit, getDebtPowerE6BNAndBiggestLoan, getHFPriority } from '@src/hf-recalculation/utils';
import { logger } from '@src/logger';
import type { LiquidationRequestData, ReserveDataWithMetadata } from '@src/types';
import amqplib from 'amqplib';
import type BN from 'bn.js';
import { eq } from 'drizzle-orm';
import { LIQUIDATION_EXCHANGE, LIQUIDATION_ROUTING_KEY } from '../messageQueueConsts';
import type { MarketRule } from 'wookashwackomytest-contract-helpers';
import { stringifyNumericProps } from '@c-forge/polkahat-chai-matchers';
import { E6bn } from '@c-forge/polkahat-network-helpers';

const E6 = 1_000_000;

const DRY_RUN = !!process.env.DRY_RUN;
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
    const { debtPower, biggestDebtPowerData } = getDebtPowerE6BNAndBiggestLoan(
      reserveDatas,
      pricesE18ByReserveAddress,
      userReserves,
      userAppliedMarketRule,
    );
    if (!debtPower.eqn(0)) {
      const { collateralPower, biggestCollateralPowerData } = getCollateralPowerE6AndBiggestDeposit(
        userConfig,
        reserveDatas,
        pricesE18ByReserveAddress,
        userReserves,
        userAppliedMarketRule,
      );
      healthFactor = parseFloat(collateralPower.mul(E6bn).div(debtPower).toString()) / E6;
      // eslint-disable-next-line no-constant-condition
      if (collateralPower.lte(debtPower)) {
        logger.info(`${userAddress} CP: ${collateralPower.toString()} | DP: ${debtPower.toString()}`);
        logger.info(`${userAddress} should be liquidated | HF: ${healthFactor}`);
        if (DRY_RUN) logger.info('dry run, not sending liquidation request');
        else
          channel.publish(
            LIQUIDATION_EXCHANGE,
            LIQUIDATION_ROUTING_KEY,
            Buffer.from(
              JSON.stringify(
                stringifyNumericProps({
                  healthFactor,
                  userAddress,
                  debtPower,
                  biggestDebtPowerData,
                  collateralPower,
                  biggestCollateralData: biggestCollateralPowerData,
                } as any) as LiquidationRequestData,
              ),
            ),
            {
              headers: {
                'x-deduplication-header': userAddress.toString(),
              },
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
        updateTimestamp: new Date(),
      })
      .where(eq(lpTrackingData.address, userAddress.toString()));
    logger.debug(`updated hf priority for ${userAddress}`);
  }
}
