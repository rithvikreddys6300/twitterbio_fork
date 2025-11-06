# Setup Checklist ✅

Use this checklist to ensure your Stripe integration is properly configured.

## 📋 Pre-Setup

- [ ] Have a Stripe account (sign up at https://stripe.com)
- [ ] Have a PostgreSQL database available
- [ ] Have Google Cloud Console access (for Google OAuth)
- [ ] Have GitHub account (for GitHub OAuth)
- [ ] Have Stripe CLI installed (for local webhook testing)

## 🔧 Environment Setup

### Database Configuration
- [ ] PostgreSQL database created
- [ ] `DATABASE_URL` added to `.env`
- [ ] Database URL format: `postgresql://user:password@host:port/database`

### NextAuth Configuration
- [ ] `NEXTAUTH_URL` set to your app URL
  - Local: `http://localhost:3000`
  - Production: `https://yourdomain.com`
- [ ] `NEXTAUTH_SECRET` generated and added
  - Run: `openssl rand -base64 32`
  - Add output to `.env`

### OAuth Providers (At least ONE required)

#### Google OAuth
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create OAuth 2.0 Client ID
- [ ] Add authorized redirect URI:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`
- [ ] Copy Client ID to `GOOGLE_CLIENT_ID`
- [ ] Copy Client Secret to `GOOGLE_CLIENT_SECRET`

#### GitHub OAuth
- [ ] Go to https://github.com/settings/developers
- [ ] Create New OAuth App
- [ ] Set Authorization callback URL:
  - Local: `http://localhost:3000/api/auth/callback/github`
  - Production: `https://yourdomain.com/api/auth/callback/github`
- [ ] Copy Client ID to `GITHUB_CLIENT_ID`
- [ ] Copy Client Secret to `GITHUB_CLIENT_SECRET`

### Stripe Configuration
- [ ] Go to https://dashboard.stripe.com/test/apikeys
- [ ] Copy Secret Key to `STRIPE_SECRET_KEY`
- [ ] Copy Publishable Key to `STRIPE_PUBLISHABLE_KEY`
- [ ] Webhook secret configured (see Webhook Setup below)

## 🗄️ Database Setup

- [ ] Run `npx prisma generate` (generates Prisma Client)
- [ ] Run `npx prisma migrate dev --name init` (creates tables)
- [ ] Verify tables created:
  - [ ] User
  - [ ] Account
  - [ ] Session
  - [ ] VerificationToken
  - [ ] Subscription
  - [ ] Transaction
  - [ ] CreditUsage
- [ ] (Optional) Run `npx prisma studio` to view database

## 🔌 Webhook Setup

### Local Development
- [ ] Install Stripe CLI: https://stripe.com/docs/stripe-cli
- [ ] Run `stripe login` (authenticate)
- [ ] Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] Copy webhook signing secret from output
- [ ] Add to `.env` as `STRIPE_WEBHOOK_SECRET`
- [ ] Keep Stripe CLI running while testing

### Production
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Click "Add endpoint"
- [ ] Enter webhook URL: `https://yourdomain.com/api/stripe/webhook`
- [ ] Select events to listen for:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Copy webhook signing secret
- [ ] Add to production environment as `STRIPE_WEBHOOK_SECRET`

## 🚀 Application Setup

- [ ] Run `npm install` (install dependencies)
- [ ] Run `npm run build` (verify build succeeds)
- [ ] Run `npm run dev` (start development server)
- [ ] Visit http://localhost:3000 (verify app loads)

## 🧪 Testing Checklist

### Authentication Testing
- [ ] Click "Sign In" button
- [ ] Sign in with Google (if configured)
- [ ] Sign in with GitHub (if configured)
- [ ] Verify redirected to homepage after sign-in
- [ ] Verify credit balance shows in header (should be 5)
- [ ] Verify "Sign Out" button appears

### Generation Testing
- [ ] Enter bio details
- [ ] Click "Generate your bio"
- [ ] Verify bio generates successfully
- [ ] Verify credit balance decreases by 1
- [ ] Generate until credits run out
- [ ] Verify error message when no credits
- [ ] Verify redirect to pricing page

### Pricing Page Testing
- [ ] Visit `/pricing`
- [ ] Verify credit packs display correctly
- [ ] Verify subscription plans display correctly
- [ ] Toggle between "Credit Packs" and "Subscriptions"
- [ ] Verify prices display correctly

### Purchase Testing (Credit Pack)
- [ ] Click "Buy Now" on a credit pack
- [ ] Verify redirected to Stripe Checkout
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Enter any future expiry date
- [ ] Enter any 3-digit CVC
- [ ] Complete checkout
- [ ] Verify redirected to dashboard
- [ ] Verify credits added to balance
- [ ] Check Stripe CLI for webhook events
- [ ] Verify transaction in database

### Subscription Testing
- [ ] Click "Subscribe" on a subscription plan
- [ ] Complete Stripe Checkout (same test card)
- [ ] Verify redirected to dashboard
- [ ] Verify credits added to balance
- [ ] Verify subscription created in database
- [ ] Check Stripe Dashboard for subscription

### Dashboard Testing
- [ ] Visit `/dashboard`
- [ ] Verify credit balance displays
- [ ] Verify total used displays
- [ ] Verify generation count displays
- [ ] Verify usage history table shows entries
- [ ] Click "Buy More Credits" (verify redirects to pricing)
- [ ] Click "Manage Subscription" (if subscribed)
- [ ] Verify redirected to Stripe Customer Portal
- [ ] Test updating payment method
- [ ] Test canceling subscription

### Webhook Testing
- [ ] Check Stripe CLI output for webhook events
- [ ] Verify events processed successfully
- [ ] Check database for updated records
- [ ] Test subscription renewal (use Stripe CLI):
  ```bash
  stripe trigger invoice.payment_succeeded
  ```
- [ ] Verify credits added on renewal

## 🔒 Security Checklist

- [ ] `.env` file in `.gitignore`
- [ ] No secrets committed to git
- [ ] Webhook signature verification enabled
- [ ] OAuth redirect URIs match exactly
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] Using test keys for development
- [ ] Production keys stored securely

## 📊 Stripe Dashboard Verification

- [ ] Go to https://dashboard.stripe.com
- [ ] Check "Payments" for test transactions
- [ ] Check "Customers" for created customers
- [ ] Check "Subscriptions" for active subscriptions
- [ ] Check "Webhooks" for event logs
- [ ] Verify all webhooks delivered successfully
- [ ] Check for any failed events

## 🐛 Troubleshooting Checks

If something isn't working:

### Authentication Issues
- [ ] Check OAuth redirect URIs match exactly
- [ ] Verify NEXTAUTH_URL is correct
- [ ] Check NEXTAUTH_SECRET is set
- [ ] Clear browser cookies and try again
- [ ] Check browser console for errors

### Database Issues
- [ ] Verify PostgreSQL is running
- [ ] Check DATABASE_URL format
- [ ] Run `npx prisma studio` to inspect data
- [ ] Check for migration errors
- [ ] Try `npx prisma migrate reset` (dev only)

### Webhook Issues
- [ ] Verify Stripe CLI is running
- [ ] Check webhook secret matches
- [ ] Look for errors in Stripe CLI output
- [ ] Check webhook logs in Stripe Dashboard
- [ ] Verify endpoint is accessible

### Payment Issues
- [ ] Using test mode keys
- [ ] Using test card numbers
- [ ] Check Stripe Dashboard for errors
- [ ] Verify webhook events delivered
- [ ] Check database for transaction records

### Credit Issues
- [ ] Check user credits in database
- [ ] Verify credit deduction logic
- [ ] Check CreditUsage table for logs
- [ ] Verify atomic transactions working

## 🚢 Production Deployment Checklist

- [ ] All tests passing in development
- [ ] Database migrations run on production DB
- [ ] Environment variables updated with production values
- [ ] Using live Stripe keys (not test keys)
- [ ] Production webhook endpoint configured
- [ ] OAuth providers updated with production URLs
- [ ] SSL certificate installed (HTTPS)
- [ ] Domain configured correctly
- [ ] Test complete flow in production
- [ ] Monitor Stripe Dashboard for issues
- [ ] Set up error monitoring/logging
- [ ] Configure email notifications (optional)

## ✅ Final Verification

- [ ] Users can sign up and receive free credits
- [ ] Users can generate bios and credits deduct
- [ ] Users can purchase credit packs
- [ ] Users can subscribe to plans
- [ ] Subscriptions renew automatically
- [ ] Credits added on subscription renewal
- [ ] Users can manage subscriptions
- [ ] Dashboard shows accurate data
- [ ] Webhooks process successfully
- [ ] No errors in console or logs
- [ ] Build completes without errors
- [ ] TypeScript compilation succeeds

## 📝 Documentation Review

- [ ] Read `QUICKSTART.md`
- [ ] Read `STRIPE_SETUP.md`
- [ ] Read `STRIPE_FEATURES.md`
- [ ] Read `INTEGRATION_SUMMARY.md`
- [ ] Read `SYSTEM_FLOW.md`
- [ ] Understand pricing configuration
- [ ] Know how to customize features

## 🎉 Ready to Launch!

Once all items are checked:
- [ ] Application is fully configured
- [ ] All features tested and working
- [ ] Documentation reviewed
- [ ] Ready for production deployment

---

**Congratulations!** Your Stripe integration is complete and ready to use! 🚀

For support, refer to the documentation files or check:
- Stripe Docs: https://stripe.com/docs
- NextAuth Docs: https://next-auth.js.org
- Prisma Docs: https://www.prisma.io/docs
