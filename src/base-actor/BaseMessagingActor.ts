import { BaseActor } from '@src/base-actor/BaseActor';
import { AMQP_URL, LIQUIDATION_EXCHANGE, LIQUIDATION_QUEUE_NAME, LIQUIDATION_ROUTING_KEY } from '@src/messageQueueConsts';
import type { Channel } from 'amqplib';
import amqplib from 'amqplib';

export abstract class BaseMessagingActor extends BaseActor {
  channel?: Channel;

  protected async getChannel() {
    if (this.channel) return this.channel;
    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.assertExchange(LIQUIDATION_EXCHANGE, 'direct', { durable: true });
    await channel.assertQueue(LIQUIDATION_QUEUE_NAME, { durable: true });
    await channel.bindQueue(LIQUIDATION_QUEUE_NAME, LIQUIDATION_EXCHANGE, LIQUIDATION_ROUTING_KEY);
    this.channel = channel;
    return this.channel;
  }
}
