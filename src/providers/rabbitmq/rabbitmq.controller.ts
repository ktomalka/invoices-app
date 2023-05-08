import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from './rabbitmq.service';

@Controller('subscribers')
export class RabbitMqController {
  public eventsCount = 0;

  constructor(private readonly rmqService: RmqService) {}

  @MessagePattern('info')
  async info(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    return {
      status: 'up',
      eventsCount: this.eventsCount,
    };
  }

  @MessagePattern('invoice_new')
  async invoice_new(@Payload() payload: any, @Ctx() context: RmqContext) {
    this.eventsCount++;
    this.rmqService.addInvoice(payload, context);
  }

  @MessagePattern('invoice_delete')
  async invoice_delete(@Payload() payload: any, @Ctx() context: RmqContext) {
    this.eventsCount++;
    this.rmqService.deleteInvoice(payload, context);
  }
}
