'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel,
  UtensilsCrossed,
  Ticket,
  IndianRupee,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { Trip } from '@/types/models';
import { tripsService } from '@/services/trips.service';
import { useToast } from '@/store/uiStore';
import { Button } from '@/components/common/Button';

const CATEGORIES = [
  {
    key: 'transport',
    label: 'Transport',
    icon: Plane,
    color: 'bg-sky-500',
  },
  {
    key: 'accommodation',
    label: 'Accommodation',
    icon: Hotel,
    color: 'bg-violet-500',
  },
  {
    key: 'food',
    label: 'Food & Dining',
    icon: UtensilsCrossed,
    color: 'bg-emerald-500',
  },
  {
    key: 'activities',
    label: 'Activities',
    icon: Ticket,
    color: 'bg-orange-500',
  },
] as const;

interface OptimizedBudget {
  originalBudget: any;
  optimizedBudget: any;
  savings: number;
  suggestions: {
    hotels: any[];
    activityAdjustments: string[];
    generalTips: string[];
  };
}

interface BudgetTabProps {
  trip: Trip;
}

export function BudgetTab({ trip }: BudgetTabProps) {
  const toast = useToast();
  const budget = trip.estimatedBudget;

  const [targetBudget, setTargetBudget] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState<OptimizedBudget | null>(null);

  const handleOptimize = async () => {
    const target = parseFloat(targetBudget);

    if (!target || target <= 0) {
      toast.error('Enter a valid target budget');
      return;
    }

    if (target >= budget.total) {
      toast.warning('Target must be less than current budget');
      return;
    }

    setIsOptimizing(true);

    try {
      const result = await tripsService.optimizeBudget(trip._id, target);

      setOptimized(result);

      toast.success(
        'Budget optimized!',
        `Save ₹${result.savings.toLocaleString()}`
      );
    } catch {
      toast.error('Optimization failed', 'Please try again');
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!budget.total) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <IndianRupee className="h-6 w-6 text-orange-500" />
          </div>

          <p className="text-sm font-medium text-slate-600">
            Budget appears after generating your itinerary.
          </p>
        </div>
      </div>
    );
  }

  const dailyAverage = Math.round(budget.total / trip.durationDays);

  return (
    <div className="w-full space-y-6">
      {/* Total Budget Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-orange-200/50 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 shadow-xl shadow-orange-500/20 md:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <IndianRupee className="h-4 w-4 text-orange-100" />
              <span className="text-xs font-medium text-orange-50">
                Total Estimated Budget
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              ₹{budget.total.toLocaleString()}
            </h2>

            <p className="mt-2 text-sm text-orange-100 sm:text-base">
              {trip.durationDays} days trip • ₹
              {dailyAverage.toLocaleString()}/day average
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wider text-orange-100">
              Daily Average
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              ₹{dailyAverage.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Budget Breakdown
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Understand where your travel budget is allocated.
          </p>
        </div>

        <div className="space-y-5">
          {CATEGORIES.map((cat, index) => {
            const amount = budget[cat.key] ?? 0;

            const percentage =
              budget.total > 0
                ? Math.round((amount / budget.total) * 100)
                : 0;

            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {cat.label}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      ₹{amount.toLocaleString()}
                    </p>

                    <p className="text-xs text-slate-500">
                      {percentage}% of budget
                    </p>
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.06 + 0.15,
                    }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Optimizer */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100">
            <TrendingDown className="h-5 w-5 text-orange-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              AI Budget Optimizer
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter a target budget and discover potential savings.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="number"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              placeholder={`Target ₹${Math.round(
                budget.total * 0.7
              ).toLocaleString()}`}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            loading={isOptimizing}
            icon={!isOptimizing ? <Sparkles className="h-4 w-4" /> : undefined}
            onClick={handleOptimize}
            className="sm:min-w-[160px]"
          >
            Optimize
          </Button>
        </div>
      </div>

      {/* Results */}
      {optimized && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Savings */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-emerald-900">
                  Save ₹{optimized.savings.toLocaleString()}
                </h4>

                <p className="mt-1 text-sm text-emerald-700">
                  AI identified smarter budget alternatives.
                </p>
              </div>

              <div className="w-fit rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {Math.round(
                  (optimized.savings / budget.total) * 100
                )}
                % Reduction
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Current Budget
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{optimized.originalBudget.total.toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-600 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-100">
                  Optimized Budget
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  ₹{optimized.optimizedBudget.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Hotels */}
          {optimized.suggestions.hotels.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                <Hotel className="h-4 w-4 text-orange-500" />
                Cheaper Hotel Options
              </h4>

              <div className="space-y-3">
                {optimized.suggestions.hotels.map(
                  (hotel: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {hotel.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {hotel.tier} • ⭐ {hotel.rating}
                        </p>
                      </div>

                      <p className="font-bold text-emerald-600">
                        ₹{hotel.estimatedCostPerNightUSD}/night
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Activity Adjustments */}
          {optimized.suggestions.activityAdjustments.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                <Ticket className="h-4 w-4 text-orange-500" />
                Activity Savings
              </h4>

              <ul className="space-y-3">
                {optimized.suggestions.activityAdjustments.map(
                  (tip: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="mt-1 text-emerald-500">✓</span>
                      {tip}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* General Tips */}
          {optimized.suggestions.generalTips.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-orange-500" />
                General Tips
              </h4>

              <ul className="space-y-3">
                {optimized.suggestions.generalTips.map(
                  (tip: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="mt-1 text-orange-500">→</span>
                      {tip}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}