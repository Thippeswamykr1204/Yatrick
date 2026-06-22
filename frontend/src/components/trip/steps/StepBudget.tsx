'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BUDGET_TIERS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface StepBudgetProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

const tierColors: Record<string, {
  border: string;
  bg: string;
  badge: string;
  check: string;
  icon: string;
}> = {
  Low: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    check: 'bg-emerald-500',
    icon: 'text-emerald-500',
  },
  Medium: {
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    check: 'bg-orange-500',
    icon: 'text-orange-500',
  },
  High: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    check: 'bg-amber-500',
    icon: 'text-amber-500',
  },
};

export function StepBudget({ value, error, onChange }: StepBudgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          Choose the budget style that matches your travel comfort level.
        </p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mb-3"
          >
            {error}
          </motion.p>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-4"
      >
        {BUDGET_TIERS.map((tier) => {
          const selected = value === tier.value;
          const colors = tierColors[tier.value];

          return (
            <motion.button
              key={tier.value}
              variants={staggerItem}
              type="button"
              onClick={() => onChange(tier.value)}
              className={cn(
                'relative w-full text-left p-5 sm:p-6 rounded-3xl border-2 transition-all   duration-300',
                'hover:shadow-card focus:outline-none focus-visible:ring-2',
                'focus-visible:ring-orange-500',
                selected
                  ? `${colors.border} ${colors.bg} shadow-lg shadow-black/[0.03]`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Emoji */}
                <div className="text-3xl mt-0.5">{tier.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 text-base">
                      {tier.label}
                    </span>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        selected ? colors.badge : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {tier.range}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{tier.description}</p>
                </div>

                {/* Check indicator */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                    selected
                      ? `${colors.check} border-transparent`
                      : 'border-slate-300 bg-white'
                  )}
                >
                  {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}