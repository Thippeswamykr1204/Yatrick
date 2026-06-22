'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { useUIStore, type Toast } from '@/store/uiStore';
import { cn } from '@/lib/cn';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success:
    'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10',
  error:
    'bg-white border-red-200 text-slate-800 shadow-red-500/10',
  warning:
    'bg-white border-amber-200 text-slate-800 shadow-amber-500/10',
  info:
    'bg-white border-blue-200 text-slate-800 shadow-blue-500/10',
};

const iconStyles = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useUIStore();
  const Icon = icons[toast.type];

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        x: 40,
        scale: 0.95,
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group flex w-full sm:w-[380px] items-start gap-3 rounded-2xl border bg-white/95 backdrop-blur-xl p-4 shadow-2xl',
        styles[toast.type]
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
        <Icon
          className={cn(
            'h-5 w-5',
            iconStyles[toast.type]
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold tracking-tight">
          {toast.title}
        </p>

        {toast.description && (
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 rounded-lg p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useUIStore();

  return (
    <div
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] flex flex-col gap-3 items-end pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
          >
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}