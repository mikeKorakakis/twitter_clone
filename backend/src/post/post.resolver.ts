import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dtos/create-post.input';
import { UpdatePostInput } from './dtos/update-post.input';
import { CurrentUser } from '../common/decorators';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards';
import { User } from '../common/entities';
import { RemovePostPayload } from './dtos/remove-post.payload';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user,
  ) {
    console.log('user in create post', user);
    return this.postService.create(createPostInput, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(@CurrentUser() user: User) {
    return this.postService.findAll({ userId: user.id });
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postService.update(updatePostInput.id, updatePostInput, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => RemovePostPayload)
  deletePost(@Args('id', { type: () => String }) id: string, @CurrentUser() user: User) {
    return this.postService.delete(id, user);
  }
}
