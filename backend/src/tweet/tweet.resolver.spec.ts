import { Test, TestingModule } from '@nestjs/testing';
import { TweetResolver } from './tweet.resolver';

describe('TweetResolver', () => {
  let resolver: TweetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetResolver],
    }).compile();

    resolver = module.get<TweetResolver>(TweetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
