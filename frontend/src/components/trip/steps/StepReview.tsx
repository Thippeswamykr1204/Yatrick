'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
  Tag,
} from 'lucide-react';
import { BUDGET_TIERS, INTERESTS } from '@/lib/constants';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ReviewValues {
  destination: string;
  durationDays: number;
  budgetTier: string;
  interests: string[];
  startDate: string;
  endDate: string;
}

interface StepReviewProps {
  values: ReviewValues;
}

export function StepReview({ values }: StepReviewProps) {
  const budgetTier = BUDGET_TIERS.find((t) => t.value === values.budgetTier);

  const selectedInterests = INTERESTS.filter((i) =>
    values.interests.includes(i.value)
  );

  const reviewItems = [
    {
      icon: MapPin,
      label: 'Destination',
      value: values.destination,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Calendar,
      label: 'Duration',
      value: `${values.durationDays} day${values.durationDays !== 1 ? 's' : ''}`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Wallet,
      label: 'Budget',
      value: budgetTier
        ? `${budgetTier.label} — ${budgetTier.range}`
        : values.budgetTier,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* AI callout */}
      <div
        className="flex items-start gap-4 p-5 rounded-3xl
                  bg-gradient-to-br from-orange-50 via-amber-50 to-white
                  border border-orange-200"
      >
        <div
          className="w-11 h-11 rounded-2xl bg-orange-100
                    flex items-center justify-center shrink-0"
        >
          <Sparkles className="w-5 h-5 text-orange-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900 mb-1">
            Ready to generate your itinerary
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            <span className='font-bold text-orange-600'>YATRIK</span> will generate a personalized day-by-day itinerary,
            hotel suggestions, budget breakdown, local recommendations,
            and a complete travel plan.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {reviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              variants={staggerItem}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl
                      bg-white border border-slate-200
                      shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-lg ${item.bg}
                            flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Dates */}
        {(values.startDate || values.endDate) && (
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-4 p-4 rounded-xl
                       bg-white border border-slate-200"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-50
                            flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Travel dates</p>
              <p className="text-sm font-semibold text-slate-900">
                {values.startDate
                  ? new Date(values.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}{' '}
                →{' '}
                {values.endDate
                  ? new Date(values.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Interests */}
        {selectedInterests.length > 0 && (
          <motion.div
            variants={staggerItem}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50
                              flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Interests</p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedInterests.length} selected
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((i) => (
                <span
                  key={i.value}
                  className="flex items-center gap-1.5 px-3 py-2
                            rounded-full bg-slate-50 border border-slate-200
                            text-xs font-medium text-slate-700"
                >
                  <span>{i.icon}</span>
                  {i.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}