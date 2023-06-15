import { ObjectType } from '@nestjs/graphql';
import { PaginatedResult } from '../../common/dtos/paginated-result.dto';
import { Tweet } from '../entities/tweet.entity';

@ObjectType()
export class PaginatedTweets extends PaginatedResult(Tweet) {}
