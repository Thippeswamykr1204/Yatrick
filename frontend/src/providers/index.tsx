'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ToastContainer } from '@/components/common/Toast';
import { TOKEN_KEY } from '@/lib/constants';

function AuthInitializer() {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      {children}
      <ToastContainer />
    </>
  );
}