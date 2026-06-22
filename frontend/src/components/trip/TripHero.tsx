'use client';

import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Wallet, Sparkles,
  Clock, CheckCircle2, Archive, Loader2,
} from 'lucide-react';
import { Trip } from '@/types/models';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/cn';

const destinationGradients = [
  'from-orange-500 via-orange-600 to-amber-600',
  'from-orange-500 via-red-500 to-orange-600',
  'from-amber-500 via-orange-500 to-red-500',
  'from-orange-600 via-amber-500 to-yellow-500',
  'from-orange-500 via-orange-600 to-red-500',
  'from-amber-400 via-orange-500 to-orange-600',
];

function getGradient(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return destinationGradients[Math.abs(hash) % destinationGradients.length];
}

const statusMap = {
  draft:     { label: 'Planning',  icon: Clock,         variant: 'warning' as const },
  completed: { label: 'Planned',   icon: CheckCircle2,  variant: 'success' as const },
  archived:  { label: 'Archived',  icon: Archive,       variant: 'default' as const },
};

const budgetMap = {
  Low:    { label: 'Budget',    variant: 'info'    as const },
  Medium: { label: 'Mid-range', variant: 'purple'  as const },
  High:   { label: 'Luxury',   variant: 'warning' as const },
};

interface TripHeroProps {
  trip: Trip;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function TripHero({ trip, isGenerating, onGenerate }: TripHeroProps) {
  const gradient      = getGradient(trip.destination);
  const status        = statusMap[trip.status];
  const budget        = budgetMap[trip.budgetTier];
  const StatusIcon    = status.icon;
  const hasItinerary  = trip.itinerary.length > 0;

  const totalActivities   = trip.itinerary.flatMap((d) => d.activities).length;
  const completedActivities = trip.itinerary
    .flatMap((d) => d.activities)
    .filter((a) => a.completed).length;
  const progress = totalActivities > 0
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative rounded-3xl bg-gradient-to-br overflow-hidden',
        gradient
      )}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          {/* Left — destination + meta */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-black/20 backdrop-blur-sm border border-white/20
                               text-white text-xs font-medium">
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-black/20 backdrop-blur-sm border border-white/20
                               text-white text-xs font-medium">
                {budget.label}
              </span>
              {hasItinerary && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full
                                 bg-orange-500/30 backdrop-blur-sm border border-orange-300/30
                                 text-white text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI planned
                </span>
              )}
            </div>

            {/* Destination */}
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>Destination</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                {trip.destination}
              </h1>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{trip.durationDays} days</span>
              </div>
              {trip.estimatedBudget.total > 0 && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Wallet className="w-4 h-4" />
                  <span>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(trip.estimatedBudget.total)}
                    {' '}estimated
                  </span>
                </div>
              )}
              {trip.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {trip.interests.slice(0, 3).map((i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-white/10
                                 border border-white/20 text-white/80 text-xs"
                    >
                      {i}
                    </span>
                  ))}
                  {trip.interests.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10
                                     border border-white/20 text-white/80 text-xs">
                      +{trip.interests.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Progress bar */}
            {totalActivities > 0 && (
              <div className="max-w-xs">
                <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                  <span>{completedActivities}/{totalActivities} activities completed</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right — generate button */}
          <div className="shrink-0">
            {!hasItinerary ? (
              <Button
                variant="primary"
                size="lg"
                loading={isGenerating}
                icon={!isGenerating ? <Sparkles className="w-4 h-4" /> : undefined}
                onClick={onGenerate}
                className="bg-white text-orange-700 hover:bg-orange-50
                           shadow-xl shadow-black/20 border-0"
              >
                {isGenerating ? 'Generating…' : 'Generate itinerary'}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="md"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={onGenerate}
                disabled={isGenerating}
                className="text-white/80 hover:text-white hover:bg-white/10
                           border border-white/20"
              >
                {isGenerating ? 'Regenerating…' : 'Regenerate all'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}