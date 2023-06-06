import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from './dtos/create-post.input';
import { UpdatePostInput } from './dtos/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../common/entities';
import { PostError, PostErrorType } from '../common/errors/postError';
import { RemovePostPayload } from './dtos/remove-post.payload';
import { CreatePostPayload } from './dtos/create-post.payload';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async create(createPostInput: CreatePostInput, author: User) {
    const userPostCount = await this.findAll({ userId: author.id });

    const stripeInfo = await this.userService.getStripeInfo(author.id);

    const isPro =
      stripeInfo?.stripePriceId &&
      new Date(stripeInfo?.stripeCurrentPeriodEnd).getTime() + 86_400_000 >
        Date.now();

    if (userPostCount.length >= 3 && !isPro) {
      const postError = new PostError({
        message: 'User has reached maximum number of posts',
        type: PostErrorType.MAX_POST_REACHED,
      });

      return new CreatePostPayload({
        success: false,
        error: postError,
      });
    }
    const post = this.postRepository.create({
      title: createPostInput.title,
      content: createPostInput.content,
      published: createPostInput.published,
      authorId: author?.id,
    });
    const createdPost = await this.postRepository.save(post);
    return new CreatePostPayload({
      success: true,
      post: createdPost,
    });
    // return post;
  }

  findAll({ userId }: { userId: string }) {
    const post = this.postRepository.find({ where: { authorId: userId } });
    console.log(post);
    return this.postRepository.find({ where: { author: { id: userId } } });
  }

  findOne(id: string) {
    return this.postRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updatePostInput: UpdatePostInput, author: User) {
    const post = await this.postRepository.findOne({
      where: { id: id, author: { id: author.id } },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Update fields
    post.title = updatePostInput.title;
    post.content = updatePostInput.content;
    post.published = updatePostInput.published;

    // Save the updated post
    return this.postRepository.save(post);

    // return this.postRepository
    //   .createQueryBuilder()
    //   .update(Post)
    //   .set({
    //     title: updatePostInput.title,
    //     published: updatePostInput.published,
    //     content: () =>
    //       `jsonb_set(content, '{}', '${JSON.stringify(
    //         updatePostInput.content,
    //       )}')`,
    //   })
    //   .where('id = :id and authorId = :authorId', {
    //     id: id,
    //     authorId: author.id,
    //   })
    //   .execute();
  }

  delete(id: string, user: User) {
    const post = this.postRepository.findOne({ where: { authorId: user.id } });
    if (!post) {
      return new PostError({
        message: 'Post does not belong to user',
        type: PostErrorType.NOT_USER_POST,
      });
    }
    this.postRepository.delete({ id: id });

    return new RemovePostPayload({
      success: true,
      error: null,
    });
  }
}
