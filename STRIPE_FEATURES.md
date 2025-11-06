# Stripe Integration Features

## Overview

This application now includes a complete Stripe integration for managing credits and subscriptions. Users can purchase credits or subscribe to monthly plans to generate Twitter bios.

## Features

### 1. **Authentication System**
- NextAuth.js integration with multiple providers
- Google OAuth
- GitHub OAuth
- Email authentication (optional)
- Session management with database storage

### 2. **Credit System**
- Each bio generation costs 1 credit
- New users receive 5 free credits
- Credits never expire
- Real-time credit balance display in header
- Credit usage tracking and history

### 3. **Payment Options**

#### One-Time Credit Packs
- **Starter Pack**: 10 credits for $4.99
- **Pro Pack**: 50 credits for $19.99 (Best Value)
- **Ultimate Pack**: 100 credits for $29.99

#### Monthly Subscriptions
- **Basic Plan**: 50 credits/month for $9.99
- **Pro Plan**: 200 credits/month for $29.99 (Most Popular)
- **Premium Plan**: 500 credits/month for $49.99

### 4. **User Dashboard**
- View available credits
- Track total credits used
- View generation history
- Manage subscriptions
- Access Stripe Customer Portal

### 5. **Stripe Integration**
- Secure checkout with Stripe Checkout
- Webhook handling for real-time updates
- Automatic credit allocation
- Subscription management
- Customer portal for self-service

### 6. **API Endpoints**

#### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

#### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/portal` - Access customer portal

#### Credits
- `GET /api/credits/balance` - Get user credit balance
- `GET /api/credits/usage` - Get usage history
- `POST /api/credits/usage` - Track credit usage

#### Generation
- `POST /api/together` - Generate bio (requires authentication & credits)

## Database Schema

### User
- Stores user information
- Tracks credit balance
- Links to Stripe customer

### Subscription
- Manages active subscriptions
- Tracks billing periods
- Handles subscription status

### Transaction
- Records all purchases
- Tracks credit additions
- Links to Stripe payment intents

### CreditUsage
- Logs every credit usage
- Tracks generation history
- Stores metadata for analytics

## User Flow

### New User
1. Visit homepage
2. Click "Sign In"
3. Authenticate with Google/GitHub
4. Receive 5 free credits
5. Generate bios

### Purchasing Credits
1. Click "Pricing" in header
2. Choose credit pack or subscription
3. Complete Stripe checkout
4. Credits added automatically
5. Return to dashboard

### Generating Bios
1. Enter job/hobby information
2. Select vibe (Professional/Casual/Funny)
3. Click "Generate your bio"
4. 1 credit deducted automatically
5. View and copy generated bios

### Managing Subscription
1. Go to Dashboard
2. Click "Manage Subscription"
3. Access Stripe Customer Portal
4. Update payment method
5. Cancel or change plan

## Security Features

- Secure authentication with NextAuth.js
- Database session storage
- Stripe webhook signature verification
- Server-side credit validation
- Protected API routes
- CSRF protection

## Customization

### Pricing
Edit `lib/stripe.ts` to modify:
- Credit pack sizes and prices
- Subscription tiers and features
- Credit costs per generation

### Branding
- Update pricing page copy
- Customize email templates
- Modify dashboard layout
- Change color schemes

### Features
- Add more generation types
- Implement team accounts
- Add referral system
- Create usage analytics

## Testing

### Test Mode
- Use Stripe test keys
- Test cards available
- Webhook testing with Stripe CLI
- No real charges

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## Monitoring

### Stripe Dashboard
- View all transactions
- Monitor subscriptions
- Check webhook logs
- Analyze revenue

### Application Logs
- Credit usage patterns
- Generation statistics
- Error tracking
- User activity

## Future Enhancements

Potential features to add:
- Team/organization accounts
- Bulk generation discounts
- Referral program
- Usage analytics dashboard
- API access for developers
- White-label options
- Custom AI model selection
- Export generation history
- Email notifications
- Mobile app integration

## Support

For setup instructions, see `STRIPE_SETUP.md`
