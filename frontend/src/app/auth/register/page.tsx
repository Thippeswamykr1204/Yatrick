'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ROUTES } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isAuthenticated) return null;

  return <RegisterForm />;
}