// tweets.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Tweet } from './tweet.entity';
import { TweetService } from './tweet.service';

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private tweetService: TweetService) {}

  @Query(() => [Tweet])
  async tweets(): Promise<Tweet[]> {
    return this.tweetService.getAllTweets();
  }

  @Mutation(() => Tweet)
  async createTweet(
    @Args('content') content: string,
    @Args('authorId') authorId: string,
  ): Promise<Tweet> {
    return this.tweetService.createTweet(content, authorId);
  }
}
