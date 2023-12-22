import {
  ApiProviderWrapper,
  LendingPool,
  LendingPoolErrorBuilder,
  Psp22Ownable,
  getContractObject,
  replaceNumericPropsWithStrings,
} from '@abaxfinance/contract-helpers';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { BaseActor } from '@src/base-actor/BaseActor';
import { ChainDataFetchStrategy } from '@src/hf-recalculation/ChainDataFetchStrategy';
import { getCollateralPowerE6AndBiggestDeposit, getDebtPowerE6BNAndBiggestLoan } from '@src/hf-recalculation/utils';
import { logger } from '@src/logger';
import { AMQP_URL, LIQUIDATION_QUEUE_NAME } from '@src/messageQueueConsts';
import { DIAOraclePriceFetchStrategy } from '@src/price-updating/price-fetch-strategy/DIAOraclePriceFetchStrategy';
import type { LiquidationRequestData } from '@src/types';
import { LENDING_POOL_ADDRESS } from '@src/utils';
import amqplib from 'amqplib';
import BN from 'bn.js';

export class Liquidator extends BaseActor {
  _liquidationSignerSpender?: KeyringPair;
  apiProviderWrapper: ApiProviderWrapper;
  wsEndpoint: string;

  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.wsEndpoint = wsEndpoint;
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  }
  async getLiquidationSignerSpender() {
    await this.apiProviderWrapper.getAndWaitForReady();
    if (this._liquidationSignerSpender) return this._liquidationSignerSpender;
    const keyring = new Keyring();
    this._liquidationSignerSpender = keyring.createFromUri(process.env.SEED ?? '', {}, 'sr25519');
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

    const amountToLiquidate = new BN(biggestDebtData.amountRawE6).muln(2);
    await reserveTokenToRepay.tx.approve(lendingPool.address, amountToLiquidate);

    //DEBUG
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
        amountToLiquidate,
        minimumTokenReceivedE18,
        [],
      );
    try {
      queryRes.value.unwrapRecursively();
      logger.info('Succesfully queried liquidation');
      // const tx = await lendingPool
      //   .withSigner(liquidationSignerSpender)
      //   .tx.liquidate(
      //     userAddress,
      //     biggestDebtData.underlyingAddress,
      //     biggestCollateralData.underlyingAddress,
      //     amountToLiquidate,
      //     minimumTokenReceivedE18,
      //     [],
      //   );
      // logger.info(replaceNumericPropsWithStrings(tx));
    } catch (e) {
      logger.error('liquidation unsuccessfull');
      logger.error(e);
      if (LendingPoolErrorBuilder.Collaterized() === e) {
        logger.warn('user was collateralized');
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
      (acc, [address, currentPriceE18]) => {
        try {
          acc[address] = new BN(currentPriceE18);
        } catch (e) {
          logger.info({ currentPriceE18, address, e });
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
      return false;
    }
    return this.tryLiquidate(userAddress, replaceNumericPropsWithStrings(biggestDebtData), replaceNumericPropsWithStrings(biggestCollateralData));
  }

  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    logger.info('Liquidator running...');
    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.prefetch(1);

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
              this.liquidateUsingChainData(liquidationRequest.userAddress).then((fallbackRes) => {
                if (fallbackRes) {
                  logger.info('after fallback | acking message');
                  channel.ack(msg);
                } else {
                  logger.info('nacking message');
                  channel.nack(msg);
                }
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
