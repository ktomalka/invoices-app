import { Logger, Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invices.service';
import { RmqModule } from 'src/providers/rabbitmq/rabbitmq.module';

@Module({
  imports: [RmqModule.register()],
  controllers: [InvoicesController],
  providers: [InvoicesService, Logger],
})
export class InvoicesModule {}
