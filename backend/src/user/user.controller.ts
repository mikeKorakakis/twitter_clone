import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

import { UserService } from './user.service';
import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../common/dtos';
import {
  RolesGuard,
  VerifiedGuard,
  FacebookOauthGuard,
  GoogleOauthGuard,
  JwtAuthGuard,
} from '../common/guards';
import { Roles, CurrentUser, Verified as Status } from '../common/decorators';
import { Providers, Role, AccountStatus } from '../common/enums';
import { User } from '../common/entities';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Post('stripe-webhook')
  async stripeCreate(
    @Headers('Stripe-Signature') signature: string,
    // @Body() bodyReq: any,
    @Req() req: RawBodyRequest<Request>
  ) {
    // const body = await req.text();
    // const signature = headers().get('Stripe-Signature') as string;
    const body = req.body;
    let event: Stripe.Event;

    try {
      event = stripe(process.env.STRIPE_API_KEY).webhooks.constructEvent(
        body as any,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
    } catch (error) {
        console.log('error createing envent', error)
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const user = await this.userRepository.findOne({
        where: { id: session?.metadata?.userId },
      });
      

      if (!user) {
        return new Response('User not found', { status: 404 });
      }
      // Retrieve the subscription details from Stripe.

      const subscription = await stripe(
        process.env.STRIPE_API_KEY,
      ).subscriptions.retrieve(session.subscription as string);

      user.stripeSubscriptionId = subscription.id;
      user.stripeCustomerId = subscription.customer as string;
      user.stripePriceId = subscription.items.data[0].price.id;
      user.stripeCurrentPeriodEnd = new Date(
        subscription.current_period_end * 1000,
      );

      // Update the user stripe into in our database.
      // Since this is the initial subscription, we need to update
      // the subscription id and customer id.
      //   await db.user.update({
      //     where: {
      //       id: session?.metadata?.userId,
      //     },
      //     data: {
      //       stripeSubscriptionId: subscription.id,
      //       stripeCustomerId: subscription.customer as string,
      //       stripePriceId: subscription.items.data[0].price.id,
      //       stripeCurrentPeriodEnd: new Date(
      //         subscription.current_period_end * 1000,
      //       ),
      //     },
      //   });

      this.userRepository.save(user);
    }

    if (event.type === 'invoice.payment_succeeded') {
      // Retrieve the subscription details from Stripe.
      const subscription = await stripe(
        process.env.STRIPE_API_KEY,
      ).subscriptions.retrieve(session.subscription as string);

      console.log('subscription', subscription)
      const user = await this.userRepository.findOne({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (!user) {
        return new Response('User not found', { status: 404 });
      }

      user.stripePriceId = subscription.items.data[0].price.id;
      user.stripeCurrentPeriodEnd = new Date(
        subscription.current_period_end * 1000,
      );

      // Update the price id and set the new period end.
      //   await db.user.update({
      //     where: {
      //       stripeSubscriptionId: subscription.id,
      //     },
      //     data: {
      //       stripePriceId: subscription.items.data[0].price.id,
      //       stripeCurrentPeriodEnd: new Date(
      //         subscription.current_period_end * 1000,
      //       ),
      //     },
      //   });

      this.userRepository.save(user);
    }

    return new Response(null, { status: 200 });
  }
}
