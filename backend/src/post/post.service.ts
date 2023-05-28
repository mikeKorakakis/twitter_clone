import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dtos/create-post.input';
import { UpdatePostInput } from './dtos/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../common/entities';

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
      author: author,
    });
    console.log('post',post);
    this.postRepository.save(post);
    return post;
  }

  findAll({userId}: {userId: string}) {
    return this.postRepository.find({ where: { author: { id: userId} } });
  }

  findOne(id: string) {
    return this.postRepository.findOne({ where: { id: id } });
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
