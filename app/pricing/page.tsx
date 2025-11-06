"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast, Toaster } from "react-hot-toast";

const creditPacks = [
  {
    key: 'CREDITS_10',
    name: 'Starter Pack',
    credits: 10,
    price: '$4.99',
    description: 'Perfect for trying out the service',
  },
  {
    key: 'CREDITS_50',
    name: 'Pro Pack',
    credits: 50,
    price: '$19.99',
    description: 'Best value for regular users',
    popular: true,
  },
  {
    key: 'CREDITS_100',
    name: 'Ultimate Pack',
    credits: 100,
    price: '$29.99',
    description: 'For power users',
  },
];

const subscriptionPlans = [
  {
    key: 'BASIC',
    name: 'Basic',
    credits: 50,
    price: '$9.99',
    description: 'Great for individuals',
    features: ['50 bio generations/month', 'All AI models', 'Email support'],
  },
  {
    key: 'PRO',
    name: 'Pro',
    credits: 200,
    price: '$29.99',
    description: 'Perfect for professionals',
    features: ['200 bio generations/month', 'All AI models', 'Priority support', 'Early access to features'],
    popular: true,
  },
  {
    key: 'PREMIUM',
    name: 'Premium',
    credits: 500,
    price: '$49.99',
    description: 'For agencies and teams',
    features: ['500 bio generations/month', 'All AI models', 'Priority support', 'Early access to features', 'Custom integrations'],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'credits' | 'subscription'>('credits');

  const handleCheckout = async (planKey: string, isSubscription: boolean) => {
    if (!session) {
      toast.error('Please sign in to purchase');
      router.push('/api/auth/signin');
      return;
    }

    setLoading(planKey);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, isSubscription }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div 
      className="flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen px-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center mt-12">
        <h1 
          className="sm:text-6xl text-4xl max-w-4xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Choose Your <span className="gradient-text">Plan</span>
        </h1>
        
        <p 
          className="text-xl sm:text-2xl max-w-2xl mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          Get credits to generate amazing Twitter bios with AI
        </p>

        {/* Toggle between Credits and Subscriptions */}
        <div 
          className="flex rounded-xl p-1 mb-12"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <button
            onClick={() => setViewMode('credits')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              viewMode === 'credits' ? 'shadow-custom' : ''
            }`}
            style={{
              background: viewMode === 'credits' ? 'var(--gradient-primary)' : 'transparent',
              color: viewMode === 'credits' ? 'white' : 'var(--text-secondary)',
            }}
          >
            Credit Packs
          </button>
          <button
            onClick={() => setViewMode('subscription')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              viewMode === 'subscription' ? 'shadow-custom' : ''
            }`}
            style={{
              background: viewMode === 'subscription' ? 'var(--gradient-primary)' : 'transparent',
              color: viewMode === 'subscription' ? 'white' : 'var(--text-secondary)',
            }}
          >
            Subscriptions
          </button>
        </div>

        {/* Credit Packs */}
        {viewMode === 'credits' && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
            {creditPacks.map((pack) => (
              <div
                key={pack.key}
                className={`glass-effect rounded-2xl p-8 transition-all duration-300 
                           hover-scale hover:shadow-custom-lg relative ${
                  pack.popular ? 'ring-2' : ''
                }`}
                style={{
                  border: '1px solid var(--border-primary)',
                  ...(pack.popular && { borderColor: 'var(--accent-primary)' })
                }}
              >
                {pack.popular && (
                  <div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 
                               px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    BEST VALUE
                  </div>
                )}
                
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {pack.name}
                </h3>
                
                <div className="mb-4">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {pack.price}
                  </span>
                </div>
                
                <p 
                  className="text-lg mb-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {pack.credits} bio generations
                </p>
                
                <p 
                  className="mb-8"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {pack.description}
                </p>
                
                <button
                  onClick={() => handleCheckout(pack.key, false)}
                  disabled={loading === pack.key}
                  className="w-full rounded-xl font-medium px-6 py-3 
                           shadow-custom hover-scale hover:shadow-custom-lg
                           transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: pack.popular ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                    color: pack.popular ? 'white' : 'var(--text-primary)',
                    border: pack.popular ? 'none' : '1px solid var(--border-primary)',
                  }}
                >
                  {loading === pack.key ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Subscription Plans */}
        {viewMode === 'subscription' && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mb-12">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.key}
                className={`glass-effect rounded-2xl p-8 transition-all duration-300 
                           hover-scale hover:shadow-custom-lg relative ${
                  plan.popular ? 'ring-2' : ''
                }`}
                style={{
                  border: '1px solid var(--border-primary)',
                  ...(plan.popular && { borderColor: 'var(--accent-primary)' })
                }}
              >
                {plan.popular && (
                  <div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 
                               px-4 py-1 rounded-full text-sm font-bold text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    MOST POPULAR
                  </div>
                )}
                
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {plan.price}
                  </span>
                  <span 
                    className="text-lg"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    /month
                  </span>
                </div>
                
                <p 
                  className="mb-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {plan.description}
                </p>
                
                <ul className="text-left mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li 
                      key={idx}
                      className="flex items-start"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span 
                        className="mr-2"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleCheckout(plan.key, true)}
                  disabled={loading === plan.key}
                  className="w-full rounded-xl font-medium px-6 py-3 
                           shadow-custom hover-scale hover:shadow-custom-lg
                           transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: plan.popular ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                    color: plan.popular ? 'white' : 'var(--text-primary)',
                    border: plan.popular ? 'none' : '1px solid var(--border-primary)',
                  }}
                >
                  {loading === plan.key ? 'Processing...' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div 
          className="max-w-3xl w-full glass-effect rounded-2xl p-8 mb-12"
          style={{ border: '1px solid var(--border-primary)' }}
        >
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            How Credits Work
          </h2>
          <p 
            className="text-left mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Each bio generation costs 1 credit. Credits never expire and can be used anytime. 
            Subscriptions automatically renew monthly and add credits to your account at the start of each billing period.
          </p>
          <p 
            className="text-left"
            style={{ color: 'var(--text-secondary)' }}
          >
            New users get 5 free credits to try the service. You can cancel your subscription anytime from your dashboard.
          </p>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
