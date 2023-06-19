/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

import {
  ClassSerializerInterceptor,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { useContainer } from 'class-validator';

import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

console.error('process.env.NODE_ENV', process.env.NODE_ENV);

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    // new ExpressAdapter(),
    // { rawBody: true },
  );

  const configService = app.get<ConfigService>(ConfigService);
  const reflector = app.get(Reflector);

  // GLOBAL MIDDLEWARES
  app.enableCors({
    credentials: true,
    origin: [configService.get('ORIGIN'), configService.get('ORIGIN_SSR')],
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.use('/stripe-webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());
  //   app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Configure helmet with a custom CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", 'cdn.jsdelivr.net', "'unsafe-inline'"],
        },
      },
    }),
  );
  app.use(compression());

//   app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  //   const redisIoAdapter = new RedisIoAdapter(app)
  //   await redisIoAdapter.connectToRedis()

  //   app.useWebSocketAdapter(redisIoAdapter)

  //   const globalPrefix = 'api';
  //   app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4000;

  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       exceptionFactory: (errors: ValidationError[]) => {
  //         const result = {};

  //         errors.forEach((error) => {
  //           const constraints = Object.values(error.constraints);
  //           result[error.property] = constraints[0];
  //         });

  //         // Throw a custom ApolloError instead of HttpException
  //         throw new ApolloError('Input data validation failed', 'VALIDATION_ERROR', {
  //           errors: result,
  //         });
  //       },
  //     }),
  //   );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(Number(configService.get('APP_PORT')));

  Logger.log(
    // `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    `🚀 Application is running on: http://localhost:${port}`,
  );
  return app;
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
