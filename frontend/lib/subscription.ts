// @ts-nocheck2
// TODO: Fix this when we turn strict mode on.\
// 'use client'
import { UserSubscriptionPlan } from "types";
import { freePlan, proPlan } from "@/config/subscriptions";
import { graphql } from "@/gql";
import {
	GetStripeInfoDocument,
	GetStripeInfoQuery,
	GetStripeInfoQueryVariables,
} from "@/gql/graphql";
import { gqlClient } from "./gql_client_server";

export async function getUserSubscriptionPlan(): Promise<UserSubscriptionPlan> {
	const client = await gqlClient();

	const res = await client.request<
		GetStripeInfoQuery,
		GetStripeInfoQueryVariables
	>(GetStripeInfoDocument);
	// const user = await db.user.findFirst({
	// 	where: {
	// 		id: userId,
	// 	},
	// 	select: {
	// 		stripeSubscriptionId: true,
	// 		stripeCurrentPeriodEnd: true,
	// 		stripeCustomerId: true,
	// 		stripePriceId: true,
	// 	},
	// });

    const user = res.getStripeInfo;

	if (!user) {
		throw new Error("User not found");
	}

	// Check if user is on a pro plan.
	const isPro =
		!!user.stripePriceId &&
		user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now();

	const plan = isPro ? proPlan : freePlan;

	return {
		...plan,
		...user,
		stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
		isPro,
	};
}
