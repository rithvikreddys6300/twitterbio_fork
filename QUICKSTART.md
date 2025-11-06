# Quick Start Guide - Stripe Integration

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Setup Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` and add your keys:

**Minimum Required:**
```env
# Together AI (existing)
TOGETHER_API_KEY=your_together_api_key

# Database (use any PostgreSQL database)
DATABASE_URL=postgresql://user:password@localhost:5432/twitterbio

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_this_command_to_generate: openssl rand -base64 32

# At least ONE OAuth provider (Google OR GitHub)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (setup after step 4)
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

### 4. Setup Stripe Webhook (Local Testing)

Install Stripe CLI: https://stripe.com/docs/stripe-cli

```bash
# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret from the output and add it to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

## 🧪 Test the Integration

### Test Flow:
1. Click "Sign In" → Authenticate with Google/GitHub
2. You'll receive 5 free credits
3. Generate a bio (costs 1 credit)
4. Go to `/pricing` to purchase more credits
5. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
6. Check dashboard for updated credits

### Test Cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## 📚 What Was Added

### New Pages:
- `/pricing` - Credit packs and subscription plans
- `/dashboard` - User dashboard with credits and usage
- `/auth/signin` - Authentication page

### New API Routes:
- `/api/auth/[...nextauth]` - Authentication
- `/api/stripe/checkout` - Create payment sessions
- `/api/stripe/webhook` - Handle Stripe events
- `/api/stripe/portal` - Customer portal
- `/api/credits/balance` - Get credit balance
- `/api/credits/usage` - Track usage

### Modified:
- `/api/together` - Now requires authentication and checks credits
- Header - Shows credit balance and auth buttons
- Home page - Better error handling for auth/credits

### Database Tables:
- `User` - User accounts with credit balance
- `Subscription` - Active subscriptions
- `Transaction` - Purchase history
- `CreditUsage` - Generation history
- `Account`, `Session`, `VerificationToken` - NextAuth tables

## 🔧 Configuration

### Customize Pricing
Edit `lib/stripe.ts`:
```typescript
export const STRIPE_PLANS = {
  CREDITS_10: {
    credits: 10,
    price: 499, // $4.99 in cents
    // ...
  },
  // Add more plans...
};
```

### Adjust Credit Costs
Edit `app/api/together/route.ts`:
```typescript
const creditsRequired = 1; // Change this value
```

### Free Credits for New Users
Edit `prisma/schema.prisma`:
```prisma
model User {
  credits Int @default(5) // Change default value
  // ...
}
```

## 🐛 Troubleshooting

### "Missing environment variable"
- Check `.env` file exists and has all required variables
- Restart dev server after changing `.env`

### "Database connection failed"
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Try: `npx prisma migrate reset` (development only)

### "Webhook signature verification failed"
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Copy the webhook secret to `.env`
- Restart dev server

### "OAuth error"
- Verify redirect URIs in OAuth provider settings
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

## 📖 Full Documentation

- **Setup Guide**: See `STRIPE_SETUP.md` for detailed setup instructions
- **Features**: See `STRIPE_FEATURES.md` for complete feature list
- **Stripe Docs**: https://stripe.com/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Prisma Docs**: https://www.prisma.io/docs

## 🚢 Production Deployment

1. Setup production database
2. Run migrations: `npx prisma migrate deploy`
3. Update environment variables with production values
4. Use live Stripe keys (not test keys)
5. Setup production webhook in Stripe Dashboard
6. Deploy to Vercel/your hosting platform

## 💡 Tips

- Start with test mode to avoid real charges
- Use Stripe Dashboard to monitor all activity
- Check webhook logs if events aren't processing
- Use Prisma Studio to inspect database: `npx prisma studio`
- Test all flows before going live

## 🎉 You're Ready!

Your Twitter bio generator now has:
- ✅ User authentication
- ✅ Credit system
- ✅ Stripe payments
- ✅ Subscription management
- ✅ Usage tracking
- ✅ Customer dashboard

Happy coding! 🚀
