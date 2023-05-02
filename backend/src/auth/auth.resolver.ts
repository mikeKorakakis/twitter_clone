import { Resolver, Mutation, Args,  GraphQLExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
// const { serialize } = require('cookie-session');
import { Context } from '@nestjs/graphql';


import { Request, Response } from 'express';
import { Res, Session } from '@nestjs/common';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthPayload } from './dtos/auth-payload.dto';
import { RefreshTokenInput } from './dtos/refresh-token.input';
import { CreateAccountDto } from '../common/dtos';

export const GqlSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext();
    return gqlContext.req.session;
  }
);
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async register(@Args('input') signupDto: CreateAccountDto): Promise<string> {
    return this.authService.register(signupDto);
  }

  @Mutation(() => AuthPayload)
  async signin(@Args('input') signinDto: SigninDto): Promise<AuthPayload> {
    const jwt = await this.authService.signin(signinDto);
    return jwt;
  }

  @Mutation(() => AuthPayload)
  async refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput
  ): Promise<AuthPayload> {
    return await this.authService.refreshToken(refreshTokenInput.refresh_token);
  }
}
