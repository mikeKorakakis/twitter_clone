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
  Headers
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

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('account/confirm')
  async stripeCreate(
    @Headers('Stripe-Signature') signature: string,
    @Body() bodyReq: any,
  ) {
    // const body = await req.text();
    // const signature = headers().get('Stripe-Signature') as string;
   const body = await bodyReq.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
    } catch (error) {
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
      // Retrieve the subscription details from Stripe.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      // Update the user stripe into in our database.
      // Since this is the initial subscription, we need to update
      // the subscription id and customer id.
      await db.user.update({
        where: {
          id: session?.metadata?.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
    }

    if (event.type === 'invoice.payment_succeeded') {
      // Retrieve the subscription details from Stripe.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      // Update the price id and set the new period end.
      await db.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
    }

    return new Response(null, { status: 200 });
  }
}
