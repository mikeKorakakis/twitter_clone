import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { Repository } from 'typeorm';
import { CreateTweetInput } from './dtos/create-tweet.input';
import { User } from '../common/entities';
import { Order, PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { PaginatedResult } from '../common/dtos/paginated-result.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly userService: UserService,
  ) {}

  async createTweet(tweet: CreateTweetInput, user: User): Promise<Tweet> {
    const newTweet = await this.tweetRepository.create({
      ...tweet,
      authorId: user?.id,
      author: user
    });
    await this.tweetRepository.save(newTweet);
    return newTweet;
  }

  async findUserTweets({ userId }: { userId: string }) {
    return this.tweetRepository.find({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
  }

   findAllTweets({ userId }: { userId: string }) {
    const tweets =  this.tweetRepository.find({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['author'],
    });
    return tweets;
  }

  async findUserTweetsPaginated({
    userId,
    pageOptions,
  }: {
    userId: string;
    pageOptions: PageOptionsDto;
  }) {
    const queryBuilder = this.tweetRepository.createQueryBuilder('tweet');
    queryBuilder.leftJoinAndSelect('tweet.author', 'author');
    queryBuilder
      .where('tweet.authorId = :userId', { userId })
      .orderBy('tweet.createdAt', 'DESC')
      .take(pageOptions.take)
      .skip((pageOptions.page - 1) * pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptions,
    });

    return new (PaginatedResult(Tweet))(entities, pageMetaDto);
  }

  async findAllPaginated({
    userId,
    pageOptions,
  }: {
    userId: string;
    pageOptions: PageOptionsDto;
  }) {
    const following = await this.userService.getFollowing(userId);
    const followingIds = following.map((user) => user.id);
    const queryBuilder = this.tweetRepository.createQueryBuilder('tweet');
    queryBuilder.leftJoinAndSelect('tweet.author', 'author');

    if (followingIds.length > 0) {
      queryBuilder.where('author.id IN (:...followingIds)', {
        followingIds: followingIds,
      });
    }

    queryBuilder
      .orWhere('author.id = :userId', { userId: userId })
      .orderBy('tweet.createdAt', Order.DESC)//pageOptions.order )
      .take(pageOptions.take)
      .skip((pageOptions.page - 1) * pageOptions.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    console.log(entities[0]);

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptions,
    });

    return new (PaginatedResult(Tweet))(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Tweet> {
    return this.tweetRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.tweetRepository.delete(id);
  }
}
