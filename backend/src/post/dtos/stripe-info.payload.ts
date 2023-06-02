import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StripeInfoPayload {
  @Field({
    nullable: true,
  })
  public stripeCustomerId?: string;

  @Field({
    nullable: true,
  })
  public stripeSubscriptionId?: string;

  @Field({
    nullable: true,
  })
  public stripePriceId?: string;

  @Field({
    nullable: true,
  })
  public stripeCurrentPeriodEnd?: Date;

  constructor({
    stripeCustomerId,
    stripeSubscriptionId,
    stripePriceId,
    stripeCurrentPeriodEnd,
  }: {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeCurrentPeriodEnd: Date;
  }) {
    this.stripeCustomerId = stripeCustomerId;
    this.stripeSubscriptionId = stripeSubscriptionId;
    this.stripePriceId = stripePriceId;
    this.stripeCurrentPeriodEnd = stripeCurrentPeriodEnd;
  }
}
