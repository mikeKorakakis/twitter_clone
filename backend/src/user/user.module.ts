import { Module, forwardRef } from '@nestjs/common';
// import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
// import { UserResolver } from './user.resolver';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities';
import { UserController } from './user.controller';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
