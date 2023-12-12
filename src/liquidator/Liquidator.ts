import { LendingPool, Psp22Ownable, getContractObject, replaceNumericPropsWithStrings } from '@abaxfinance/contract-helpers';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { BaseActor } from '@src/base-actor/BaseActor';
import { logger } from '@src/logger';
import { AMQP_URL, LIQUIDATION_QUEUE_NAME } from '@src/messageQueueConsts';
import type { LiquidationData } from '@src/types';
import { LENDING_POOL_ADDRESS } from '@src/utils';
import amqplib from 'amqplib';
import { BN } from 'bn.js';
import { ApiProviderWrapper } from 'scripts/common';

export class Liquidator extends BaseActor {
  _liquidationSignerSpender?: KeyringPair;
  apiProviderWrapper: ApiProviderWrapper;

  constructor() {
    super();
    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  }
  async getLiquidationSignerSpender() {
    await this.apiProviderWrapper.getAndWaitForReady();
    if (this._liquidationSignerSpender) return this._liquidationSignerSpender;
    const keyring = new Keyring();
    this._liquidationSignerSpender = keyring.createFromUri(process.env.SEED ?? '', {}, 'sr25519');
    return this._liquidationSignerSpender;
  }
  async processLiquidationMessage(data: LiquidationData) {
    logger.info(data);
    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const liquidationSignerSpender = await this.getLiquidationSignerSpender();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, liquidationSignerSpender, api);
    const { biggestDebtData, userAddress, biggestCollateralData } = data;
    // const minimumTokenReceivedE18 = calculateMinimumTokenReceivedE18(
    //   biggestDebtData,
    //   biggestCollateralData,
    //   reserveDatas,
    //   priceMap,
    //   userChosenMarketRule,
    // );
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
      const tx = await lendingPool
        .withSigner(liquidationSignerSpender)
        .tx.liquidate(
          userAddress,
          biggestDebtData.underlyingAddress,
          biggestCollateralData.underlyingAddress,
          amountToLiquidate,
          minimumTokenReceivedE18,
          [],
        );
      logger.info(replaceNumericPropsWithStrings(tx));
    } catch (e) {
      logger.error('liquidation unsuccessfull');
      logger.error(e);
    }
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
      async (msg) => {
        if (!msg) {
          logger.warn('empty message');
          return;
        }
        logger.info(`processing message ${msg.properties.messageId}`);
        await this.processLiquidationMessage(JSON.parse(msg.content.toString()) as LiquidationData);
        channel.ack(msg);
      },
      {
        noAck: false,
        consumerTag: 'liquidator_consumer',
      },
    );
    logger.info('Liquidator [*] Waiting for messages. To exit press CTRL+C');
  }
}

// function calculateMinimumTokenReceivedE18(
//   loanData: {
//     amountInHuman: number;
//     amountRaw: BN;
//     symbol: RESERVE_NAMES_TYPE;
//     underlyingAddress: string;
//     decimalDenominator: BN;
//   },
//   collateralData: {
//     amountRaw: BN;
//     amountInHuman: number;
//     symbol: RESERVE_NAMES_TYPE;
//     underlyingAddress: string;
//     decimalDenominator: BN;
//   },
//   reserveDatas: Record<RESERVE_NAMES_TYPE, ReserveData & { underlyingAddress: AccountId }>,
//   prices: Map<RESERVE_NAMES_TYPE, number>,
//   userChosenMarketRule: MarketRule,
// ) {
//   const assetToRepayPriceE8 = new BN((prices.get(loanData.symbol)! * E8).toString());
//   const assetToTakePriceE8 = new BN((prices.get(collateralData.symbol)! * E8).toString());
//   const reserveDataToRepay = reserveDatas[loanData.symbol];
//   const reserveDataToTake = reserveDatas[collateralData.symbol];
//   const penaltyToRepayE6 = userChosenMarketRule[reserveDataToRepay.id]!.penaltyE6!.rawNumber!;
//   const penaltyToTakeE6 = userChosenMarketRule[reserveDataToTake.id]!.penaltyE6!.rawNumber!;
//   const amountToRepay = loanData.amountRaw;

//   let amountToTake = amountToRepay
//     .mul(assetToRepayPriceE8.mul(reserveDataToTake.decimals.rawNumber).mul(E6bn.add(penaltyToRepayE6).add(penaltyToTakeE6)))
//     .div(assetToTakePriceE8.mul(reserveDataToRepay.decimals.rawNumber).mul(E6bn));

//   if (amountToTake.gt(collateralData.amountRaw)) {
//     amountToTake = collateralData.amountRaw;
//   }
//   const receivedForOneRepaidTokenE18 = amountToTake.mul(E18bn).div(amountToRepay);

//   return receivedForOneRepaidTokenE18.muln(0.95);

//   // const penaltyMultiplier = new BN(E6).add(penaltyToRepayE6).add(penaltyToTakeE6);
//   // const receivedForOneRepaidToken =
//   //   reserveDataToTake.decimals.rawNumber
//   //     .muln(assetToRepayPrice)
//   //     .mul(penaltyMultiplier)
//   //     .div(reserveDataToRepay.decimals.rawNumber)
//   //     .divn(E6)
//   //     .toNumber() / assetToTakePrice;

//   // const amountToRepay = loanData.amountRaw.muln(receivedForOneRepaidToken).gte(collateralData.amountRaw)
//   //   ? loanData.amountRaw.muln(receivedForOneRepaidToken)
//   //   : collateralData.amountRaw;

//   // return amountToRepay.mul(E18bn).div(loanData.amountRaw);
// }
