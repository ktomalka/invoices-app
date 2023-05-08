import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rabbitmq.service';
import { RmqServiceName } from 'src/enums';
import { RabbitMqController } from './rabbitmq.controller';

@Module({
  providers: [RmqService],
  exports: [RmqService],
  controllers: [RabbitMqController],
})
export class RmqModule {
  static register(): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: RmqServiceName.INVOICES,
            useFactory: () => ({
              transport: Transport.RMQ,
              options: {
                urls: [process.env.RABBITMQ_URL],
                queue: process.env.RABBITMQ_QUEUE,
              },
            }),
          },
        ]),
      ],
      controllers: [RabbitMqController],
      exports: [ClientsModule],
    };
  }
}
