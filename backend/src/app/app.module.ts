import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import  { join } from 'path';
import * as path from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '../user/user.module';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
// const cookieSession = require('cookie-session');

// import cookieSession from 'cookie-session';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { Tweet } from '../tweet/tweet.entity';
import { TweetModule } from '../tweet/tweet.module';

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
        console.log('DATABASE_TYPE', configService.get('DATABASE_TYPE'));
        return {
          type: configService.get('DATABASE_TYPE') as any,
          host: configService.get('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database:
            configService.get('DATABASE_TYPE') === 'postgres'
              ? (configService.get('DATABASE_NAME') as string)
              : path.resolve(__dirname, '../../../sqlite.db'),
          entities: [User, Tweet],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'backend', 'src', 'schema.gql'),
      //   context: ({ req, res }) => ({ req, res }),
      playground: true, // Enable GraphQL Playground
    }),
    UserModule,
    AuthModule,
    TweetModule
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
