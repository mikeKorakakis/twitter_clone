import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
// import { SignupDto } from './dtos/signup.dto';
// import { SigninDto } from './dtos/signin.dto';
// const { serialize } = require('cookie-session');
import { Context } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthPayload } from './dtos/auth-payload.dto';
// import { RefreshTokenInput } from './dtos/refresh-token.input';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../common/dtos';
import { ResponseMessageDto } from '../common/dtos/response-message.dto';
import { User } from '../common/entities';
import { JwtAuthGuard } from '../common/guards';
import {
  IGraphQLAuthContext,
  IGraphQLContext,
} from '../types/context.inteface';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SetNewPasswordPayload } from './dtos/set-new-password-payload.dto';
import { SetNewPasswordDto } from './dtos/set-new-password.dto';
import { ChangePasswordPayload } from './dtos/change-password-payload.dto';
import { CurrentUser } from '../common/decorators';

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
    console.log('me');
    return (await this.authService.getProfile(ctx.req)).user;
  }

  @Mutation(() => AuthPayload)
  async refreshToken(
    @Args('input') input: RefreshTokenDto,
    @Context() ctx: IGraphQLAuthContext,
  ): Promise<AuthPayload> {
    return await this.authService.refreshTokensForMutation(input.refreshToken, ctx.req);
  }

  @Mutation(() => ResetPasswordDto)
  async resetPassword(@Args('email') email: string): Promise<ResetPasswordDto> {
    return await this.authService.resetPassword(email);
  }

  @Mutation(() => SetNewPasswordPayload)
  async setNewPassword(
    @Args('input') input: SetNewPasswordDto,
  ): Promise<SetNewPasswordPayload> {
    const { token, newPassword } = input;
    return await this.authService.setNewPassword(newPassword, token);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ChangePasswordPayload)
  async changePassword(
    @CurrentUser() user,
    @Args('input') input: PasswordValuesDto,
  ): Promise<ChangePasswordPayload> {
    return await this.authService.changePassword(user, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseMessageDto)
  async resendConfirmationEmail(
    @CurrentUser() user,
  ): Promise<ResponseMessageDto> {
    return await this.authService.resendConfirmationToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResponseMessageDto)
    async confirmEmail(
        @CurrentUser() user,
        @Args('token') token: string,
        // @Context() ctx: IGraphQLAuthContext
        ): Promise<ResponseMessageDto> {
        return await this.authService.confirmAccount(user, token);
    }

  //   @Mutation(() => AuthPayload)
  //   async refreshToken(
  //     @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput
  //   ): Promise<AuthPayload> {
  //     return await this.authService.refreshToken(refreshTokenInput.refresh_token);
  //   }

  // @Patch('password/change')
  // @Status(AccountStatus.VERIFIED)
  // @UseGuards(JwtAuthGuard, VerifiedGuard)
  // changePassword(
  //     @CurrentUser() user: User,
  //     @Body() passwordValues: PasswordValuesDto
  // ) {
  //     return this.authService.changePassword(user, passwordValues)
  // }
}
