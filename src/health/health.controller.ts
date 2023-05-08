import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('/health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async health(@Res() response: Response) {
    return response.json(await this.healthService.status());
  }
}
