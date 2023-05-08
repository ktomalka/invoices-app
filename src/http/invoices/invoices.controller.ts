import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { InvoicesService } from './invices.service';
import { InvoiceDto } from './invoices.dto';
import { LogCode } from 'src/enums';

@Controller('/invoices')
export class InvoicesController {
  constructor(
    private readonly invoiceService: InvoicesService,
    private readonly logger: Logger,
  ) {}

  @Get()
  list() {
    return this.invoiceService.list();
  }

  @Post('/add')
  async add(@Body() body: InvoiceDto, @Res() response: Response) {
    try {
      await this.invoiceService.add(body);
      response.status(201).json({ code: LogCode.CODE_D001 });
    } catch (error) {
      response.status(error.statusCode || 500).json(error.response);

      if (!error.statusCode)
        this.logger.error('Unexpected error', {
          type: 'CONTROLLER',
          name: 'INVOICES / ADD',
          error,
        });
    }
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      const invoiceId = parseInt(id);
      if (isNaN(invoiceId)) {
        return response.status(400).json({ code: LogCode.CODE_E002 });
      }

      this.invoiceService.delete(invoiceId);

      response.status(200).json({ code: LogCode.CODE_D001 });
    } catch (error) {
      response.status(error.statusCode || 500).json(error.response);

      if (!error.statusCode)
        this.logger.error('Unexpected error', {
          type: 'CONTROLLER',
          name: 'INVOICES / DELETE',
          error,
          data: { id },
        });
    }
  }
}
