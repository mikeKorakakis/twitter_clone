import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dtos/create-post.input';
import { UpdatePostInput } from './dtos/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../common/entities';
import { PostError, PostErrorType } from '../common/errors/postError';
import { RemovePostPayload } from './dtos/remove-post.payload';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(createPostInput: CreatePostInput, author: User) {
    const post = this.postRepository.create({
      title: createPostInput.title,
      content: createPostInput.content,
      published: createPostInput.published,
      authorId: author?.id,
    });
    return this.postRepository.save(post);

    // return post;
  }

  findAll({ userId }: { userId: string }) {
    return this.postRepository.find({ where: { author: { id: userId } } });
  }

  findOne(id: string) {
    return this.postRepository.findOne({ where: { id: id } });
  }

  update(id: string, updatePostInput: UpdatePostInput, author: User) {
    return this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({
        title: updatePostInput.title,
        published: updatePostInput.published,
        content: () =>
          `jsonb_set(content, '{}', '${JSON.stringify(
            updatePostInput.content,
          )}')`,
      })
      .where('id = :id and authorId = :authorId', {
        id: id,
        authorId: author.id,
      })
      .execute();
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
        error: null
    })
  }
}
