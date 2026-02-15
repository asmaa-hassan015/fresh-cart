'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Provides client-side route protection.
 * Use this component to wrap pages that require authentication or guest-only access.
 * 
 * @param requireAuth - If true, user must be authenticated to access
 * @param requireGuest - If true, only non-authenticated users can access
 * @param redirectTo - Custom redirect URL (defaults to /login for auth, / for guest)
 */
export default function ProtectedRoute({
  children,
  requireAuth = false,
  requireGuest = false,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      const redirect = redirectTo || `/login?redirect=${window.location.pathname}`;
      router.push(redirect);
    }

    if (requireGuest && isAuthenticated) {
      router.push(redirectTo || '/');
    }
  }, [isAuthenticated, isLoading, requireAuth, requireGuest, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-gray)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireGuest && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}