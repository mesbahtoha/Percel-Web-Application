import Stripe from "stripe";
import { env } from "./env.js";

if (!env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is missing");
  process.exit(1);
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
