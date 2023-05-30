import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from '../auth/strategies';
import { AuthResolver } from '../auth/auth.resolver';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Post]),
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
