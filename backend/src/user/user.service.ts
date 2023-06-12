import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { User } from '../common/entities';
import { AccountStatus, PostgresErrorCode } from '../common/enums';
import { UniqueViolation } from '../common/exceptions';
import { ILike, Repository } from 'typeorm';
import { StripeInfoPayload } from '../post/dtos/stripe-info.payload';
import { stripe } from '../lib/stripe';
import { absoluteUrl } from '../lib/utils';
import { freePlan, proPlan } from '../config/subscriptions';
import { UpdateUserDto } from '../common/dtos';
import { UpdateUserPayload } from './dtos/update-user.payload';
import { UserError, UserErrorType } from '../common/errors/userError';
import { FollowUserPayload } from './dtos/follow-user.payload';

// const billingUrl = absoluteUrl('/dashboard/billing');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findPostsByUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user.posts;
  }

  public async findOne(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  public async create(data: Partial<User>) {
    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    return user;
  }

  public async subscriptionIsCancelled(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const subscription = await stripe(
      process.env.STRIPE_API_KEY,
    ).subscriptions.retrieve(user.stripeSubscriptionId);

    return subscription.cancel_at_period_end;
  }

  public async updateProfile(id: string, user: UpdateUserDto) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { id },
      });
      foundUser.firstName = user.firstName;
      foundUser.lastName = user.lastName;
      foundUser.displayName = user.displayName;

      this.userRepository.save(foundUser);
      return new UpdateUserPayload({
        success: true,
      });
    } catch (err) {
      if (err.code == PostgresErrorCode.UniqueViolation) {
        if (err.detail.includes('email')) {
          return new UpdateUserPayload({
            success: false,
            error: new UserError({
              message: 'Email already exists',
              type: UserErrorType.EMAIL_ALREADY_EXISTS,
            }),
          });
        }

        if (err.detail.includes('nick_name' || 'nick' || 'nickName')) {
          //   throw new UniqueViolation('displayName');
          return new UpdateUserPayload({
            success: false,
            error: new UserError({
              message: 'Display Name already exists',
              type: UserErrorType.DISPLAY_NAME_ALREADY_EXISTS,
            }),
          });
        }
      }
      throw new InternalServerErrorException();
    }
  }

  public async subscribeToPremium(user: User) {
    const billingUrl = process.env.ORIGIN + '/dashboard/billing';
    const { id: userId, email } = user;
    const subscriptionPlan = await this.getStripeInfo(userId);

    const isPro =
      !!subscriptionPlan.stripePriceId &&
      new Date(subscriptionPlan.stripeCurrentPeriodEnd)?.getTime() +
        86_400_000 >
        Date.now();

    if (isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe(
        process.env.STRIPE_API_KEY,
      ).billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      console.log('stripe session', stripeSession);

      return stripeSession.url;
    }

    // const plan = isPro ? proPlan : freePlan;
    const stripeSession = await stripe(
      process.env.STRIPE_API_KEY,
    ).checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          //   price: proPlan.stripePriceId,
          price: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
          quantity: 1,
        },
      ],
      metadata: {
        // userId: session.user.id,
        userId,
      },
    });

    return stripeSession.url;
  }

  public async getStripeInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return new StripeInfoPayload({
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
      stripePriceId: user.stripePriceId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      stripeCustomerId: user.stripeCustomerId,
    });
  }

  public async update(userId: string, values: QueryDeepPartialEntity<User>) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(values)
        .where('id = :id', { id: userId })
        .execute();

      return {
        success: true,
        message: 'Profile updated',
      };
    } catch (err) {
      if (err.code == PostgresErrorCode.UniqueViolation) {
        if (err.detail.includes('email')) {
          throw new UniqueViolation('email');
        }

        if (err.detail.includes('nick_name' || 'nick' || 'nickName')) {
          throw new UniqueViolation('displayName');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  public async getUserByField(field: string, value: string | number) {
    const user = await this.userRepository.findOne({
      where: { [field]: value },
    });
    return user;
  }

  public async continueWithProvider(req: any) {
    let user: User;

    const { providerId, email } = req.user;
    user = await this.userRepository
      .createQueryBuilder()
      .where('provider_id = :providerId', { providerId })
      .orWhere('email = :email', { email })
      .getOne();

    if (user) {
      if (req.user.email === user.email && user.provider == 'local') {
        throw new BadRequestException(
          'User with email same as the social provider already exists',
        );
      }
    }

    if (!user) {
      user = this.userRepository.create({
        provider: req.user.provider,
        providerId: req.user.providerId,
        email: req.user.email,
        password: req.user.password,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        displayName: req.user.displayName,
        image: req.user.image,
        accountStatus: AccountStatus.VERIFIED,
      });

      await this.userRepository.save(user);
    }

    return user;
  }

  public async followUser(currentUserId: string, userId: string) {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });
    const userToFollow = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userToFollow) {
      return new FollowUserPayload({
        success: false,
        error: new UserError({
          message: 'User not found',
          type: UserErrorType.USER_NOT_FOUND,
        }),
      });
    }
    if (currentUser.id === userId) {
      return new FollowUserPayload({
        success: false,
        error: new UserError({
          message: 'Users Cannot follow themselves',
          type: UserErrorType.CANNOT_FOLLOW_YOUSELT,
        }),
      });
    }
    currentUser.following.push(userToFollow);
    await this.userRepository.save(currentUser);
    return new FollowUserPayload({
      success: true,
      error: null,
    });
  }

  public async unfollowUser(currentUserId: string, userId: string) {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });
    const userToUnfollow = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userToUnfollow) {
      return new FollowUserPayload({
        success: false,
        error: new UserError({
          message: 'User not found',
          type: UserErrorType.USER_NOT_FOUND,
        }),
      });
    }
    if (currentUser.id === userId) {
      return new FollowUserPayload({
        success: false,
        error: new UserError({
          message: 'Users Cannot unfollow themselves',
          type: UserErrorType.CANNOT_FOLLOW_YOUSELT,
        }),
      });
    }
    currentUser.following = currentUser.following.filter(
      (user) => user.id !== userId,
    );
    await this.userRepository.save(currentUser);
    return new FollowUserPayload({
      success: true,
      error: null,
    });
  }

  public async searchUsers(searchString: string, currentUser: User) {
    if (!searchString) {
      return [];
    }
    const users = await this.userRepository.find({
      where: [
        // { firstName: ILike(`%${searchString}%`) },
        // { lastName: ILike(`%${searchString}%`) },
        { displayName: ILike(`%${searchString}%`) },
        // { email: ILike(`%${searchString}%`) },
      ],
    });

    for (let user of users) {
      console.log(await this.isFollowing(currentUser, user));
      user.isFollowed = await this.isFollowing(currentUser, user);
    }

    return users;
  }

  async isFollowing(currentUser: User, targetUser: User): Promise<boolean> {
    if (!currentUser || !targetUser) {
      return false;
    }

    // Load followers for target user if they are not already loaded
    if (!currentUser.following) {
      currentUser = await this.userRepository.findOne({
        where: { id: currentUser.id },
        relations: ['following'],
      });
    }

    return currentUser.following.some((user) => {
      console.log(user.id, currentUser.id);
      return user.id === targetUser.id;
    });
  }
}
