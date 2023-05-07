import { Request } from 'express';
import { AuthRequest } from '../auth/auth.service';

export interface IGraphQLContext {
  req: Request;
}

export interface IGraphQLAuthContext {
    req: AuthRequest;
  }