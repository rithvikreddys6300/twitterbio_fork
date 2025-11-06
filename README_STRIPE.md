# Stripe Integration Added! 🎉

This Twitter Bio Generator now includes a complete Stripe payment integration with credits and subscription management.

## 🆕 What's New

### Features Added:
- ✅ **User Authentication** - Sign in with Google or GitHub
- ✅ **Credit System** - Pay-per-use or subscribe for monthly credits
- ✅ **Stripe Payments** - Secure checkout for credit packs and subscriptions
- ✅ **User Dashboard** - Track credits, usage, and manage subscriptions
- ✅ **Automatic Credit Management** - Credits added automatically after purchase
- ✅ **Usage Tracking** - Complete history of all bio generations

### New Pages:
- `/pricing` - View and purchase credit packs or subscriptions
- `/dashboard` - Manage your account, credits, and subscriptions
- `/auth/signin` - Sign in with OAuth providers

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - From GitHub Settings
- `STRIPE_SECRET_KEY` - From Stripe Dashboard
- `STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe CLI or Dashboard

### 3. Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Setup Stripe Webhooks (Local Development)
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook secret to .env
```

### 5. Run the App
```bash
npm run dev
```

Visit http://localhost:3000 and sign in to get started!

## 💳 Pricing

### Credit Packs (One-time Purchase)
- **Starter**: 10 credits for $4.99
- **Pro**: 50 credits for $19.99
- **Ultimate**: 100 credits for $29.99

### Subscriptions (Monthly)
- **Basic**: 50 credits/month for $9.99
- **Pro**: 200 credits/month for $29.99
- **Premium**: 500 credits/month for $49.99

**Note:** Each bio generation costs 1 credit. New users get 5 free credits!

## 🧪 Testing

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[STRIPE_SETUP.md](STRIPE_SETUP.md)** - Detailed setup guide
- **[STRIPE_FEATURES.md](STRIPE_FEATURES.md)** - Complete feature list
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - Technical details

## 🏗️ Architecture

### Tech Stack:
- **Next.js 14** - React framework
- **NextAuth.js** - Authentication
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Stripe** - Payment processing
- **TypeScript** - Type safety

### Database Schema:
- `User` - User accounts with credit balance
- `Subscription` - Active subscriptions
- `Transaction` - Payment history
- `CreditUsage` - Usage logs
- `Account`, `Session`, `VerificationToken` - Auth tables

### API Routes:
- `/api/auth/*` - Authentication endpoints
- `/api/stripe/*` - Payment and subscription management
- `/api/credits/*` - Credit balance and usage
- `/api/together` - Bio generation (now requires auth & credits)

## 🔒 Security

- OAuth authentication with Google/GitHub
- Webhook signature verification
- Server-side session management
- Protected API routes
- Credit validation before generation
- Secure payment processing via Stripe

## 🛠️ Customization

### Change Pricing
Edit `lib/stripe.ts`:
```typescript
export const STRIPE_PLANS = {
  CREDITS_10: {
    credits: 10,
    price: 499, // $4.99 in cents
    // ...
  },
};
```

### Change Credit Cost per Generation
Edit `app/api/together/route.ts`:
```typescript
const creditsRequired = 1; // Change this
```

### Change Free Credits for New Users
Edit `prisma/schema.prisma`:
```prisma
model User {
  credits Int @default(5) // Change this
}
```

## 🚢 Production Deployment

1. Setup production PostgreSQL database
2. Run migrations: `npx prisma migrate deploy`
3. Update environment variables with production values
4. Use live Stripe keys (not test keys)
5. Setup production webhook in Stripe Dashboard
6. Deploy to Vercel or your preferred platform

## 🐛 Troubleshooting

### Common Issues:

**"Missing environment variable"**
- Ensure `.env` file exists with all required variables
- Restart dev server after changes

**"Database connection failed"**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Run `npx prisma migrate reset` (dev only)

**"Webhook verification failed"**
- Ensure Stripe CLI is running
- Copy webhook secret to `.env`
- Restart dev server

**"OAuth error"**
- Verify redirect URIs in provider settings
- Check NEXTAUTH_URL matches your domain

## 📞 Support

For issues or questions:
- Check documentation files
- Review Stripe Dashboard logs
- Inspect database with `npx prisma studio`
- Check webhook logs in Stripe CLI

## 🎯 Next Steps

1. Sign in to get 5 free credits
2. Generate some bios
3. Visit `/pricing` to see payment options
4. Test checkout with Stripe test cards
5. Check `/dashboard` to see your credits and usage
6. Customize pricing and features to your needs

## 📄 License

Same as the original project.

---

**Happy coding!** 🚀

For the original README, see the main README.md file.
