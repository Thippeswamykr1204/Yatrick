'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/common/Button';
import axios from 'axios';

// ── Validation schema ──────────────────────────────────────────
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[@$!%*?&]/, 'Must contain a special character (@$!%*?&)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFields = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof RegisterFields, string>>;

// ── Password strength rules ────────────────────────────────────
const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[@$!%*?&]/.test(p) },
];

function PasswordStrengthMeter({ password }: { password: string }) {
  const passed = passwordRules.filter((r) => r.test(password)).length;
  const strength = password.length === 0 ? 0 : passed;

  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-500'];
  const labels = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="space-y-2">
      {/* Meter bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              strength >= i ? colors[strength] : 'bg-slate-200'
            )}
          />
        ))}
      </div>

      {/* Label */}
      {password.length > 0 && (
        <p className={cn(
          'text-xs font-medium transition-colors',
          strength <= 2 ? 'text-red-500' : strength <= 3 ? 'text-amber-500' : 'text-emerald-600'
        )}>
          {labels[strength]}
        </p>
      )}

      {/* Rules list */}
      {password.length > 0 && (
        <ul className="space-y-1">
          {passwordRules.map((rule) => {
            const ok = rule.test(password);
            return (
              <li key={rule.label} className="flex items-center gap-2 text-xs">
                {ok ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
                <span className={ok ? 'text-slate-600' : 'text-slate-400'}>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Register Form ──────────────────────────────────────────────
export function RegisterForm() {
  const { register } = useAuth();

  const [fields, setFields] = useState<RegisterFields>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [showStrength, setShowStrength] = useState(false);

  const set = (key: keyof RegisterFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    // Client-side validation
    const result = registerSchema.safeParse(fields);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof RegisterFields;
        if (!fieldErrors[key]) {
          fieldErrors[key] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || error.response?.data?.message;
        if (error.response?.status === 409) {
          setErrors((err) => ({ ...err, email: 'Email already in use' }));
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
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500">
            Start planning your next adventure with AI
          </p>
        </div>

        {/* Global error */}
        <AnimatePresence>
          {globalError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
            >
              {globalError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            label="Full name"
            type="text"
            placeholder="John Doe"
            icon={<User className="w-4 h-4" />}
            value={fields.name}
            onChange={set('name')}
            error={errors.name}
            autoComplete="name"
            autoFocus
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            value={fields.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
          />

          {/* Password with strength meter */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={fields.password}
                onChange={set('password')}
                onFocus={() => setShowStrength(true)}
                autoComplete="new-password"
                className={cn(
                  'w-full h-11 pl-10 pr-10 rounded-xl border bg-white text-sm text-slate-900',
                  'placeholder:text-slate-400 transition-all duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 focus:border-orange-500',
                  errors.password
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Strength meter — show on focus */}
            <AnimatePresence>
              {showStrength && fields.password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-1"
                >
                  <PasswordStrengthMeter password={fields.password} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <FormInput
            label="Confirm password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            icon={<Lock className="w-4 h-4" />}
            value={fields.confirmPassword}
            onChange={set('confirmPassword')}
            error={errors.confirmPassword}
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Bottom hint */}
      <p className="text-center text-xs text-slate-400 mt-6">
        By signing up, you agree to our{' '}
        <span className="underline cursor-pointer hover:text-slate-600">Terms</span>{' '}
        and{' '}
        <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>
      </p>
    </motion.div>
  );
}