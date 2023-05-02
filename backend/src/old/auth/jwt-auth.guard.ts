// auth/jwt-auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { GqlExecutionContext } from '@nestjs/graphql';
  import * as jwt from 'jsonwebtoken';
  import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private userService: UserService) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext();
      const request = ctx.req;
      const authorizationHeader = request.headers.authorization;
  
      if (!authorizationHeader) {
        throw new UnauthorizedException('Missing Authorization header');
      }
  
      const [bearer, token] = authorizationHeader.split(' ');
  
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid Authorization header format');
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  