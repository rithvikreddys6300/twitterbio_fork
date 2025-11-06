# Stripe Integration Setup Guide

This guide will help you set up Stripe integration for credits and subscriptions.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. A PostgreSQL database
3. OAuth providers configured (Google/GitHub recommended)

## Step 1: Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### Required Variables:

#### Database
```
DATABASE_URL=postgresql://user:password@localhost:5432/twitterbio
```

#### NextAuth
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
```

#### OAuth Providers (at least one required)
- **Google**: Get credentials from https://console.cloud.google.com/apis/credentials
- **GitHub**: Get credentials from https://github.com/settings/developers

#### Stripe
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Get these from your Stripe Dashboard:
- Secret Key: https://dashboard.stripe.com/test/apikeys
- Webhook Secret: https://dashboard.stripe.com/test/webhooks (after creating webhook)

## Step 2: Database Setup

Initialize and migrate the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## Step 3: Stripe Configuration

### 3.1 Create Products (Optional - handled automatically)

The application will work with the predefined pricing in `lib/stripe.ts`. You can customize:

- Credit packs: 10, 50, 100 credits
- Subscriptions: Basic (50/mo), Pro (200/mo), Premium (500/mo)

### 3.2 Setup Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
   - For local testing, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3.3 Local Testing with Stripe CLI

Install Stripe CLI: https://stripe.com/docs/stripe-cli

```bash
# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test webhook (in another terminal)
stripe trigger checkout.session.completed
```

## Step 4: OAuth Setup

### Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env`

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. Create New OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env`

## Step 5: Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Step 6: Test the Integration

### Test Flow:

1. **Sign In**: Click "Sign In" and authenticate with Google/GitHub
2. **Check Credits**: New users should have 5 free credits
3. **Generate Bio**: Try generating a bio (uses 1 credit)
4. **Purchase Credits**: Go to `/pricing` and test checkout
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date and CVC
5. **Verify Purchase**: Check dashboard for updated credits
6. **Test Subscription**: Subscribe to a plan
7. **Manage Subscription**: Use "Manage Subscription" button in dashboard

### Test Cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## Production Deployment

### 1. Update Environment Variables

Replace test keys with live keys:
- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_PUBLISHABLE_KEY=pk_live_...`
- Update `NEXTAUTH_URL` to your production domain

### 2. Setup Production Webhook

Create a new webhook endpoint in Stripe Dashboard with your production URL.

### 3. Database Migration

Run migrations on production database:
```bash
npx prisma migrate deploy
```

## Pricing Configuration

Edit `lib/stripe.ts` to customize pricing:

```typescript
export const STRIPE_PLANS = {
  CREDITS_10: {
    credits: 10,
    price: 499, // $4.99 in cents
    name: 'Starter Pack',
    description: '10 bio generations',
  },
  // ... more plans
};
```

## Troubleshooting

### Webhook Issues
- Verify webhook secret is correct
- Check webhook logs in Stripe Dashboard
- Ensure endpoint is publicly accessible (use ngrok for local testing)

### Database Issues
- Verify DATABASE_URL is correct
- Check database connection
- Run `npx prisma migrate reset` to reset database (development only)

### Authentication Issues
- Verify OAuth redirect URIs match exactly
- Check NEXTAUTH_URL and NEXTAUTH_SECRET are set
- Clear browser cookies and try again

## Support

For issues or questions:
- Stripe Documentation: https://stripe.com/docs
- NextAuth Documentation: https://next-auth.js.org
- Prisma Documentation: https://www.prisma.io/docs
