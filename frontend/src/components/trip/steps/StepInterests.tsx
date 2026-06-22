'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { INTERESTS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface StepInterestsProps {
  values: string[];
  error?: string;
  onChange: (values: string[]) => void;
}

export function StepInterests({ values, error, onChange }: StepInterestsProps) {
  const toggle = (interest: string) => {
    if (values.includes(interest)) {
      onChange(values.filter((v) => v !== interest));
    } else {
      onChange([...values, interest]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div>
        <p className="text-sm text-slate-500 mb-2 leading-relaxed">
          Select all that apply — the AI uses these to personalize your itinerary.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {values.length} selected
          </span>
          {values.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {INTERESTS.map((interest) => {
          const selected = values.includes(interest.value);

          return (
            <motion.button
              key={interest.value}
              variants={staggerItem}
              type="button"
              onClick={() => toggle(interest.value)}
              className={cn(
                'relative flex items-center gap-3 p-4 rounded-2xl border-2',
                'transition-all duration-200 text-left focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-orange-500',
                selected
                  ? 'border-orange-300 bg-orange-50 shadow-md shadow-orange-500/10'
                  : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'
              )}
            >
              {/* Emoji */}
              <span className="text-xl shrink-0">{interest.icon}</span>

              {/* Label */}
              <span
                className={cn(
                  'text-sm font-medium leading-tight',
                  selected ? 'text-orange-700' : 'text-slate-700'
                )}
              >
                {interest.label}
              </span>

              {/* Check */}
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 rounded-full
                             bg-orange-500 flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}