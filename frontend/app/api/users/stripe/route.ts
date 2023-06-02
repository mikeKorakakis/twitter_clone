import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { proPlan } from "@/config/subscriptions";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";

const billingUrl = absoluteUrl("/dashboard/billing");

export async function GET(req: Request) {
	try {
		// const session = await getServerSession(authOptions)

		// if (!session?.user || !session?.user.email) {
		//   return new Response(null, { status: 403 })
		// }

		const subscriptionPlan = await getUserSubscriptionPlan();

		console.log("subscriptionPlan", subscriptionPlan);
		// The user is on the pro plan.
		// Create a portal session to manage subscription.
		if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: subscriptionPlan.stripeCustomerId,
				return_url: billingUrl,
			});

			console.log("stripe session", stripeSession);

			return new Response(JSON.stringify({ url: stripeSession.url }));
		}

		// The user is on the free plan.
		// Create a checkout session to upgrade.
		try {
			const stripeSession = await stripe.checkout.sessions.create({
				success_url: billingUrl,
				cancel_url: billingUrl,
				payment_method_types: ["card"],
				mode: "subscription",
				billing_address_collection: "auto",
				customer_email: "mike@test.com",
				//   customer_email: session.user.email,
				line_items: [
					{
						price: proPlan.stripePriceId,
						quantity: 1,
					},
				],
				metadata: {
					// userId: session.user.id,
					userId: "52956c66-4959-47fc-a6e8-aac1acffbdc9",
				},
			});

			console.log("sripe", stripeSession);

			return new Response(JSON.stringify({ url: stripeSession.url }));
		} catch (error) {
			console.log("error", error);
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(JSON.stringify(error.issues), { status: 422 });
		}

		return new Response(null, { status: 500 });
	}
}
