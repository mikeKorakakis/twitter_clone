import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }

  handleRequest(err, user, info, context) {
    const req = this.getRequest(context);
    const refreshToken = req.cookies['refresh_token'];
    // console.log('refreshToken', req.cookies);

    if (info && refreshToken) {
      if (
        info instanceof TokenExpiredError &&
        req.cookies['refresh_token']
      ) {
        return this.authService.refreshTokens(refreshToken,req);
      }
      if (
        info instanceof Error &&
        info.message === 'No auth token' &&
        req.cookies['refresh_token'] &&
        !req.cookies['access_token']
      ) {
        return this.authService.refreshTokens(refreshToken, req);
      }
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log('user', user);
    return user;
  }
}
