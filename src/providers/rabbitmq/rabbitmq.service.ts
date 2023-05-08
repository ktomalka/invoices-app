import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  getOptions(noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
        queueOptions: { durable: true },
        noAck,
        persistent: false,
        prefetchCount: 1,
      },
    };
  }

  async deleteInvoice(data: any, context: RmqContext) {
    // ...work to do...

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }

  async addInvoice(data: any, context: RmqContext) {
    // ...work to do...

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
