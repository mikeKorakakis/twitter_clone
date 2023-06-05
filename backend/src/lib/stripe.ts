import Stripe from "stripe"


// const apiKey = process.env.STRIPE_API_KEY;

// if (!apiKey) {
//     throw new Error('The STRIPE_API_KEY environment variable is not set!');
// }

export const stripe = (apiKey: string) => new Stripe(apiKey || "", {
  apiVersion: "2022-11-15",
  typescript: true,
})
