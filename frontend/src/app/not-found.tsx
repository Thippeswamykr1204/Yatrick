'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-glow">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-2">Page not found</p>
        <p className="text-slate-400 mb-8">
          Looks like this destination doesn't exist on our map.
        </p>
        <Link href={ROUTES.HOME}>
          <Button
            variant="primary"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}