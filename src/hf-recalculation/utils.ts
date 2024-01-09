import type { MarketRule, UserConfig, UserReserveData } from '@abaxfinance/contract-helpers';
import { E18bn } from '@abaxfinance/utils';
import { HF_PRIORITY, HF_RANGE_BY_HF_PRIORITY } from '@src/constants';
import { logger } from '@src/logger';
import type { ReserveDataWithMetadata } from '@src/types';
import { enumKeys, getIsUsedAsCollateral } from '@src/utils';
import BN from 'bn.js';

export function getHFPriority(healthFactor: number): HF_PRIORITY {
  for (const priority of enumKeys(HF_RANGE_BY_HF_PRIORITY)) {
    const range = HF_RANGE_BY_HF_PRIORITY[priority];
    const [min, max] = range;

    if (healthFactor >= min && healthFactor < max) {
      return priority;
    }
  }

  logger.error(`Could not determine hf update priority: ${healthFactor}`);
  return HF_PRIORITY.CRITICAL;
}

export const getCollateralPowerE6AndBiggestDeposit = (
  userConfig: UserConfig,
  reserveDatasByAddress: Record<string, ReserveDataWithMetadata>,
  pricesE18ByReserveAddress: Record<string, BN>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
) => {
  let totalCollateralPowerE6 = new BN(0);
  const biggestCollateralPowerData: {
    powerE6: BN;
    underlyingAddress: string;
  } = {
    underlyingAddress: '',
    powerE6: new BN(0),
  };
  Object.entries(userReserveDatas).forEach(([reserveAddress, userReserveData]) => {
    let retDenom = new BN(1);
    const reserveData = reserveDatasByAddress[reserveAddress];
    if (!getIsUsedAsCollateral(userConfig, reserveData)) return;

    const assetRule = marketRule[reserveData.id];
    const deposit = userReserveData.deposit.rawNumber;
    const decimalMultiplier = reserveData.decimalMultiplier?.rawNumber ?? new BN(1);
    retDenom = retDenom.mul(decimalMultiplier);
    const priceE18 = pricesE18ByReserveAddress[reserveAddress] ?? new BN(0);
    retDenom = retDenom.mul(E18bn);
    const collateralCoefficientE6 = assetRule && assetRule.collateralCoefficientE6 ? assetRule.collateralCoefficientE6.rawNumber : new BN(0);
    const reserveCollateralPowerE6 = deposit.mul(priceE18).mul(collateralCoefficientE6).div(retDenom);
    totalCollateralPowerE6 = totalCollateralPowerE6.add(reserveCollateralPowerE6);
    //biggest collateral data
    if (biggestCollateralPowerData.powerE6.lt(reserveCollateralPowerE6)) {
      biggestCollateralPowerData.underlyingAddress = reserveAddress;
      biggestCollateralPowerData.powerE6 = reserveCollateralPowerE6;
    }
  });

  return { collateralPower: totalCollateralPowerE6, biggestCollateralPowerData };
};

export const getDebtPowerE6BNAndBiggestLoan = (
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  pricesE18ByReserveAddress: Record<string, BN>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
): {
  debtPower: BN;
  biggestDebtPowerData: {
    powerE6: BN;
    underlyingAddress: string;
  };
} => {
  let totalDebtPowerE6 = new BN(0);
  const biggestDebtPowerData: {
    powerE6: BN;
    underlyingAddress: string;
  } = {
    underlyingAddress: '',
    powerE6: new BN(0),
  };
  Object.entries(userReserveDatas).forEach(([reserveAddress, userReserveData]) => {
    let retDenom = new BN(1);
    const reserveData = reserveDatas[reserveAddress];
    const assetRule = marketRule[reserveData.id];
    const price = pricesE18ByReserveAddress[reserveAddress];
    if (!reserveData.decimalMultiplier || !assetRule?.borrowCoefficientE6 || !price) return;
    const debt = userReserveData.debt.rawNumber;
    const debtDecimals = reserveData.decimalMultiplier.rawNumber;
    retDenom = retDenom.mul(debtDecimals);
    retDenom = retDenom.mul(E18bn);
    const borrowCoefficientE6 = assetRule.borrowCoefficientE6.rawNumber;
    const reserveDebtPowerE6 = debt.mul(price).mul(borrowCoefficientE6).div(retDenom);
    totalDebtPowerE6 = totalDebtPowerE6.add(reserveDebtPowerE6);
    //biggest loan data
    if (biggestDebtPowerData.powerE6.lt(reserveDebtPowerE6)) {
      biggestDebtPowerData.underlyingAddress = reserveAddress;
      biggestDebtPowerData.powerE6 = reserveDebtPowerE6;
    }
  });

  return { debtPower: totalDebtPowerE6, biggestDebtPowerData };
};
