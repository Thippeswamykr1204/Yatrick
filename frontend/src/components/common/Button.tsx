'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants = {
  primary:
    'bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/15',
  outline:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
};

const sizes = {
  sm: 'h-9 px-4 text-sm rounded-xl gap-2',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 sm:h-14 px-6 sm:px-8 text-base rounded-2xl gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-300 will-change-transform',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && iconPosition === 'left' && icon
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';