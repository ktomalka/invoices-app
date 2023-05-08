import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RmqServiceName } from 'src/enums';

@Injectable()
export class HealthService {
  constructor(
    @Inject(RmqServiceName.INVOICES)
    private rmqService: ClientProxy,
    private readonly logger: Logger,
  ) {}

  async status() {
    let rmq: any = { status: 'down' };

    try {
      rmq = await firstValueFrom(this.rmqService.send('info', '_'));
    } catch (error) {
      this.logger.error('RabbitMQ', { error });
    }

    return {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      rmq,
    };
  }
}
