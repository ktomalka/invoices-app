import { Inject, Injectable, Logger } from '@nestjs/common';
import { InvoiceDto } from './invoices.dto';
import { ApiError } from 'src/common/ApiError';
import { LogCode, RmqServiceName } from 'src/enums';
import { ClientProxy } from '@nestjs/microservices';

/**
 * It's simply simulate db in json file
 */
const database: InvoiceDto[] = [];

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(RmqServiceName.INVOICES)
    private rmqService: ClientProxy,
    private readonly logger: Logger,
  ) {}

  list() {
    return database;
  }

  async add(body: InvoiceDto) {
    const isRecordExists = database.find((item) => item.id === body.id);

    if (isRecordExists) {
      throw new ApiError({
        statusCode: 400,
        response: {
          code: LogCode.CODE_E001,
        },
      });
    }

    this.logger.log('Add new invoices', { data: body });
    database.push(body);

    this.rmqService.send('invoice_new', { id: body.id }).subscribe();
  }

  delete(id: number) {
    const index = database.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new ApiError({
        statusCode: 400,
        response: {
          code: LogCode.CODE_E002,
        },
      });
    }

    this.rmqService.send('invoice_delete', { id }).subscribe();
  }
}
