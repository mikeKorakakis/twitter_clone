import { Body, Controller, Delete, Get, HttpCode, Logger, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

import { AuthRequest, AuthService } from './auth.service';
import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../common/dtos';
import { RolesGuard, VerifiedGuard, FacebookOauthGuard, GoogleOauthGuard, JwtAuthGuard } from '../common/guards';
import { Roles, CurrentUser, Verified as Status } from '../common/decorators';
import { Providers, Role, AccountStatus } from '../common/enums';
import { User } from '../common/entities';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    

    // @Post('local/register')
    // async register(
    //     @Body() credentials: CreateAccountDto,
    //     @Req() req: Request
    // ) {
    //     return this.authService.register(credentials, req)
    // }

  
    // @HttpCode(200)
    // @Post('local/login')
    // async login(
    //     @Body() credentials: LoginDto,
    //     @Req() req: Request
    // ) {
    //     return this.authService.login(credentials, req)
    // }

      
    // @Get('google')
    // @UseGuards(GoogleOauthGuard)
    // async googleAuth(@Req() _req: Request) {
    //     // Guard redirects
    // }

    
    // @Get('google/redirect')
    // @UseGuards(GoogleOauthGuard)
    // async googleAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
    //     return this.authService.socialProviderLogin(req, Providers.Google)
    // }

  
    // @Get('facebook')
    // @UseGuards(FacebookOauthGuard)
    // async facebookAuth(@Req() _req: Request) {
    //     // Guard redirects
    // }

   
    // @Get('facebook/redirect')
    // @UseGuards(FacebookOauthGuard)
    // async facebookAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
    //     return this.authService.socialProviderLogin(req, Providers.Facebook)
    // }

  
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @SkipThrottle(true)
    getProfile(@Req() req: AuthRequest) {
        return this.authService.getProfile(req)
    }



    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.ADMIN)
    // @Get('admin')
    // getAdminData() {
    //     return 'only admins should see this'
    // }

  
    // @Status(AccountStatus.PENDING)
    // @UseGuards(JwtAuthGuard, VerifiedGuard)
    // @UseGuards(JwtAuthGuard)
    @Get('account/confirm')
    confirmAccount(
        @CurrentUser() user: User,
        @Query('token') token: string
    ) {
        console.log('confirmAccount', user, token)
        return this.authService.confirmAccount(user, token)
    }

    // @Status(AccountStatus.PENDING)
    // @UseGuards(JwtAuthGuard, VerifiedGuard)
    // @Get('account/confirm-resend')
    // resendConfirmToken(
    //     @CurrentUser() user: User
    // ) {
    //     return this.authService.resendConfirmationToken(user)
    // }


    // @Patch('password/reset')
    // resetPassword(
    //     @Body('email') email: string
    // ) {
    //     return this.authService.resetPassword(email)
    // }

   
    // @Patch('password/change')
    // @Status(AccountStatus.VERIFIED)
    // @UseGuards(JwtAuthGuard, VerifiedGuard)
    // changePassword(
    //     @CurrentUser() user: User,
    //     @Body() passwordValues: PasswordValuesDto
    // ) {
    //     return this.authService.changePassword(user, passwordValues)
    // }
  
    
    // @Patch('password/new')
    // setNewPassword(
    //     @Body('newPassword') newPassword: string,
    //     @Query('token') token: string
    // ) {
    //     return this.authService.setNewPassword(newPassword, token)
    // }

}
