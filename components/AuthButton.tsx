"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div 
        className="rounded-full px-4 py-2 text-sm"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
        }}
      >
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 rounded-full px-4 py-2 text-sm 
                     shadow-custom hover-scale transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
            border: '1px solid'
          }}
        >
          <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
            {session.user?.credits || 0}
          </span>
          <span>credits</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="rounded-full px-4 py-2 text-sm shadow-custom hover-scale 
                     transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="rounded-full px-4 py-2 text-sm shadow-custom hover-scale 
                 transition-all duration-300 font-medium"
      style={{
        background: 'var(--gradient-primary)',
        color: 'white'
      }}
    >
      Sign In
    </button>
  );
}
