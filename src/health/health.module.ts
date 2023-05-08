import { Logger, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RmqModule } from 'src/providers/rabbitmq/rabbitmq.module';
import { RmqService } from 'src/providers/rabbitmq/rabbitmq.service';

@Module({
  imports: [RmqModule.register()],
  controllers: [HealthController],
  providers: [HealthService, RmqService, Logger],
  exports: [HealthService],
})
export class HealthModule {}
