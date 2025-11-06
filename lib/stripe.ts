import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Stripe product and price configurations
export const STRIPE_PLANS = {
  // Credit Packs (One-time purchases)
  CREDITS_10: {
    credits: 10,
    price: 499, // $4.99
    name: 'Starter Pack',
    description: '10 bio generations',
  },
  CREDITS_50: {
    credits: 50,
    price: 1999, // $19.99
    name: 'Pro Pack',
    description: '50 bio generations',
  },
  CREDITS_100: {
    credits: 100,
    price: 2999, // $29.99
    name: 'Ultimate Pack',
    description: '100 bio generations',
  },
  
  // Subscription Plans (Monthly)
  BASIC: {
    credits: 50,
    price: 999, // $9.99/month
    name: 'Basic Plan',
    description: '50 bio generations per month',
    interval: 'month' as const,
  },
  PRO: {
    credits: 200,
    price: 2999, // $29.99/month
    name: 'Pro Plan',
    description: '200 bio generations per month',
    interval: 'month' as const,
  },
  PREMIUM: {
    credits: 500,
    price: 4999, // $49.99/month
    name: 'Premium Plan',
    description: '500 bio generations per month',
    interval: 'month' as const,
  },
};

export type StripePlanKey = keyof typeof STRIPE_PLANS;
