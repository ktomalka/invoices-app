import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { json } from 'body-parser';
import morgan from 'morgan';

import { AppModule } from './app.module';

import { RmqModule } from './providers/rabbitmq/rabbitmq.module';
import { RmqService } from './providers/rabbitmq/rabbitmq.service';

async function bootstrap() {
  const rabbit = await NestFactory.create(RmqModule);
  const rmqService = rabbit.get<RmqService>(RmqService);
  rabbit.connectMicroservice(rmqService.getOptions());
  await rabbit.startAllMicroservices();

  const app = await NestFactory.create(AppModule);

  // Disable headers
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.getHttpAdapter().getInstance().disable('etag');

  // Trust proxy headers
  app.getHttpAdapter().getInstance().enable('trust proxy');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(json({ limit: '200kb' }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(
    morgan(
      '[:res[X-Request-Id]] :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    ),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
