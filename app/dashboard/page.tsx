"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast, Toaster } from "react-hot-toast";

interface CreditUsage {
  id: string;
  creditsUsed: number;
  action: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usage, setUsage] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUsage();
    }
  }, [session]);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/credits/usage");
      const data = await response.json();
      setUsage(data.usage || []);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to open customer portal");
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div 
          className="text-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div 
      className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen px-4"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Header />
      <main className="flex flex-1 w-full flex-col items-center mt-12">
        <h1 
          className="sm:text-5xl text-4xl font-bold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Your <span className="gradient-text">Dashboard</span>
        </h1>
        
        <p 
          className="text-xl mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          Manage your credits and subscription
        </p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
          {/* Credits Card */}
          <div 
            className="glass-effect rounded-2xl p-6 shadow-custom"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <h3 
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Available Credits
            </h3>
            <p 
              className="text-4xl font-bold"
              style={{ color: 'var(--accent-primary)' }}
            >
              {session.user?.credits || 0}
            </p>
          </div>

          {/* Total Used Card */}
          <div 
            className="glass-effect rounded-2xl p-6 shadow-custom"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <h3 
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Used
            </h3>
            <p 
              className="text-4xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {usage.reduce((sum, u) => sum + u.creditsUsed, 0)}
            </p>
          </div>

          {/* Generations Card */}
          <div 
            className="glass-effect rounded-2xl p-6 shadow-custom"
            style={{ border: '1px solid var(--border-primary)' }}
          >
            <h3 
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Generations
            </h3>
            <p 
              className="text-4xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {usage.length}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => router.push("/pricing")}
            className="rounded-xl font-medium px-6 py-3 shadow-custom 
                     hover-scale hover:shadow-custom-lg transition-all duration-300"
            style={{
              background: 'var(--gradient-primary)',
              color: 'white'
            }}
          >
            Buy More Credits
          </button>
          
          {session.user?.stripeCustomerId && (
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="rounded-xl font-medium px-6 py-3 shadow-custom 
                       hover-scale hover:shadow-custom-lg transition-all duration-300
                       disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)'
              }}
            >
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          )}
        </div>

        {/* Usage History */}
        <div className="w-full max-w-4xl">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Recent Activity
          </h2>
          
          {usage.length === 0 ? (
            <div 
              className="glass-effect rounded-2xl p-8 text-center"
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <p style={{ color: 'var(--text-secondary)' }}>
                No activity yet. Start generating bios to see your usage history!
              </p>
            </div>
          ) : (
            <div 
              className="glass-effect rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr 
                      className="border-b"
                      style={{ borderColor: 'var(--border-primary)' }}
                    >
                      <th 
                        className="text-left p-4 font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Action
                      </th>
                      <th 
                        className="text-left p-4 font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Credits Used
                      </th>
                      <th 
                        className="text-left p-4 font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.map((item) => (
                      <tr 
                        key={item.id}
                        className="border-b"
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <td 
                          className="p-4"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {item.action === 'bio_generation' ? 'Bio Generation' : item.action}
                        </td>
                        <td 
                          className="p-4"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          {item.creditsUsed}
                        </td>
                        <td 
                          className="p-4"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
