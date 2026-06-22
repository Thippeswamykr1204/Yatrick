'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService, RegisterInput, LoginInput } from '@/services/auth.service';
import { useToast } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, clearAuth } = useAuthStore();
  const toast = useToast();

  const register = useCallback(
    async (input: RegisterInput) => {
      const result = await authService.register(input);
      setAuth(result.user, result.accessToken, result.refreshToken);
      toast.success('Account created!', `Welcome to Voyagr, ${result.user.name}!`);
      router.push(ROUTES.DASHBOARD);
      return result;
    },
    [setAuth, router, toast]
  );

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await authService.login(input);
      setAuth(result.user, result.accessToken, result.refreshToken);
      toast.success('Welcome back!', `Good to see you, ${result.user.name}!`);
      router.push(ROUTES.DASHBOARD);
      return result;
    },
    [setAuth, router, toast]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {}
    clearAuth();
    toast.success('Signed out successfully');
    router.push(ROUTES.HOME);
  }, [clearAuth, router, toast]);

  return {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
  };
}