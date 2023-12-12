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
  let ret = new BN(0);
  const biggestCollateralData: {
    amountRawE6: BN;
    underlyingAddress: string;
  } = {
    underlyingAddress: '',
    amountRawE6: new BN(0),
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
    const reserveCollateral = deposit.mul(priceE18).mul(collateralCoefficientE6).div(retDenom);
    ret = ret.add(reserveCollateral);
    //biggest collateral data
    if (biggestCollateralData.amountRawE6.lt(reserveCollateral)) {
      biggestCollateralData.underlyingAddress = reserveAddress;
      biggestCollateralData.amountRawE6 = reserveCollateral;
    }
  });

  return { collateralPower: ret, biggestCollateralData };
};

export const getDebtPowerE6BNAndBiggestLoan = (
  reserveDatas: Record<string, ReserveDataWithMetadata>,
  pricesE18ByReserveAddress: Record<string, BN>,
  userReserveDatas: Record<string, UserReserveData>,
  marketRule: NonNullable<MarketRule>,
) => {
  let ret = new BN(0);
  const biggestDebtData: {
    amountRawE6: BN;
    underlyingAddress: string;
  } = {
    underlyingAddress: '',
    amountRawE6: new BN(0),
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
    const borrowCoefficient = assetRule.borrowCoefficientE6.rawNumber;
    const reserveDebt = debt.mul(price).mul(borrowCoefficient).div(retDenom);
    ret = ret.add(reserveDebt);
    //biggest loan data
    if (biggestDebtData.amountRawE6.lt(reserveDebt)) {
      biggestDebtData.underlyingAddress = reserveAddress;
      biggestDebtData.amountRawE6 = reserveDebt;
    }
  });

  return { debtPower: ret, biggestDebtData };
};
