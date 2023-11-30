import { ApiProviderWrapper, sleep } from 'scripts/common';
import { AMQP_URL, LIQUIDATION_EXCHANGE, LIQUIDATION_QUEUE_NAME, LIQUIDATION_ROUTING_KEY } from 'src/messageQueueConsts';
import amqplib from 'amqplib';
import winston from 'winston';
import { LiquidationData } from 'src/types';
import { LendingPool, Psp22Ownable, getContractObject, replaceRNBNPropsWithStrings } from '@abaxfinance/contract-helpers';
import { KeyringPair } from '@polkadot/keyring/types';
import Keyring from '@polkadot/keyring';
import { LENDING_POOL_ADDRESS } from 'src/utils';
import { BN } from 'bn.js';

export class Liquidator {
  liquidationSignerSpender: KeyringPair;
  apiProviderWrapper: ApiProviderWrapper;

  constructor() {
    const keyring = new Keyring();
    this.liquidationSignerSpender = keyring.createFromUri(process.env.SEED ?? '', {}, 'sr25519');

    const wsEndpoint = process.env.WS_ENDPOINT;
    if (!wsEndpoint) throw 'could not determine wsEndpoint';
    this.apiProviderWrapper = new ApiProviderWrapper(wsEndpoint);
  }
  async processLiquidationMessage(data: LiquidationData) {
    const api = await this.apiProviderWrapper.getAndWaitForReady();
    const lendingPool = getContractObject(LendingPool, LENDING_POOL_ADDRESS, this.liquidationSignerSpender, api);
    const { biggestDebtData, userAddress, biggestCollateralData } = data;
    // const minimumTokenReceivedE18 = calculateMinimumTokenReceivedE18(
    //   biggestDebtData,
    //   biggestCollateralData,
    //   reserveDatas,
    //   priceMap,
    //   userChosenMarketRule,
    // );
    const minimumTokenReceivedE18 = 1;
    const reserveTokenToRepay = getContractObject(Psp22Ownable, biggestDebtData.underlyingAddress.toString(), this.liquidationSignerSpender, api);
    const amountToLiquidate = new BN(biggestDebtData.amountRawE6).muln(2);
    await reserveTokenToRepay.tx.approve(lendingPool.address, amountToLiquidate);
    const queryRes = await lendingPool
      .withSigner(this.liquidationSignerSpender)
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
      console.log(new Date(), 'Succesfully liquidated');
    } catch (e) {
      console.error(new Date(), 'liquidation unsuccessfull', e);
    }
    console.table([
      ...Object.entries({
        userAddress,
        loanUnderlyingAddress: biggestDebtData.underlyingAddress,
        collateralUnderlyingAddress: biggestCollateralData.underlyingAddress,
        minimumTokenReceivedE18: minimumTokenReceivedE18.toString(),
      }),
      ...Object.entries(replaceRNBNPropsWithStrings(biggestCollateralData)).map(([k, v]) => [`biggestCollateralData__${k}`, v]),
      ...Object.entries(replaceRNBNPropsWithStrings(biggestDebtData)).map(([k, v]) => [`biggestLoanData__${k}`, v]),
    ]);
  }
  async runLoop() {
    // eslint-disable-next-line no-constant-condition
    console.log('Liquidator', 'running...');

    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.prefetch(1);

    process.once('SIGINT', async () => {
      console.log('got sigint, closing connection');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
    await channel.assertQueue(LIQUIDATION_QUEUE_NAME, { durable: true });

    await channel.consume(
      LIQUIDATION_QUEUE_NAME,
      async (msg) => {
        console.log('processing messages');
        if (!msg) {
          winston.warn('empty message');
          return;
        }
        await this.processLiquidationMessage(JSON.parse(msg.content.toString()) as LiquidationData);
        channel.ack(msg);
      },
      {
        noAck: false,
        consumerTag: 'email_consumer',
      },
    );
    console.log('Liquidator [*] Waiting for messages. To exit press CTRL+C');
  }
}
