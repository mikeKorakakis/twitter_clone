// import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// import { User } from './user.entity';
// import { UserService } from './user.service';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../common/entities';
import { UserService } from './user.service';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { StripeInfoPayload } from '../post/dtos/stripe-info.payload';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => StripeInfoPayload)
  async getStripeInfo(@CurrentUser() user: User) {
    return this.userService.getStripeInfo(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  async subscribeToPremium(@CurrentUser() user: User) {
    return this.userService.subscribeToPremium(user);
  }

  // Resolve the posts field for the User type
  @ResolveField('posts', () => [Post], { nullable: true })
  async posts(@Parent() user: User): Promise<Post[]> {
    const { id } = user;
    // return this.postService.findAll({ userId: id });
    return this.userService.findPostsByUser(id); // Assumes there's a findPostsByUser method in UserService
  }
}

//   @Query(() => [User])
// //   @UseGuards(JwtAuthGuard)
//   async users(): Promise<User[]> {
//     return this.userService.findAll();
//   }

// //   @Mutation(() => User)
// //   async createUser(
// //     @Args('username') username: string,
// //     @Args('email') email: string,
// //   ): Promise<User> {
// //     return this.userService.createUser(username, email);
// //   }

//   @Mutation(() => User)
//   async updateUser(
//     @Args('id') id: string,
//     @Args('username') username: string,
//     @Args('email') email: string,
//   ): Promise<User> {
//     return this.userService.updateUser(id, username, email);
//   }

//   @Mutation(() => Boolean)
//   async deleteUser(@Args('id') id: string): Promise<boolean> {
//     return this.userService.deleteUser(id);
//   }
// }
