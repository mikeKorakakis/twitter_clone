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
import { UserService } from '../user/user.service';
import { ModuleRef } from '@nestjs/core';

const pubSub = new PubSub();

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private readonly tweetService: TweetService, private readonly userService: UserService) {}


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
  ) {
    return this.tweetService.findUserTweetsPaginated({
      userId: user?.id,
      pageOptions,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Tweet)
  async createTweet(
    @CurrentUser() user,
    @Args('tweet') tweet: CreateTweetInput,
  ) {
    const followers = await this.userService.getFollowers(user.id);

    const tweetPayload = await this.tweetService.createTweet(tweet, user);
    pubSub.publish('newTweet', { newTweet: tweetPayload, followers: followers.map(follower => follower.id) });
    return tweetPayload;
  }

  @Subscription(() => Tweet, {   
    filter(payload, variables, context) {
        console.log( payload.newTweet.authorId, context.user.id, payload.followers)

        return payload.newTweet.authorId === context.user.id || payload.followers.includes(context.user.id);
    },
  })
  newTweet() {

    return pubSub.asyncIterator('newTweet');
  }
}
