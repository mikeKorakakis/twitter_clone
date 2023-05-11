import {
  Resolver,
  Mutation,
  Args,
  GraphQLExecutionContext,
  Query,
} from '@nestjs/graphql';
import { AuthService, IUser } from './auth.service';
// import { SignupDto } from './dtos/signup.dto';
// import { SigninDto } from './dtos/signin.dto';
// const { serialize } = require('cookie-session');
import { Context } from '@nestjs/graphql';

import { Request, Response } from 'express';
import { Res, Session, UseGuards } from '@nestjs/common';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthPayload } from './dtos/auth-payload.dto';
// import { RefreshTokenInput } from './dtos/refresh-token.input';
import { CreateAccountDto, LoginDto } from '../common/dtos';
import { GraphQLString } from 'graphql';
import {
  IGraphQLAuthContext,
  IGraphQLContext,
} from '../types/context.inteface';
import { User } from '../common/entities';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards';
import { RefreshTokenDto } from '../common/dtos/refresh-token.dto';

export const GqlSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext();
    return gqlContext.req;
  },
);

// export const GqlExecutionContext = createParamDecorator(
//     (_data: unknown, context: ExecutionContext) => {
//       const ctx = GqlExecutionContext.create(context);
//       return ctx.getContext();
//     },
//   );

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('input') signupDto: CreateAccountDto,
    @Context() context: IGraphQLContext,
  ): Promise<AuthPayload> {
    return this.authService.register(signupDto, context.req);
  }

  @Query((returns) => String)
  async hello() {
    return 'true';
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('input') loginDto: LoginDto,
    @Context() context: IGraphQLContext,
  ): Promise<AuthPayload> {
    return await this.authService.login(loginDto, context.req);
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: IGraphQLContext): Promise<boolean> {
    await this.authService.logout(context.req);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @SkipThrottle(true)
  @Query((returns) => User)
  async me(@Context() ctx: IGraphQLAuthContext): Promise<User> {
    return (await this.authService.getProfile(ctx.req)).user;
  }

  @Mutation(() => AuthPayload)
  async refreshToken(
    @Args('input') input: RefreshTokenDto,
    @Context() ctx: IGraphQLAuthContext,
  ): Promise<AuthPayload> {
    return await this.authService.refreshTokens(input.refreshToken, ctx.req);
  }
  // @Mutation(() => AuthPayload)
  // async refreshToken(
  //   @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput
  // ): Promise<AuthPayload> {
  //   return await this.authService.refreshToken(refreshTokenInput.refresh_token);
  // }
}
