import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
//   @UseGuards(JwtAuthGuard)
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

//   @Mutation(() => User)
//   async createUser(
//     @Args('username') username: string,
//     @Args('email') email: string,
//   ): Promise<User> {
//     return this.userService.createUser(username, email);
//   }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('email') email: string,
  ): Promise<User> {
    return this.userService.updateUser(id, username, email);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
