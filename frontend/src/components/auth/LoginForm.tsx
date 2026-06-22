'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/store/uiStore';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/common/Button';
import axios from 'axios';

// ── Validation schema ──────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFields = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginFields, string>>;

// ── Input component ────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}

function FormInput({ label, icon, error, rightElement, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          className={cn(
            'w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-sm text-slate-900',
            'placeholder:text-slate-400 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 focus:border-orange-500',
            error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-slate-200 hover:border-slate-300',
            rightElement && 'pr-10',
            className
          )}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ── Login Form ─────────────────────────────────────────────────
export function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();

  const [fields, setFields] = useState<LoginFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const set = (key: keyof LoginFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    // Client-side validation
    const result = loginSchema.safeParse(fields);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof LoginFields;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || error.response?.data?.message;
        if (error.response?.status === 401) {
          setGlobalError('Invalid email or password. Please try again.');
        } else {
          setGlobalError(msg || 'Something went wrong. Please try again.');
        }
      } else {
        setGlobalError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500">
            Sign in to continue planning your adventures
          </p>
        </div>

        {/* Global error */}
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
          >
            {globalError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            value={fields.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
            autoFocus
          />

          <FormInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            icon={<Lock className="w-4 h-4" />}
            value={fields.password}
            onChange={set('password')}
            error={errors.password}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            icon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            iconPosition="right"
            className="
              w-full mt-2
              bg-orange-500
              hover:bg-orange-400
              border-orange-500
              text-white
              shadow-lg
              shadow-orange-500/25
              transition-all
              duration-200
            "
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Bottom hint */}
      <p className="text-center text-xs text-slate-400 mt-6">
        By signing in, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-slate-600">Terms</span>{' '}
        and{' '}
        <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>
      </p>
    </motion.div>
  );
}