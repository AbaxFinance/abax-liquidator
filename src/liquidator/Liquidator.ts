import {
  ApiProviderWrapper,
  LendingPool,
  LendingPoolErrorBuilder,
  Psp22Ownable,
  getContractObject,
  replaceNumericPropsWithStrings,
} from '@abaxfinance/contract-helpers';
import type { ApiPromise } from '@polkadot/api';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { bnToBn } from '@polkadot/util';
import { BaseActor } from '@src/base-actor/BaseActor';
import { ChainDataFetchStrategy } from '@src/hf-recalculation/ChainDataFetchStrategy';
import { getCollateralPowerE6AndBiggestDeposit, getDebtPowerE6BNAndBiggestLoan } from '@src/hf-recalculation/utils';
import { logger } from '@src/logger';
import { AMQP_URL, LIQUIDATION_QUEUE_NAME } from '@src/messageQueueConsts';
import { RESERVE_UNDERLYING_ADDRESS_BY_NAME } from '@src/price-updating/consts';
import { DIAOraclePriceFetchStrategy } from '@src/price-updating/price-fetch-strategy/DIAOraclePriceFetchStrategy';
import type { LiquidationRequestData } from '@src/types';
import { LENDING_POOL_ADDRESS } from '@src/utils';
import amqplib from 'amqplib';
import BN from 'bn.js';
import { isEqual } from 'lodash';
import type { WeightV2 } from '@polkadot/types/interfaces';

export const getGasLimit = (api: ApiPromise, _refTime: string | BN, _proofSize: string | BN) => {
  const refTime = bnToBn(_refTime);
  const proofSize = bnToBn(_proofSize);

  return api.registry.createType('WeightV2', {
    refTime,
    proofSize,
  }) as WeightV2;
};

export const getMaxGasLimit = (api: ApiPromise, reductionFactor = 0.3) => {
  const blockWeights = api.consts.system.blockWeights.toPrimitive() as any;
  const maxExtrinsic = blockWeights?.perClass?.normal?.maxExtrinsic;
  const maxRefTime = maxExtrinsic?.refTime
    ? bnToBn(maxExtrinsic.refTime)
        .mul(new BN(reductionFactor * 100))
        .div(new BN(100))
    : new BN(0);
  const maxProofSize = maxExtrinsic?.proofSize
    ? bnToBn(maxExtrinsic.proofSize)
        .mul(new BN(reductionFactor * 100))
        .div(new BN(100))
    : new BN(0);

  return getGasLimit(api, maxRefTime as any, maxProofSize as any);
};

export class Liquidator extends BaseActor {
  _liquidationSignerSpender?: KeyringPair;
  apiProviderWrapper: ApiProviderWrapper;
  wsEndpoint: string;

  constructor() {
    super();
    const wsEndpoint = process.env.RPC_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  }
  async getLiquidationSignerSpender() {
    await this.apiProviderWrapper.getAndWaitForReady();
    if (this._liquidationSignerSpender) return this._liquidationSignerSpender;
    const keyring = new Keyring();
    this._liquidationSignerSpender = keyring.createFromUri(process.env.LIQUIDATOR_SPENDER_SEED ?? '', {}, 'sr25519');
    return this._liquidationSignerSpender;
  }
  async tryLiquidate(
    userAddress: string,
    biggestDebtData: {
      amountRawE6: string;
      underlyingAddress: string;
    },
    biggestCollateralData: {
      amountRawE6: string;
      underlyingAddress: string;
    },
  ) {
    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const liquidationSignerSpender = await this.getLiquidationSignerSpender();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, liquidationSignerSpender, api);
    // const minimumTokenReceivedE18 = calculateMinimumTokenReceivedE18();
    const minimumTokenReceivedE18 = 1;

    logger.info({
      userAddress,
      minimumTokenReceivedE18: minimumTokenReceivedE18.toString(),
      biggestCollateralData: replaceNumericPropsWithStrings(biggestCollateralData),
      biggestDebtData: replaceNumericPropsWithStrings(biggestDebtData),
    });

    const reserveTokenToRepay = getContractObject(Psp22Ownable, biggestDebtData.underlyingAddress.toString(), liquidationSignerSpender, api);

    const amountToRepay = new BN(biggestDebtData.amountRawE6).muln(2); //TODO remove muln2
    const approveQueryRes = await reserveTokenToRepay.query.approve(lendingPool.address, amountToRepay);
    try {
      approveQueryRes.value.unwrapRecursively();
      await reserveTokenToRepay.tx.approve(lendingPool.address, amountToRepay); //TODO handle unhandled rejections
    } catch (e) {
      logger.error(`failed to approve: reason ${JSON.stringify(e)}`); //TODO
      return false;
    }

    //DEBUG
    const biggestDebtReserveBefore = (await lendingPool.query.viewReserveData(biggestDebtData.underlyingAddress.toString())).value.ok!;
    const borrowerBiggestDebtReserveBefore = (await lendingPool.query.viewUserReserveData(biggestDebtData.underlyingAddress, userAddress)).value.ok!;
    const borrowerBiggestCollateralReserveBefore = (await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, userAddress))
      .value.ok!;
    const liquidationSpenderBiggestDebtReserveBefore = (
      await lendingPool.query.viewUserReserveData(biggestDebtData.underlyingAddress, liquidationSignerSpender.address)
    ).value.ok!;
    const liqudationSpenderBiggestCollateralReserveBefore = (
      await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, liquidationSignerSpender.address)
    ).value.ok!;

    const biggestDebtPSPBalanceOfLendingPool = (
      await getContractObject(Psp22Ownable, biggestDebtData.underlyingAddress, liquidationSignerSpender, api).query.balanceOf(lendingPool.address)
    ).value.ok!;
    const queryResD = await lendingPool.query.getUserFreeCollateralCoefficient(userAddress);
    logger.info({
      userAddress,
      collateralized: replaceNumericPropsWithStrings(queryResD.value.ok)[0],
      collateralCoefficient: replaceNumericPropsWithStrings(queryResD.value.ok)[1],
    });
    //DEBUG

    const queryRes = await lendingPool
      .withSigner(liquidationSignerSpender)
      .query.liquidate(
        userAddress,
        biggestDebtData.underlyingAddress,
        biggestCollateralData.underlyingAddress,
        amountToRepay,
        minimumTokenReceivedE18,
        [],
      );
    try {
      queryRes.value.unwrapRecursively();
      logger.debug('Succesfully queried liquidation');
      const tx = await lendingPool
        .withSigner(liquidationSignerSpender)
        .tx.liquidate(
          userAddress,
          biggestDebtData.underlyingAddress,
          biggestCollateralData.underlyingAddress,
          amountToRepay,
          minimumTokenReceivedE18,
          [],
          { gasLimit: getMaxGasLimit(api) },
        );
      logger.info(
        `${userAddress}| Liquidation success: ${tx.blockHash?.toString()} | events: ${JSON.stringify(replaceNumericPropsWithStrings(tx.events))}`,
      );
      const queryResAfter = await lendingPool.query.getUserFreeCollateralCoefficient(userAddress);

      const biggestDebtReserveAfter = (await lendingPool.query.viewReserveData(biggestDebtData.underlyingAddress.toString())).value.ok!;
      const biggestDebtPSPBalanceOfLendingPoolAfter = (
        await getContractObject(Psp22Ownable, biggestDebtData.underlyingAddress, liquidationSignerSpender, api).query.balanceOf(lendingPool.address)
      ).value.ok!;
      const borrowerBiggestDebtReserveAfter = (await lendingPool.query.viewUserReserveData(biggestDebtData.underlyingAddress, userAddress)).value.ok!;

      const borrowerBiggestCollateralReserveAfter = (
        await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, userAddress)
      ).value.ok!;
      const liquidationSpenderBiggestDebtReserveAfter = (
        await lendingPool.query.viewUserReserveData(biggestDebtData.underlyingAddress, liquidationSignerSpender.address)
      ).value.ok!;
      const liqudationSpenderBiggestCollateralReserveAfter = (
        await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, liquidationSignerSpender.address)
      ).value.ok!;

      logger.info({
        userAddress,
        collateralized: replaceNumericPropsWithStrings(queryResAfter.value.ok)[0],
        collateralCoefficient: replaceNumericPropsWithStrings(queryResAfter.value.ok)[1],
        biggestDebtReserveBefore: replaceNumericPropsWithStrings(biggestDebtReserveBefore),
        biggestDebtDataAfter: replaceNumericPropsWithStrings(biggestDebtReserveAfter),
        biggestDebtPSPBalanceOfLendingPool: biggestDebtPSPBalanceOfLendingPool.toString(),
        biggestDebtPSPBalanceOfLendingPoolAfter: biggestDebtPSPBalanceOfLendingPoolAfter.toString(),
        borrowerBiggestDebtReserveBefore: replaceNumericPropsWithStrings(borrowerBiggestDebtReserveBefore),
        borrowerBiggestDebtReserveAfter: replaceNumericPropsWithStrings(borrowerBiggestDebtReserveAfter),
        borrowerBiggestCollateralReserveBefore: replaceNumericPropsWithStrings(borrowerBiggestCollateralReserveBefore),
        borrowerBiggestCollateralReserveAfter: replaceNumericPropsWithStrings(borrowerBiggestCollateralReserveAfter),
        liquidationSpenderBiggestDebtReserveBefore: replaceNumericPropsWithStrings(liquidationSpenderBiggestDebtReserveBefore),
        liquidationSpenderBiggestDebtReserveAfter: replaceNumericPropsWithStrings(liquidationSpenderBiggestDebtReserveAfter),
        liqudationSpenderBiggestCollateralReserveBefore: replaceNumericPropsWithStrings(liqudationSpenderBiggestCollateralReserveBefore),
        liqudationSpenderBiggestCollateralReserveAfter: replaceNumericPropsWithStrings(liqudationSpenderBiggestCollateralReserveAfter),
      });
    } catch (e) {
      logger.error(`${userAddress}| liquidation unsuccessfull`);
      logger.error(e);
      if (isEqual(LendingPoolErrorBuilder.Collaterized(), e)) {
        logger.warn(`${userAddress}| user was collateralized`);
        return false;
      }
    }
    return true;
  }
  async processLiquidationMessage(data: LiquidationRequestData) {
    logger.info('Processing message...');
    logger.info(data);
    return this.tryLiquidate(data.userAddress, data.biggestDebtData, data.biggestCollateralData);
  }
  async liquidateUsingChainData(userAddress: string) {
    const dataFetchStrategy = new ChainDataFetchStrategy();
    const priceFetchStrategy = new DIAOraclePriceFetchStrategy();

    const reserveDatas = await dataFetchStrategy.fetchReserveDatas();
    const marketRules = await dataFetchStrategy.fetchMarketRules();
    const [{ userConfig, userReserves }] = await dataFetchStrategy.fetchUserReserveDatas([userAddress]);
    const userAppliedMarketRule = marketRules.get(userConfig.marketRuleId.toNumber())!;
    const pricesE18ByReserveAddress = (await priceFetchStrategy.fetchPricesE18()).reduce(
      (acc, [reserveName, currentPriceE18]) => {
        try {
          const address = RESERVE_UNDERLYING_ADDRESS_BY_NAME[reserveName]; //TODO
          acc[address] = new BN(currentPriceE18);
        } catch (e) {
          logger.info({ currentPriceE18, reserveName, e });
          throw e;
        }
        return acc;
      },
      {} as Record<string, BN>,
    );
    const { debtPower, biggestDebtData } = getDebtPowerE6BNAndBiggestLoan(
      reserveDatas,
      pricesE18ByReserveAddress,
      userReserves,
      userAppliedMarketRule,
    );
    const { collateralPower, biggestCollateralData } = getCollateralPowerE6AndBiggestDeposit(
      userConfig,
      reserveDatas,
      pricesE18ByReserveAddress,
      userReserves,
      userAppliedMarketRule,
    );
    if (collateralPower.gt(debtPower)) {
      logger.warn(`address ${userAddress} incorrectly submitted for liquidation`);
      return true; //TODO enum
    }
    if (collateralPower.eqn(0) && debtPower.eqn(0)) {
      logger.warn(`Unexpected Behavior: collateralPower & debtPower equal to zero`);
      return true;
    }
    return this.tryLiquidate(userAddress, replaceNumericPropsWithStrings(biggestDebtData), replaceNumericPropsWithStrings(biggestCollateralData));
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    logger.info('Liquidator running...');
    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.prefetch(1); //TODO increase the number once everything works fine

    process.once('SIGINT', async () => {
      logger.info('got sigint, closing connection');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
    await channel.assertQueue(LIQUIDATION_QUEUE_NAME, { durable: true });

    await channel.consume(
      LIQUIDATION_QUEUE_NAME,
      (msg) => {
        // has to be synchronous function otherwise channel.ack does not work
        if (!msg) {
          logger.warn('empty message');
          return;
        }
        const liquidationRequest = JSON.parse(msg.content.toString()) as LiquidationRequestData;
        this.processLiquidationMessage(liquidationRequest)
          .then((res) => {
            if (res) {
              logger.info('acking message');
              channel.ack(msg);
            } else {
              this.liquidateUsingChainData(liquidationRequest.userAddress)
                .then((fallbackRes) => {
                  if (fallbackRes) {
                    logger.info('after fallback | acking message');
                    channel.ack(msg);
                  } else {
                    logger.info('nacking message');
                    channel.nack(msg);
                  }
                })
                .catch((e) => {
                  logger.error('UNHANDLED');
                  logger.error(e);
                  process.exit(1);
                });
            }
          })
          .catch(() => channel.nack(msg));
      },
      {
        noAck: false,
        consumerTag: 'liquidator_consumer',
      },
    );
    logger.info('Liquidator [*] Waiting for messages. To exit press CTRL+C');
  }
}
