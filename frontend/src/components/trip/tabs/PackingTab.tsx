'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle2,
  Circle,
  Sparkles,
  Luggage,
} from 'lucide-react';
import { Trip, PackingItem } from '@/types/models';
import { tripsService } from '@/services/trips.service';
import { useToast } from '@/store/uiStore';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/cn';

const CATEGORY_CONFIG = {
  Documents: {
    emoji: '📄',
    variant: 'info' as const,
    gradient: 'from-sky-500 to-blue-500',
  },
  Clothing: {
    emoji: '👕',
    variant: 'purple' as const,
    gradient: 'from-violet-500 to-purple-500',
  },
  Gear: {
    emoji: '🎒',
    variant: 'warning' as const,
    gradient: 'from-orange-500 to-amber-500',
  },
  Toiletries: {
    emoji: '🧴',
    variant: 'default' as const,
    gradient: 'from-emerald-500 to-green-500',
  },
  Other: {
    emoji: '📦',
    variant: 'default' as const,
    gradient: 'from-slate-500 to-slate-600',
  },
};

interface PackingTabProps {
  trip: Trip;
  onTripUpdate: (trip: Trip) => void;
}

export function PackingTab({
  trip,
  onTripUpdate,
}: PackingTabProps) {
  const toast = useToast();
  const [isGenerating, setIsGenerating] =
    useState(false);

  const categories = Object.keys(
    CATEGORY_CONFIG
  ) as Array<keyof typeof CATEGORY_CONFIG>;

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = trip.packingList.filter(
      (item) => item.category === cat
    );

    return acc;
  }, {} as Record<string, PackingItem[]>);

  const packed = trip.packingList.filter(
    (i) => i.isPacked
  ).length;

  const total = trip.packingList.length;

  const progress =
    total > 0
      ? Math.round((packed / total) * 100)
      : 0;

  const toggleItem = async (itemId: string) => {
    const newList = trip.packingList.map((item) =>
      item._id === itemId
        ? {
            ...item,
            isPacked: !item.isPacked,
          }
        : item
    );

    try {
      const updated = await tripsService.update(
        trip._id,
        {
          packingList: newList as any,
        }
      );

      onTripUpdate(updated);
    } catch {
      toast.error('Failed to update item');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const updated =
        await tripsService.generatePackingList(
          trip._id
        );

      onTripUpdate(updated);

      toast.success(
        'Packing list generated!'
      );
    } catch {
      toast.error(
        'Failed to generate packing list'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (!trip.packingList.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50">
            <Luggage className="h-10 w-10 text-orange-500" />
          </div>

          <h3 className="mb-3 text-xl font-semibold text-slate-900">
            No packing list yet
          </h3>

          <p className="mb-8 text-sm leading-relaxed text-slate-500">
            Generate a smart weather-aware
            packing list based on your
            destination, duration, and
            activities.
          </p>

          <Button
            variant="primary"
            loading={isGenerating}
            icon={
              <Sparkles className="h-4 w-4" />
            }
            onClick={handleGenerate}
          >
            Generate Packing List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="overflow-hidden rounded-3xl border border-orange-200/50 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 p-6 shadow-xl shadow-orange-500/20"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <Luggage className="h-4 w-4 text-white" />
              <span className="text-xs font-medium text-orange-50">
                Packing Progress
              </span>
            </div>

            <h2 className="text-4xl font-bold text-white">
              {progress}%
            </h2>

            <p className="mt-1 text-sm text-orange-100">
              {packed} of {total} items packed
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            loading={isGenerating}
            icon={
              <RefreshCw className="h-4 w-4" />
            }
            onClick={handleGenerate}
            className="bg-white text-orange-600 hover:bg-orange-50"
          >
            Refresh List
          </Button>
        </div>

        <div className="mt-5">
          <div className="h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.8,
              }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      {categories.map((cat) => {
        const items = grouped[cat];

        if (!items.length) return null;

        const config =
          CATEGORY_CONFIG[cat];

        const catPacked =
          items.filter(
            (item) => item.isPacked
          ).length;

        return (
          <motion.div
            key={cat}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Category Header */}
            <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg text-white',
                      config.gradient
                    )}
                  >
                    {config.emoji}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {cat}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {items.length} items
                    </p>
                  </div>
                </div>

                <Badge
                  variant={config.variant}
                  size="sm"
                >
                  {catPacked}/
                  {items.length} Packed
                </Badge>
              </div>
            </div>

            {/* Items */}
            <div>
              {items.map((item) => (
                <button
                  key={item._id}
                  onClick={() =>
                    item._id &&
                    toggleItem(item._id)
                  }
                  className="group flex w-full items-center gap-4 border-b border-slate-100 px-5 py-4 text-left transition-all hover:bg-slate-50 last:border-0"
                >
                  {item.isPacked ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-orange-500" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium transition-all',
                        item.isPacked
                          ? 'text-slate-400 line-through'
                          : 'text-slate-700'
                      )}
                    >
                      {item.item}
                    </p>
                  </div>

                  {item.weatherRelevant && (
                    <div className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600">
                      🌤 Weather
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}