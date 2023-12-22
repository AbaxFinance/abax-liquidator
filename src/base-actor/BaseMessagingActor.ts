import { BaseActor } from '@src/base-actor/BaseActor';
import { AMQP_URL, LIQUIDATION_EXCHANGE } from '@src/messageQueueConsts';
import type { Channel } from 'amqplib';
import amqplib from 'amqplib';

export abstract class BaseMessagingActor extends BaseActor {
  channel?: Channel;
  queueName: string;
  routingKey: string;

  constructor(queueName: string, routingKey: string) {
    super();
    this.queueName = queueName;
    this.routingKey = routingKey;
  }

  protected async getChannel() {
    if (this.channel) return this.channel;
    const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
    const channel = await connection.createChannel();
    await channel.assertExchange(LIQUIDATION_EXCHANGE, 'x-message-deduplication', {
      durable: true,
      arguments: {
        'x-cache-size': 100_000,
        'x-cache-persistence': 'disk' as 'disk' | 'memory',
      },
    });
    await channel.assertQueue(this.queueName, { durable: true });
    await channel.bindQueue(this.queueName, LIQUIDATION_EXCHANGE, this.routingKey);
    this.channel = channel;
    return this.channel;
  }
}
