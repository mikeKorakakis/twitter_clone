import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dtos/create-post.input';
import { UpdatePostInput } from './dtos/update-post.input';
import { CurrentUser } from '../common/decorators';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards';
import { User } from '../common/entities';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user,
  ) {
    return this.postService.create(createPostInput, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(@CurrentUser() user: User) {
    // return this.postService.findAll({ id: user.id });

    return this.postService.findAll({ userId: user.id });
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }
}
