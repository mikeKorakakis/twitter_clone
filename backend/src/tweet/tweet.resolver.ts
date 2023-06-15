import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Tweet } from './entities/tweet.entity';
import { TweetService } from './tweet.service';
import { JwtAuthGuard } from '../common/guards';
import { UseGuards } from '@nestjs/common';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PaginatedTweets } from './dtos/all-tweets.payload';
import { CurrentUser } from '../common/decorators';
import { CreateTweetInput } from './dtos/create-tweet.input';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedTweets, { name: 'tweets' })
  findAll(@CurrentUser() user, @Args('args') pageOptions: PageOptionsDto) {
    return this.tweetService.findAllPaginated({
      userId: user?.id,
      pageOptions,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedTweets, { name: 'userTweets' })
  findUserTweets(
    @CurrentUser() user,
    @Args('args') pageOptions: PageOptionsDto,
  ) 
  {
    return this.tweetService.findUserTweetsPaginated({
      userId: user?.id,
      pageOptions,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Tweet)
  createTweet(@CurrentUser() user, @Args('tweet') tweet: CreateTweetInput) {
    const tweetPayload = this.tweetService.createTweet(tweet, user);
    pubSub.publish('newTweet', { newTweet: tweetPayload });
    return tweetPayload;
  }

  @Subscription(() => Tweet)
  newTweet() {
    return pubSub.asyncIterator('newTweet');
  }
}
