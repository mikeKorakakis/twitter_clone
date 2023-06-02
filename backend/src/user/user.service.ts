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
import { Repository } from 'typeorm';
import { StripeInfoPayload } from '../post/dtos/stripe-info.payload';
import { stripe } from '../lib/stripe';
import { absoluteUrl } from '../lib/utils';
import { freePlan, proPlan } from '../config/subscriptions';

const billingUrl = absoluteUrl('/dashboard/billing');

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

  public async subscribeToPremium(user: User) {
    const { id: userId, email } = user;
    const subscriptionPlan = await this.getStripeInfo(userId);

    const isPro =
      !!subscriptionPlan.stripePriceId &&
      subscriptionPlan.stripeCurrentPeriodEnd?.getTime() + 86_400_000 >
        Date.now();

    // const plan = isPro ? proPlan : freePlan;
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        // userId: session.user.id,
        userId,
      },
    });

    return stripeSession

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
    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(values)
      .where('id = :id', { id: userId })
      .execute();
  }

  public async updateProfile(
    userId: string,
    values: QueryDeepPartialEntity<User>,
  ) {
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
}
