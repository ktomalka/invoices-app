import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AuthGuard } from './guards/auth.guard';
import { HealthModule } from './health/health.module';
import { InvoicesModule } from './http/invoices/invoices.module';
import { winstonConfig } from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [winstonConfig],
    }),
    HealthModule,
    InvoicesModule,
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((data) => {
            let logData: any = data;

            if (Array.isArray(logData.stack)) {
              logData = {
                ...logData,
                ...logData.stack[0],
              };

              logData.stack.length === 1
                ? delete logData.stack
                : delete logData.stack[0];
            }

            if (logData.error !== null && logData.error instanceof Error) {
              logData.error = {
                message: logData.error.message,
                stack: logData.error.stack,
              };
            }

            return `[${data.timestamp}] [${process.env.npm_package_name}] [${
              data.level
            }] [${
              process.env.NODE_ENV === 'development'
                ? JSON.stringify(logData, null, 4)
                : JSON.stringify(logData)
            }]`;
          }),
        ),
        transports: [...config.get('winston.transports')],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuard)
      .exclude({ path: '/health', method: RequestMethod.GET })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
