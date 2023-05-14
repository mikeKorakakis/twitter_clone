import { RedisService } from '@liaoliaots/nestjs-redis';
import { InjectQueue } from '@nestjs/bull';
import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Queue } from 'bull';
import { createHash } from 'crypto';
import { Request } from 'express';
import { nanoid } from 'nanoid';

import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../common/dtos';
import { ResponseMessageDto } from '../common/dtos/response-message.dto';
import { User } from '../common/entities';
import { AccountStatus, PostgresErrorCode, Providers } from '../common/enums';
import {
    AuthenticationError,
    AuthenticationErrorType,
} from '../common/errors/authenticationError';
import { UserService } from '../user/user.service';

export interface AuthRequest extends Request {
  user: IUser;
}

export interface IUser extends User {
  verified?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {}

  public async register(registrationData: CreateAccountDto, req: Request) {
    try {
      const user = await this.userService.create({
        image: this.generateGravatarUrl(registrationData.email),
        provider: Providers.Local,
        ...registrationData,
      });

      await this.sendConfirmationToken(user);

      const [accessToken, refreshToken] = await this.generateTokens(user);

      await this.setTokens(req, { accessToken, refreshToken });

      return {
        user,
        accessToken,
      };
    } catch (err: any) {
      if (err.code == PostgresErrorCode.UniqueViolation) {
        if (err.detail.includes('email')) {
          return {
            error: new AuthenticationError({
              type: AuthenticationErrorType.EMAIL_EXISTS,
              message: 'email already exists',
            }),
          };
        }

        if (err.detail.includes('nick_name' || 'nick' || 'nickName')) {
          return {
            error: new AuthenticationError({
              type: AuthenticationErrorType.NICKNAME_EXISTS,
              message: 'nickname already exists',
            }),
          };
        }
      }
      throw new InternalServerErrorException();
    }
  }

  public async login(credentials: LoginDto, req: Request) {
    try {
      const { email, password } = credentials;

      const user = await this.getAuthenticatedUser(email, password);

      if ('error' in user) {
        return user;
      } else {
        const [accessToken, refreshToken] = await this.generateTokens(user);
        await this.setTokens(req, { accessToken, refreshToken });

        return {
          user,
          accessToken,
        };
      }
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  public async logout(req: Request) {
    if (req.cookies && req.cookies['refresh_token']) {
      const refreshTokenCookie = req.cookies['refresh_token'];
      const verifiedRefresh = await this.jwtService.verifyAsync(
        refreshTokenCookie,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        },
      );
      await this.redisService
        .getClient()
        .del(`refresh-token:${verifiedRefresh.id}:${verifiedRefresh.jti}`);
    }
    req.res.clearCookie('access_token');
    req.res.clearCookie('refresh_token');
  }

  private async generateTokens(user: User) {
    // const jwtid = "asdfdsfsfdfdfdf"
    const jwtid = nanoid();

    const accessToken = await this.jwtService.signAsync(
      {
        displayName: user.displayName,
        id: user.id,
      },
      {
        issuer: 'PoProstuWitold',
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        displayName: user.displayName,
        id: user.id,
      },
      {
        jwtid,
        issuer: 'PoProstuWitold',
        secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      },
    );

    await this.redisService
      .getClient()
      .set(
        `refresh-token:${user.id}:${jwtid}`,
        user.id,
        'EX',
        60 * 60 * 24 * 30,
      );

    return [accessToken, refreshToken];
  }

  private async setTokens(
    req: Request,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken?: string },
  ) {
    req.res.cookie('access_token', accessToken, {
      maxAge: 1000 * 60 * 60 * 1,
      httpOnly: true,
      sameSite: 'lax',
    });

    if (refreshToken) {
      req.res.cookie('refresh_token', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: true,
      });
    }
  }

  private generateGravatarUrl(email: string) {
    const hash = createHash('md5').update(email).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}`;
  }

  public async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserByField('email', email);
      if (!user) {
        return {
          error: new AuthenticationError({
            type: AuthenticationErrorType.INVALID_CREDENTIALS,
            message: 'Invalid credentials',
          }),
        };
      }

      if (user.provider !== Providers.Local) {
        return {
          error: new AuthenticationError({
            type: AuthenticationErrorType.REGISTERED_WITH_SOCIAL,
            message: 'Registered with social provider',
          }),
        };
      }

      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return {
          error: new AuthenticationError({
            type: AuthenticationErrorType.INVALID_CREDENTIALS,
            message: 'Invalid credentials',
          }),
        };
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  public async socialProviderLogin(req: AuthRequest, provider: Providers) {
    try {
      if (provider === Providers.Google) {
        if (!req.user.verified) {
          throw new BadRequestException('This Google account is not verified');
        }
      }
      const user = await this.userService.continueWithProvider(req);
      const [accessToken, refreshToken] = await this.generateTokens(user);
      await this.setTokens(req, { accessToken, refreshToken });

      // req.res.redirect('/api/v1/auth/me')
      req.res.redirect(`${process.env.ORIGIN}/me`);

      return {
        user,
        accessToken,
      };
    } catch (err) {
      req.res.redirect(
        `${process.env.ORIGIN}/login/error?message=${err.response.message}`,
      );
    }
  }

  private async sendConfirmationToken(user: User) {
    const token = nanoid();
    // const token = "asdfdsfsfdfdfdf"

    await this.redisService
      .getClient()
      .set(`confirm-account:${token}`, user.id, 'EX', 60 * 60 * 1); // 1 hour until expires

    await this.mailQueue.add('confirm', { user, token });
  }

  private async sendResetToken(user: User) {
    const token = nanoid();
    // const token = "asdfdsfsfdfdfdf"

    await this.redisService
      .getClient()
      .set(`reset-password:${token}`, user.id, 'EX', 60 * 60 * 1); // 1 hour until expires

    await this.mailQueue.add('reset', { user, token });
  }

  public async confirmAccount(user: User, token: string) {
    const accountId = await this.redisService
      .getClient()
      .get(`confirm-account:${token}`);
    if (!accountId) {
      return {
        success: false,
        message: 'Confirmation token expired',
      };
    } else {
      if (
        accountId === user.id &&
        user.accountStatus === AccountStatus.VERIFIED
      ) {
        return {
          success: true,
          message: 'Account already verified',
        };
      }
    }
    if (user.id === accountId) {
      await this.userService.update(user.id, {
        accountStatus: AccountStatus.VERIFIED,
      });

      await this.redisService.getClient().del(`confirm-account:${token}`);
    }
    return {
      success: true,
      message: 'Account verified successfully',
    };
  }

  public async resendConfirmationToken(user: any) {
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    if (user.accountStatus === AccountStatus.VERIFIED) {
      return {
        success: false,
        message: 'Account already verified',
      };
    }

    this.sendConfirmationToken(user);

    return {
      success: true,
      message: 'Confirmation token resend. Check your email',
    };
  }

  public async resetPassword(email: string) {
    const user = await this.userService.getUserByField('email', email);

    if (user) {
      if (user.provider === Providers.Local) {
        this.sendResetToken(user);
      }
    }

    return {
      success: true,
      message:
        "If the account exists and it isn't registered with social provider, an email with a password reset link has been sent to",
      email,
    };
  }

  public async changePassword(user: User, password: PasswordValuesDto) {
    if (user.provider !== Providers.Local) {
      //   throw new BadRequestException(
      //     `You can't change password while using social provider`,
      //   );
      return {
        error: new AuthenticationError({
          type: AuthenticationErrorType.REGISTERED_WITH_SOCIAL,
          message: `You can't change password while using social provider`,
        }),
      };
    }

    const authUser = await this.getAuthenticatedUser(
      user.email,
      password.oldPassword,
    );

    if (password.newPassword === password.oldPassword) {
      //   throw new BadRequestException(`New password cannot be same as old`);
      return {
        error: new AuthenticationError({
          type: AuthenticationErrorType.INVALID_CREDENTIALS,
          message: `New password cannot be same as old`,
        }),
      };
    }

    if ('error' in authUser) {
      return authUser;
    } else {
      this.userService.update(user.id, {
        password: await argon2.hash(password.newPassword),
      });
      return new ResponseMessageDto({
        success: true,
        message: 'Password changed',
      });
    }
  }

  public async setNewPassword(newPassword: string, token: string) {
    const accountId = await this.redisService
      .getClient()
      .get(`reset-password:${token}`);

    const user = await this.userService.getUserByField('id', accountId);
    await this.userService.update(user.id, {
      password: await argon2.hash(newPassword),
    });

    if (!accountId) {
      return {
        error: new AuthenticationError({
          message: 'Reset password token expired',
          type: AuthenticationErrorType.TOKEN_EXPIRED,
        }),
      };
      //   throw new BadRequestException('Reset password token expired');
    }

    await this.redisService.getClient().del(`reset-password:${token}`);
    return new ResponseMessageDto({
      success: true,
      message: 'Password reseted',
    });
  }

  public async refreshTokens(refreshTokenCookie: string, req: Request) {
    // const refreshTokenCookie = req.cookies['refresh_token'];
    if (!refreshTokenCookie) {
      throw new UnauthorizedException('Invalid cookie');
    }

    const verifiedJWt = await this.jwtService.verifyAsync(refreshTokenCookie, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
    });

    if (!verifiedJWt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenRedis = await this.redisService
      .getClient()
      .get(`refresh-token:${verifiedJWt.id}:${verifiedJWt.jti}`);

    if (!refreshTokenRedis) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        displayName: verifiedJWt.displayName,
        id: verifiedJWt.id,
      },
      {
        issuer: 'PoProstuWitold',
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
      },
    );

    await this.setTokens(req, { accessToken });
    const user = await this.userService.getUserByField('id', verifiedJWt.id);
    return { user, accessToken };
  }

  public async getUserFromAccessToken(token: string) {
    const verifiedJWt = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
    });

    if (!verifiedJWt) {
      return undefined;
    }

    return this.userService.getUserByField('id', verifiedJWt.id);
  }

  public async getProfile(req: AuthRequest) {
    return {
      user: req.user,
    };
  }
}
