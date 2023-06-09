import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from '../../common/dtos/list-query-options';

@ArgsType()
export class UserPostsArgs extends PaginationArgs {}