// tweet.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetsRepository: Repository<Tweet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllTweets(): Promise<Tweet[]> {
    return this.tweetsRepository.find();
  }

  async createTweet(content: string, authorId: string): Promise<Tweet> {
    const author = await this.usersRepository.findOne({where: {id: authorId}});

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const newTweet = this.tweetsRepository.create({
      content,
      author,
      createdAt: new Date(),
    });

    return this.tweetsRepository.save(newTweet);
  }
}
