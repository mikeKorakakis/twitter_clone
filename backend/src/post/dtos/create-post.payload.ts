import { AuthenticationError } from '@nestjs/apollo';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../common/entities';
import { PostError } from '../../common/errors/postError';
import { Post } from '../entities/post.entity';

@ObjectType()
export class CreatePostPayload {
  @Field((type) => Post, { nullable: true })
  post?: Post;

  @Field((type) => Boolean, { nullable: true })
  success: Boolean;

  @Field((type) => PostError, { nullable: true })
  error?: PostError;

  constructor({ success, error, post }: { success: Boolean; error?: PostError; post?: Post }) {
    this.success = success;
    this.error = error;
    this.post = post;
  }
}
