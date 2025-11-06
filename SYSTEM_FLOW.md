# System Flow Diagram

## 🔄 User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEW USER FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. Visit Homepage
   │
   ├─→ Click "Sign In"
   │   │
   │   ├─→ Choose OAuth Provider (Google/GitHub)
   │   │   │
   │   │   └─→ Authenticate with Provider
   │   │       │
   │   │       └─→ NextAuth creates User in DB
   │   │           │
   │   │           └─→ User receives 5 free credits
   │   │               │
   │   │               └─→ Redirected to Homepage
   │   │
   │   └─→ See Credit Balance in Header
   │
   └─→ Generate Bio (costs 1 credit)
       │
       ├─→ If credits available:
       │   │
       │   ├─→ Deduct 1 credit
       │   ├─→ Log usage to CreditUsage table
       │   └─→ Generate bio with Together AI
       │
       └─→ If no credits:
           │
           └─→ Show error → Redirect to /pricing


┌─────────────────────────────────────────────────────────────────┐
│                      PURCHASE FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. Visit /pricing
   │
   ├─→ Choose Credit Pack (One-time)
   │   │
   │   ├─→ Click "Buy Now"
   │   │   │
   │   │   ├─→ POST /api/stripe/checkout
   │   │   │   │
   │   │   │   ├─→ Create/Get Stripe Customer
   │   │   │   ├─→ Create Checkout Session
   │   │   │   └─→ Return checkout URL
   │   │   │
   │   │   ├─→ Redirect to Stripe Checkout
   │   │   │   │
   │   │   │   ├─→ Enter payment details
   │   │   │   └─→ Complete payment
   │   │   │
   │   │   └─→ Stripe sends webhook
   │   │       │
   │   │       ├─→ POST /api/stripe/webhook
   │   │       │   │
   │   │       │   ├─→ Verify signature
   │   │       │   ├─→ Add credits to user
   │   │       │   └─→ Create Transaction record
   │   │       │
   │   │       └─→ Redirect to /dashboard?success=true
   │   │
   │   └─→ See updated credit balance
   │
   └─→ Choose Subscription (Monthly)
       │
       └─→ [Same flow as above, but creates Subscription record]


┌─────────────────────────────────────────────────────────────────┐
│                   SUBSCRIPTION FLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. Subscribe to Plan
   │
   ├─→ Initial subscription created
   │   │
   │   ├─→ Webhook: customer.subscription.created
   │   │   │
   │   │   └─→ Create Subscription record in DB
   │   │
   │   └─→ Webhook: invoice.payment_succeeded
   │       │
   │       ├─→ Add credits to user
   │       └─→ Create Transaction record
   │
   ├─→ Monthly Renewal
   │   │
   │   └─→ Webhook: invoice.payment_succeeded
   │       │
   │       ├─→ Add credits to user
   │       └─→ Create Transaction record
   │
   └─→ Manage Subscription
       │
       ├─→ Click "Manage Subscription" in Dashboard
       │   │
       │   ├─→ POST /api/stripe/portal
       │   │   │
       │   │   └─→ Create portal session
       │   │
       │   └─→ Redirect to Stripe Customer Portal
       │       │
       │       ├─→ Update payment method
       │       ├─→ Change plan
       │       └─→ Cancel subscription
       │
       └─→ If canceled:
           │
           └─→ Webhook: customer.subscription.deleted
               │
               └─→ Update Subscription status to 'canceled'


┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. User enters bio details
   │
   ├─→ Click "Generate your bio"
   │   │
   │   └─→ POST /api/together
   │       │
   │       ├─→ Check authentication
   │       │   │
   │       │   └─→ If not authenticated:
   │       │       │
   │       │       └─→ Return 401 → Redirect to /auth/signin
   │       │
   │       ├─→ Check credit balance
   │       │   │
   │       │   └─→ If insufficient credits:
   │       │       │
   │       │       └─→ Return 402 → Redirect to /pricing
   │       │
   │       ├─→ Deduct 1 credit (atomic transaction)
   │       │   │
   │       │   ├─→ Update User.credits
   │       │   └─→ Create CreditUsage record
   │       │
   │       └─→ Call Together AI API
   │           │
   │           └─→ Stream response to client
   │
   └─→ Display generated bios


┌─────────────────────────────────────────────────────────────────┐
│                     DASHBOARD FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. Visit /dashboard
   │
   ├─→ Check authentication
   │   │
   │   └─→ If not authenticated:
   │       │
   │       └─→ Redirect to /auth/signin
   │
   ├─→ Fetch user data
   │   │
   │   ├─→ GET /api/credits/balance
   │   │   │
   │   │   └─→ Return current credit balance
   │   │
   │   └─→ GET /api/credits/usage
   │       │
   │       └─→ Return usage history
   │
   └─→ Display:
       │
       ├─→ Available credits
       ├─→ Total credits used
       ├─→ Number of generations
       ├─→ Usage history table
       └─→ Action buttons
           │
           ├─→ "Buy More Credits" → /pricing
           └─→ "Manage Subscription" → Stripe Portal
```

## 🗄️ Database Relationships

```
User
├── id (PK)
├── email
├── credits (default: 5)
├── stripeCustomerId
│
├─→ Has Many: Account (OAuth connections)
├─→ Has Many: Session (active sessions)
├─→ Has Many: Subscription
│   ├── stripeSubscriptionId
│   ├── status
│   ├── currentPeriodEnd
│   └── cancelAtPeriodEnd
│
├─→ Has Many: Transaction
│   ├── type (purchase/subscription/refund)
│   ├── amount
│   ├── credits
│   └── stripePaymentIntentId
│
└─→ Has Many: CreditUsage
    ├── creditsUsed
    ├── action (bio_generation)
    └── createdAt
```

## 🔌 API Endpoint Flow

```
Authentication Endpoints
├── GET  /api/auth/signin → Show sign-in page
├── POST /api/auth/signin → Process sign-in
├── GET  /api/auth/callback/[provider] → OAuth callback
└── POST /api/auth/signout → Sign out user

Stripe Endpoints
├── POST /api/stripe/checkout
│   ├── Input: { planKey, isSubscription }
│   ├── Process:
│   │   ├── Verify authentication
│   │   ├── Get/Create Stripe customer
│   │   └── Create checkout session
│   └── Output: { url: "stripe_checkout_url" }
│
├── POST /api/stripe/webhook
│   ├── Input: Stripe webhook event
│   ├── Process:
│   │   ├── Verify signature
│   │   ├── Handle event type:
│   │   │   ├── checkout.session.completed
│   │   │   ├── customer.subscription.*
│   │   │   └── invoice.payment_succeeded
│   │   └── Update database
│   └── Output: { received: true }
│
└── POST /api/stripe/portal
    ├── Input: (authenticated user)
    ├── Process:
    │   ├── Verify authentication
    │   └── Create portal session
    └── Output: { url: "stripe_portal_url" }

Credit Endpoints
├── GET /api/credits/balance
│   ├── Input: (authenticated user)
│   └── Output: { credits: number }
│
└── GET /api/credits/usage
    ├── Input: (authenticated user)
    └── Output: { usage: CreditUsage[] }

Generation Endpoint
└── POST /api/together
    ├── Input: { prompt, model }
    ├── Process:
    │   ├── Verify authentication
    │   ├── Check credit balance
    │   ├── Deduct credits
    │   ├── Log usage
    │   └── Generate bio
    └── Output: Stream of generated text
```

## 🔄 Webhook Event Processing

```
Stripe Webhook Event
│
├─→ Receive at /api/stripe/webhook
│   │
│   ├─→ Verify webhook signature
│   │   │
│   │   ├─→ Valid: Continue processing
│   │   └─→ Invalid: Return 400 error
│   │
│   └─→ Route by event type:
│
├─→ checkout.session.completed
│   │
│   ├─→ Extract metadata (userId, credits, isSubscription)
│   │
│   ├─→ If one-time purchase:
│   │   │
│   │   ├─→ Add credits to user
│   │   └─→ Create Transaction record
│   │
│   └─→ If subscription:
│       │
│       └─→ Wait for invoice.payment_succeeded
│
├─→ customer.subscription.created/updated
│   │
│   ├─→ Extract subscription data
│   │
│   └─→ Upsert Subscription record
│       │
│       ├─→ stripeSubscriptionId
│       ├─→ status
│       ├─→ currentPeriodStart
│       ├─→ currentPeriodEnd
│       └─→ cancelAtPeriodEnd
│
├─→ customer.subscription.deleted
│   │
│   └─→ Update Subscription status to 'canceled'
│
├─→ invoice.payment_succeeded
│   │
│   ├─→ Find Subscription by stripeSubscriptionId
│   │
│   ├─→ Add credits to user
│   │
│   └─→ Create Transaction record
│
└─→ invoice.payment_failed
    │
    └─→ Log error (no action taken)
```

## 🎯 Credit Flow

```
Credit Sources
│
├─→ New User Signup
│   │
│   └─→ Receive 5 free credits
│
├─→ One-time Purchase
│   │
│   ├─→ Buy credit pack
│   └─→ Credits added immediately
│
└─→ Subscription
    │
    ├─→ Initial subscription
    │   │
    │   └─→ Credits added on first payment
    │
    └─→ Monthly renewal
        │
        └─→ Credits added each billing period

Credit Usage
│
└─→ Bio Generation
    │
    ├─→ Check balance (must have ≥1 credit)
    │
    ├─→ Deduct 1 credit (atomic transaction)
    │   │
    │   ├─→ Update User.credits
    │   └─→ Create CreditUsage record
    │
    └─→ Generate bio

Credit Tracking
│
├─→ Real-time balance in header
├─→ Dashboard statistics
└─→ Usage history table
```

## 🔐 Security Flow

```
Request → API Route
│
├─→ Authentication Check
│   │
│   ├─→ getServerSession(authOptions)
│   │   │
│   │   ├─→ Valid session: Continue
│   │   └─→ No session: Return 401
│   │
│   └─→ Fetch user from database
│
├─→ Authorization Check
│   │
│   └─→ Verify user owns resource
│
├─→ Credit Validation (for generation)
│   │
│   ├─→ Check user.credits >= required
│   │   │
│   │   ├─→ Sufficient: Continue
│   │   └─→ Insufficient: Return 402
│   │
│   └─→ Atomic credit deduction
│
└─→ Process Request
    │
    └─→ Return response
```

---

This flow diagram shows how all components work together to provide a seamless payment and credit management experience.
