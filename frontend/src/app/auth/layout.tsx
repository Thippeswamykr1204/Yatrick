import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = { title: 'Auth' };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 py-12 pt-24">
        {children}
      </div>
      <footer className="h-12 flex items-center justify-center border-t border-slate-200">
        <p className="text-xs text-slate-400">© 2026 {APP_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
}