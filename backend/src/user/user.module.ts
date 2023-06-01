import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User } from '../common/entities/user.entity';
// import { UserResolver } from './user.resolver';
import { PostModule } from '../post/post.module';
import { Post } from '../post/entities/post.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [UserService, UserResolver ],
  exports: [UserService ],
})
export class UserModule {}
