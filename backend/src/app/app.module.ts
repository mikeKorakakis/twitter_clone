import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import  { join } from 'path';
import * as path from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { User } from '../common/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

// const cookieSession = require('cookie-session');

// import cookieSession from 'cookie-session';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
// import { Tweet } from '../tweet/tweet.entity';
// import { TweetModule } from '../tweet/tweet.module';

const isProduction = process.env.NODE_ENV === 'production';
console.log(' process.cwd(),', process.cwd());
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(
        process.cwd(),       
        `.env.${process.env.NODE_ENV}`,
      ),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
        isGlobal: true
    }),
    ThrottlerModule.forRoot({
        ttl: 60,
        limit: 10,
    }),
    RedisModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
            return {
                config: {
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: configService.get('REDIS_PORT') || 6379,
                }
            }
        }
    }),

    // TypeOrmModule.forRoot({
    //   type: isProduction ? 'postgres' : 'sqlite',
    //   host: isProduction ? 'your_postgres_host' : undefined,
    //   port: isProduction ? 5432 : undefined,
    //   username: isProduction ? 'your_database_user' : undefined,
    //   password: isProduction ? 'your_database_password' : undefined,
    //   database: isProduction
    //     ? 'your_database_name'
    //     : path.resolve(__dirname, '../../../sqlite.db'),
    //   entities: [User],
    //   //   entities: [join(__dirname, '**/*.entity{.ts,.js}')],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('DB_TYPE', configService.get('DB_TYPE'));
        return {
          type: configService.get('DB_TYPE') as any,
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database:
            configService.get('DB_TYPE') === 'postgres'
              ? (configService.get('DB_NAME') as string)
              : path.resolve(__dirname, '../../../sqlite.db'),
          entities: [User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'backend', 'src', 'schema.gql'),
        context: ({ req, res }) => ({ req, res }),
      playground: true, // Enable GraphQL Playground
    }),
    UserModule,
    AuthModule,
    // TweetModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     whitelist: true,
    //   }),
    // },
  ],
})
export class AppModule {}
