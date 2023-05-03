import { Request } from 'express';

export interface IGraphQLContext {
  req: Request;
}