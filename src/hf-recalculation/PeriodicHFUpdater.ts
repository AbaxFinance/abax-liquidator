import { ReturnNumber } from '@727-ventures/typechain-types';
import type { AccountId, MarketRule, UserConfig, UserReserveData } from '@abaxfinance/contract-helpers';
import { BalanceViewer, LendingPool, getContractObject, replaceRNBNPropsWithStrings } from '@abaxfinance/contract-helpers';
import { E12bn, E18bn, E6, E6bn, E8 } from '@abaxfinance/utils';
import { db } from '@db/index';
import { assetPrices, lpTrackingData, lpUserConfigs, lpUserDatas } from '@db/schema';
import { nobody } from '@polkadot/keyring/pair/nobody';
import type { KeyringPair } from '@polkadot/keyring/types';
import { BaseActor } from '@src/base-actor/BaseActor';
import type { ProtocolUserDataReturnType } from '@src/chain-data-updater/userDataChainUpdater';
import { queryProtocolReserveDatas, queryProtocolUserData } from '@src/common/chain-data-utils';
import { MARKET_RULE_IDS, UPDATE_INTERVAL_BY_HF_PRIORITY } from '@src/constants';
import { deployedContracts } from '@src/deployedContracts';
import { getHFPriority } from '@src/hf-recalculation/utils';
import { logger } from '@src/logger';
import type { ReserveDataWithMetadata } from '@src/types';
import { BALANCE_VIEWER_ADDRESS, LENDING_POOL_ADDRESS, getIsUsedAsCollateral } from '@src/utils';
import amqplib, { type Channel } from 'amqplib';
import BN from 'bn.js';
import { eq, inArray, lt } from 'drizzle-orm';
import { ApiProviderWrapper } from 'scripts/common';
import { AMQP_URL, LIQUIDATION_EXCHANGE, LIQUIDATION_QUEUE_NAME, LIQUIDATION_ROUTING_KEY } from '../messageQueueConsts';

export class PeriodicHFUpdater extends BaseActor {
  fetchDataStrategy; //TODO
  wsEndpoint: string;
  channel?: Channel;

  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
  }

  private async getChannel() {
    if (this.channel) return this.channel;
    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.assertExchange(LIQUIDATION_EXCHANGE, 'direct', { durable: true });
    await channel.assertQueue(LIQUIDATION_QUEUE_NAME, { durable: true });
    await channel.bindQueue(LIQUIDATION_QUEUE_NAME, LIQUIDATION_EXCHANGE, LIQUIDATION_ROUTING_KEY);
    this.channel = channel;
    return this.channel;
  }

  async loopAction() {
    const channel = await this.getChannel();
    const addressesToUpdate = (
      await db.select({ address: lpTrackingData.address }).from(lpTrackingData).where(lt(lpTrackingData.updateAtLatest, new Date()))
    ).map((a) => a.address);
    logger.info(`Updating HF for ${addressesToUpdate.length} addresses...`);
    const reserveAddresses = deployedContracts['alephzero-testnet'].filter((c) => c.name.startsWith('psp22')).map((c) => c.address);

    //TODO move to strategy START
    const { usersWithReserveDatas, marketRules, reserveDatas } = await this.getAllDataFromChain(reserveAddresses, addressesToUpdate);
    //TODO move to strategy END

    const pricesE18ByReserveAddress = await getPricesE18ByReserveAddressFromDb(reserveAddresses);

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

          channel.publish(
            LIQUIDATION_EXCHANGE,
            LIQUIDATION_ROUTING_KEY,
            Buffer.from(
              JSON.stringify(replaceRNBNPropsWithStrings({ userAddress, debtPower, biggestDebtData, collateralPower, biggestCollateralData })),
            ),
            {
              contentType: 'application/json',
              persistent: true,
            },
          );
          logger.info(`${userAddress} should be liquidated | HF: ${healthFactor}`);
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
  async getAllDataFromChain(reserveAddresses: string[], userAddresses: string[]) {
    const signer = nobody();
    const apiProviderWrapper = new ApiProviderWrapper(this.wsEndpoint);
    const apiFromProviderWrapper = await apiProviderWrapper.getAndWaitForReady();
    const balanceViewerL = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, apiFromProviderWrapper);
    const reserveDatas = await queryProtocolReserveDatas(balanceViewerL, reserveAddresses);

    const marketRules = new Map<number, MarketRule>();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, apiFromProviderWrapper);
    for (const id of MARKET_RULE_IDS) {
      //TODO strategy
      // if (!marketRules.has(userConfig.marketRuleId.toString())) {
      logger.info(`fetching market rule.... ${id}`);
      const {
        value: { ok: marketRule },
      } = await lendingPool.query.viewMarketRule(id);
      marketRules.set(id, marketRule!);
      // }
    }
    await apiProviderWrapper.closeApi();

    const usersWithReserveDatas = await this.fetchUserReserveDatasFromChain(userAddresses, signer);
    return { usersWithReserveDatas, marketRules, reserveDatas };
  }

  private async fetchUserReserveDatasFromChain(userAddresses: string[], signer: KeyringPair) {
    const usersWithReserveDatas: ProtocolUserDataReturnType[] = [];
    const CHUNK_SIZE = 10;
    const apiProviderWrapperForUserDataFetch = new ApiProviderWrapper(this.wsEndpoint);
    try {
      for (let i = 0; i < userAddresses.length; i += CHUNK_SIZE) {
        const currentChunk = userAddresses.slice(i, i + CHUNK_SIZE);
        logger.info(`fetching user data chunk (${i}-${i + CHUNK_SIZE})...`);
        const api = await apiProviderWrapperForUserDataFetch.getAndWaitForReadyNoCache();
        const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, signer, api);
        const balanceViewer = getContractObject(BalanceViewer, BALANCE_VIEWER_ADDRESS, signer, api);
        const currentChunkRes = await Promise.all(currentChunk.map((ad) => queryProtocolUserData(lendingPool, balanceViewer, ad)));
        usersWithReserveDatas.push(...currentChunkRes);
        await api.disconnect();
        await apiProviderWrapperForUserDataFetch.closeApi();
      }
    } catch (e) {
      logger.info('error while fetching user data...');
      logger.info(e);
      process.exit(1);
    }
    return usersWithReserveDatas;
  }
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

async function getProtocolUserDataFromDB(userAddress: AccountId): Promise<ProtocolUserDataReturnType> {
  const userConfigRows = await db.select().from(lpUserConfigs).where(eq(lpUserConfigs.address, userAddress.toString()));
  if (userConfigRows.length > 1) logger.warning(`more than 1 user config in the database for address: ${userAddress.toString()}`);
  if (userConfigRows.length === 0) logger.warning(`no user config in the database for address: ${userAddress.toString()}`);
  const userConfig: UserConfig = {
    deposits: new ReturnNumber(userConfigRows[0].deposits),
    collaterals: new ReturnNumber(userConfigRows[0].collaterals),
    borrows: new ReturnNumber(userConfigRows[0].borrows),
    marketRuleId: new ReturnNumber(userConfigRows[0].marketRuleId),
  };
  const userReserveDatas = await db.select().from(lpUserDatas).where(eq(lpUserDatas.address, userAddress.toString()));
  const userReserves = userReserveDatas.reduce(
    (acc, curr) => {
      acc[curr.address] = {
        deposit: new ReturnNumber(curr.deposit),
        debt: new ReturnNumber(curr.debt),
        appliedDepositIndexE18: new ReturnNumber(curr.appliedCumulativeDepositIndexE18),
        appliedDebtIndexE18: new ReturnNumber(curr.appliedCumulativeDebtIndexE18),
      };
      return acc;
    },
    {} as Record<string, UserReserveData>,
  );

  return { userConfig, userReserves, userAddress };
}

async function getPricesE18ByReserveAddressFromDb(reserveAddresses: string[]) {
  const pricesE8ByReserveAddressFromDb = await db
    .select({ currentPrice: assetPrices.currentPriceE8, address: assetPrices.address })
    .from(assetPrices)
    .where(inArray(assetPrices.address, reserveAddresses));

  return pricesE8ByReserveAddressFromDb.reduce(
    (acc, { currentPrice, address }) => {
      try {
        acc[address] = new BN((parseFloat(currentPrice) * E8).toString()).mul(E12bn).divn(10 ** 2);
      } catch (e) {
        logger.info({ currentPrice, address, e });
        throw e;
      }
      return acc;
    },
    {} as Record<string, BN>,
  );
}
