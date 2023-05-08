import { registerAs } from '@nestjs/config';
import * as winston from 'winston';
import SentryTransport from 'winston-transport-sentry-node';

export const winstonConfig = registerAs('winston', () => {
  const transports = [];
  if (process.env.WINSTON_TRANSPORT_CONSOLE_ENABLE === 'true') {
    transports.push(
      new winston.transports.Console({
        handleExceptions: true,
        level: 'info',
      }),
    );
  }

  if (process.env.WINSTON_TRANSPORT_FILE_ENABLE === 'true') {
    transports.push(
      new winston.transports.File({
        filename: process.env.WINSTON_TRANSPORT_FILE_PATH,
        handleExceptions: true,
      }),
    );
  }

  if (process.env.WINSTON_TRANSPORT_SENTRY_ENABLE === 'true') {
    transports.push(
      new SentryTransport({
        sentry: {
          normalizeDepth: 10,
          dsn: process.env.WINSTON_TRANSPORT_SENTRY_DSN,
          environment: process.env.NODE_ENV,
          release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
        },
        level: 'error',
      }),
    );
  }

  return { transports };
});
