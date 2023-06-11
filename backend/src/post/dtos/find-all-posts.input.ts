import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '../../common/dtos/list-query-options.dto';

@ArgsType()
export class AllPostsArgs extends PaginationArgs {}