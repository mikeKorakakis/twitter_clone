import { ObjectType } from "@nestjs/graphql";
import { PaginatedResult } from "../../common/dtos/paginated-result.dto";
import { Post } from "../entities/post.entity";

@ObjectType()
export class PaginatedPosts extends PaginatedResult(Post){}