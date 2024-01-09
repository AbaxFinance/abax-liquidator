import {
  ApiProviderWrapper,
  LendingPool,
  LendingPoolErrorBuilder,
  Psp22Ownable,
  getContractObject,
  replaceNumericPropsWithStrings,
  type UserReserveData,
  type ReserveData,
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
import type { ReturnNumber } from 'wookashwackomytest-typechain-types';
import { nobody } from '@polkadot/keyring/pair/nobody';

const DEBUG_SLOW_MODE = !!process.env.DEBUG_SLOW_MODE;

logger.info(`DEBUG_SLOW_MODE: ${DEBUG_SLOW_MODE}`);

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
  lendingPool?: LendingPool;
  psp22Contract?: Psp22Ownable;
  messageRetryCounter: Map<string, number> = new Map();

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
    biggestDebtPowerData: {
      powerE6: string;
      underlyingAddress: string;
    },
    biggestCollateralData: {
      amountRawE6: string;
      underlyingAddress: string;
    },
  ) {
    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const liquidationSignerSpender = await this.getLiquidationSignerSpender();
    const [lendingPool, psp22Contract] = this.getContracts(liquidationSignerSpender, api);
    // const minimumTokenReceivedE18 = calculateMinimumTokenReceivedE18();
    const minimumTokenReceivedE18 = 1;
    const reserveTokenToRepay = psp22Contract.withAddress(biggestDebtPowerData.underlyingAddress.toString());

    logger.info({
      userAddress,
      minimumTokenReceivedE18: minimumTokenReceivedE18.toString(),
      biggestCollateralData: replaceNumericPropsWithStrings(biggestCollateralData),
      biggestDebtPowerData: replaceNumericPropsWithStrings(biggestDebtPowerData),
    });

    const amountToRepay = new BN(`999999999999999999999999999`).muln(2); //TODO remove muln2
    const approveQueryRes = await reserveTokenToRepay.query.approve(lendingPool.address, amountToRepay);
    try {
      approveQueryRes.value.unwrapRecursively();
      await reserveTokenToRepay.tx.approve(lendingPool.address, amountToRepay); //TODO handle unhandled rejections
    } catch (e) {
      logger.error(`failed to approve: reason ${JSON.stringify(e)}`); //TODO
      return false;
    }

    const {
      biggestDebtReserveBefore,
      biggestDebtPSPBalanceOfLendingPool,
      borrowerBiggestDebtReserveBefore,
      borrowerBiggestCollateralReserveBefore,
      liquidationSpenderBiggestDebtReserveBefore,
      liqudationSpenderBiggestCollateralReserveBefore,
    } = await debugLogBefore(lendingPool, biggestDebtPowerData, userAddress, biggestCollateralData, liquidationSignerSpender, api);

    const queryRes = await lendingPool
      .withSigner(liquidationSignerSpender)
      .query.liquidate(
        userAddress,
        biggestDebtPowerData.underlyingAddress,
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
          biggestDebtPowerData.underlyingAddress,
          biggestCollateralData.underlyingAddress,
          amountToRepay,
          minimumTokenReceivedE18,
          [],
          { gasLimit: getMaxGasLimit(api) },
        );
      logger.info(
        `${userAddress}| Liquidation success: ${tx.blockHash?.toString()} | events: ${JSON.stringify(replaceNumericPropsWithStrings(tx.events))}`,
      );

      this.messageRetryCounter.set(userAddress, 0);
      if (DEBUG_SLOW_MODE)
        await debugLogAfter(
          lendingPool,
          userAddress,
          biggestDebtPowerData,
          liquidationSignerSpender,
          api,
          biggestCollateralData,
          biggestDebtReserveBefore,
          biggestDebtPSPBalanceOfLendingPool,
          borrowerBiggestDebtReserveBefore,
          borrowerBiggestCollateralReserveBefore,
          liquidationSpenderBiggestDebtReserveBefore,
          liqudationSpenderBiggestCollateralReserveBefore,
        );
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
  private getContracts(liquidationSignerSpender: KeyringPair, api: ApiPromise) {
    if (this.lendingPool && this.psp22Contract) return [this.lendingPool, this.psp22Contract] as const;
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, liquidationSignerSpender, api);
    const psp22Contract = getContractObject(Psp22Ownable, nobody().address, liquidationSignerSpender, api);
    this.lendingPool = lendingPool;
    this.psp22Contract = psp22Contract;
    return [this.lendingPool, this.psp22Contract] as const;
  }

  async processLiquidationMessage(data: LiquidationRequestData) {
    logger.info(`${data.userAddress} | Processing message...`);
    // logger.info(data);
    return this.tryLiquidate(data.userAddress, data.biggestDebtPowerData, data.biggestCollateralData);
  }
  async tryLiquidateUsingChainData(userAddress: string) {
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
    const { debtPower, biggestDebtPowerData } = getDebtPowerE6BNAndBiggestLoan(
      reserveDatas,
      pricesE18ByReserveAddress,
      userReserves,
      userAppliedMarketRule,
    );
    const { collateralPower, biggestCollateralPowerData } = getCollateralPowerE6AndBiggestDeposit(
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
    return this.tryLiquidate(
      userAddress,
      replaceNumericPropsWithStrings(biggestDebtPowerData),
      replaceNumericPropsWithStrings(biggestCollateralPowerData),
    );
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    logger.info('Liquidator running...');
    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.prefetch(DEBUG_SLOW_MODE ? 1 : 10);

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
              logger.info('Failed to liquidate using provided data, trying fallback...');
              this.tryLiquidateUsingChainData(liquidationRequest.userAddress)
                .then((fallbackRes) => {
                  if (fallbackRes) {
                    logger.info('after fallback | acking message');
                    channel.ack(msg);
                  } else {
                    this.handleFailedMessageProcessing(liquidationRequest, channel, msg);
                  }
                })
                .catch((e) => {
                  logger.error('UNHANDLED');
                  logger.error(e);
                  this.handleFailedMessageProcessing(liquidationRequest, channel, msg);
                });
            }
          })
          .catch((e) => {
            logger.error('UNHANDLED');
            logger.error(e);
            this.handleFailedMessageProcessing(liquidationRequest, channel, msg);
          });
      },
      {
        noAck: false,
        consumerTag: 'liquidator_consumer',
      },
    );
    logger.info('Liquidator [*] Waiting for messages. To exit press CTRL+C');
  }

  private handleFailedMessageProcessing(liquidationRequest: LiquidationRequestData, channel: amqplib.Channel, msg: amqplib.ConsumeMessage) {
    if (this.messageRetryCounter.get(liquidationRequest.userAddress) ?? 0 > 10) {
      logger.error(`Failed to liquidate ${liquidationRequest.userAddress} after 10 retries, acking msg anyway...`);
      channel.ack(msg);
    } else {
      logger.info('nacking message');
      channel.nack(msg);
      this.messageRetryCounter.set(liquidationRequest.userAddress, (this.messageRetryCounter.get(liquidationRequest.userAddress) ?? 0) + 1);
    }
  }
}
async function debugLogBefore(
  lendingPool: LendingPool,
  biggestDebtPowerData: { powerE6: string; underlyingAddress: string },
  userAddress: string,
  biggestCollateralData: { amountRawE6: string; underlyingAddress: string },
  liquidationSignerSpender: KeyringPair,
  api: ApiPromise,
) {
  let biggestDebtReserveBefore: ReserveData | null = null;
  let biggestDebtPSPBalanceOfLendingPool: ReturnNumber | null = null;
  let borrowerBiggestDebtReserveBefore: UserReserveData | null = null;
  let borrowerBiggestCollateralReserveBefore: UserReserveData | null = null;
  let liquidationSpenderBiggestDebtReserveBefore: UserReserveData | null = null;
  let liqudationSpenderBiggestCollateralReserveBefore: UserReserveData | null = null;
  if (!DEBUG_SLOW_MODE) {
    logger.warn(`debug log before call is not supported in non debug mode`);
    return {
      biggestDebtReserveBefore,
      biggestDebtPSPBalanceOfLendingPool,
      borrowerBiggestDebtReserveBefore,
      borrowerBiggestCollateralReserveBefore,
      liquidationSpenderBiggestDebtReserveBefore,
      liqudationSpenderBiggestCollateralReserveBefore,
    };
  }
  biggestDebtReserveBefore = (await lendingPool.query.viewReserveData(biggestDebtPowerData.underlyingAddress.toString())).value.ok!;
  borrowerBiggestDebtReserveBefore = (await lendingPool.query.viewUserReserveData(biggestDebtPowerData.underlyingAddress, userAddress)).value.ok!;
  borrowerBiggestCollateralReserveBefore = (await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, userAddress)).value
    .ok!;
  liquidationSpenderBiggestDebtReserveBefore = (
    await lendingPool.query.viewUserReserveData(biggestDebtPowerData.underlyingAddress, liquidationSignerSpender.address)
  ).value.ok!;
  liqudationSpenderBiggestCollateralReserveBefore = (
    await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, liquidationSignerSpender.address)
  ).value.ok!;

  biggestDebtPSPBalanceOfLendingPool = (
    await getContractObject(Psp22Ownable, biggestDebtPowerData.underlyingAddress, liquidationSignerSpender, api).query.balanceOf(lendingPool.address)
  ).value.ok!;
  const queryResD = await lendingPool.query.getUserFreeCollateralCoefficient(userAddress);
  logger.info({
    userAddress,
    collateralized: replaceNumericPropsWithStrings(queryResD.value.ok)[0],
    collateralCoefficient: replaceNumericPropsWithStrings(queryResD.value.ok)[1],
  });
  return {
    biggestDebtReserveBefore,
    biggestDebtPSPBalanceOfLendingPool,
    borrowerBiggestDebtReserveBefore,
    borrowerBiggestCollateralReserveBefore,
    liquidationSpenderBiggestDebtReserveBefore,
    liqudationSpenderBiggestCollateralReserveBefore,
  };
}

async function debugLogAfter(
  lendingPool: LendingPool,
  userAddress: string,
  biggestDebtPowerData: { powerE6: string; underlyingAddress: string },
  liquidationSignerSpender: KeyringPair,
  api: ApiPromise,
  biggestCollateralData: { amountRawE6: string; underlyingAddress: string },
  biggestDebtReserveBefore: ReserveData | null,
  biggestDebtPSPBalanceOfLendingPool: ReturnNumber | null,
  borrowerBiggestDebtReserveBefore: UserReserveData | null,
  borrowerBiggestCollateralReserveBefore: UserReserveData | null,
  liquidationSpenderBiggestDebtReserveBefore: UserReserveData | null,
  liqudationSpenderBiggestCollateralReserveBefore: UserReserveData | null,
) {
  if (
    !biggestDebtReserveBefore ||
    !biggestDebtPSPBalanceOfLendingPool ||
    !borrowerBiggestDebtReserveBefore ||
    !borrowerBiggestCollateralReserveBefore ||
    !liquidationSpenderBiggestDebtReserveBefore ||
    !liqudationSpenderBiggestCollateralReserveBefore
  ) {
    logger.warn(`unexpected debug log after call, some of the values are null`);
    return;
  }
  const queryResAfter = await lendingPool.query.getUserFreeCollateralCoefficient(userAddress);

  const biggestDebtReserveAfter = (await lendingPool.query.viewReserveData(biggestDebtPowerData.underlyingAddress.toString())).value.ok!;
  const biggestDebtPSPBalanceOfLendingPoolAfter = (
    await getContractObject(Psp22Ownable, biggestDebtPowerData.underlyingAddress, liquidationSignerSpender, api).query.balanceOf(lendingPool.address)
  ).value.ok!;
  const borrowerBiggestDebtReserveAfter = (await lendingPool.query.viewUserReserveData(biggestDebtPowerData.underlyingAddress, userAddress)).value
    .ok!;

  const borrowerBiggestCollateralReserveAfter = (await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, userAddress))
    .value.ok!;
  const liquidationSpenderBiggestDebtReserveAfter = (
    await lendingPool.query.viewUserReserveData(biggestDebtPowerData.underlyingAddress, liquidationSignerSpender.address)
  ).value.ok!;
  const liqudationSpenderBiggestCollateralReserveAfter = (
    await lendingPool.query.viewUserReserveData(biggestCollateralData.underlyingAddress, liquidationSignerSpender.address)
  ).value.ok!;

  logger.info({
    userAddress,
    collateralized: replaceNumericPropsWithStrings(queryResAfter.value.ok)[0],
    collateralCoefficient: replaceNumericPropsWithStrings(queryResAfter.value.ok)[1],
    biggestDebtReserveBefore: replaceNumericPropsWithStrings(biggestDebtReserveBefore),
    biggestDebtPowerDataAfter: replaceNumericPropsWithStrings(biggestDebtReserveAfter),
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
}
