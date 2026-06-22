'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  // Don't render form if already authenticated
  if (isAuthenticated) return null;

  return <LoginForm />;
}