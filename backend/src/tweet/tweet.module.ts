import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { Tweet } from './entities/tweet.entity';
import { TweetService } from './tweet.service';
import { TweetResolver } from './tweet.resolver';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Tweet])],
  providers: [TweetService, TweetResolver],
})

export class TweetModule {}
