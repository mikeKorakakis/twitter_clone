import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import  { join } from 'path';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { AuthModule } from '../auth/auth.module';
import { User } from '../common/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { UserModule } from '../user/user.module';

import { ThrottlerModule } from '@nestjs/throttler';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from '../post/post.module';
import GraphQLJSON from 'graphql-type-json';
import { TweetModule } from '../tweet/tweet.module';
import { Tweet } from '../tweet/entities/tweet.entity';

import { useServer } from 'graphql-ws/lib/use/ws';
import { Server } from 'ws';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
// const cookieSession = require('cookie-session');

// import cookieSession from 'cookie-session';
// import { Tweet } from '../tweet/tweet.entity';
// import { TweetModule } from '../tweet/tweet.module';

const isProduction = process.env.NODE_ENV === 'production';
console.log(' process.cwd(),', process.cwd());
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), `.env.${process.env.NODE_ENV}`),
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.get('REDIS_HOST') || 'localhost',
            port: configService.get('REDIS_PORT') || 6379,
          },
        };
      },
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
          entities: [User, Post, Tweet],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [JwtModule, ConfigModule],
      inject: [JwtService, ConfigService],
      driver: ApolloDriver,
      useFactory: (jwtService: JwtService, configService: ConfigService) => ({
        autoSchemaFile: path.join(process.cwd(), 'src', 'schema.gql'),
        context: ({ req, res }) => ({ req, res }),
        playground: true, // Enable GraphQL Playground,
        resolvers: { JSON: GraphQLJSON },
        //   installSubscriptionHandlers: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: any) => {
              const { connectionParams, extra } = context;
              const authToken = connectionParams.token as string;
              try {
                const userData = await jwtService.verifyAsync(authToken, {
                  secret: configService.get('JWT_ACCESS_SECRET_KEY'),
                });
                extra.user = userData;
                return { user: userData };
              } catch (err) {
                console.error('Error verifying token', err);
                throw new Error('Unauthorized');
              }
            },
          },
          context: async ({ extra }) => {
            return {
              user: extra.user,
            };
          },
        },
      }),
      //   subscriptions: {
      //     'subscriptions-transport-ws': {
      //       onConnect: (connectionParams, websocket, context) => {
      //         const authToken = connectionParams.authToken;
      //         // validate the authToken here. If it's invalid, throw an error.
      //         // If it's valid, you could return an object containing user's data
      //       },
      //     },
      //   },
    }),
    UserModule,
    AuthModule,
    PostModule,
    TweetModule,
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
