'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Wallet,
  ArrowRight,
  Trash2,
  Sparkles,
  Clock,
  CheckCircle2,
  Archive,
} from 'lucide-react';
import { Trip } from '@/types/models';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';

const destinationGradients = [
  'from-indigo-400 to-blue-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-emerald-400 to-green-500',
];

function getGradient(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return destinationGradients[Math.abs(hash) % destinationGradients.length];
}

const statusConfig = {
  draft: { label: 'Planning', icon: Clock, variant: 'warning' as const },
  completed: { label: 'Planned', icon: CheckCircle2, variant: 'success' as const },
  archived: { label: 'Archived', icon: Archive, variant: 'default' as const },
};

const budgetConfig = {
  Low: { label: 'Budget', variant: 'info' as const },
  Medium: { label: 'Mid-range', variant: 'purple' as const },
  High: { label: 'Luxury', variant: 'warning' as const },
};

interface TripCardProps {
  trip: Trip;
  onDelete: (trip: Trip) => void;
  index?: number;
}

export function TripCard({ trip, onDelete, index = 0 }: TripCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const gradient = getGradient(trip.destination);
  const status = statusConfig[trip.status];
  const budget = budgetConfig[trip.budgetTier];
  const StatusIcon = status.icon;

  const completedActivities = trip.itinerary
    .flatMap((d) => d.activities)
    .filter((a) => a.completed).length;

  const totalActivities = trip.itinerary
    .flatMap((d) => d.activities).length;

  const progress = totalActivities > 0
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  const hasItinerary = trip.itinerary.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Destination banner */}
      <div
        className={cn(
          'relative h-40 sm:h-44 bg-gradient-to-br cursor-pointer',
          gradient
        )}
        onClick={() => router.push(ROUTES.TRIP(trip._id))}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Destination text */}
        <div className="absolute inset-0 flex items-end p-4">
          <div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
              <MapPin className="w-3 h-3" />
              <span>Destination</span>
            </div>
            <h3 className="text-white font-bold text-xl leading-tight line-clamp-1">
              {trip.destination}
            </h3>
          </div>
        </div>

        {/* Status badge top-right */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white text-xs">
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
        </div>

        {/* AI badge if itinerary exists */}
        {hasItinerary && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-white text-xs">
              <Sparkles className="w-3 h-3" />
              AI planned
            </div>
          </div>
        )}

        {/* Arrow on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Card body */}
      <div
        className="flex-1 p-5 cursor-pointer"
        onClick={() => router.push(ROUTES.TRIP(trip._id))}
      >
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant={budget.variant} size="sm">
            {budget.label}
          </Badge>
          <Badge variant="default" size="sm">
            <Calendar className="w-3 h-3" />
            {trip.durationDays}d
          </Badge>
          {trip.interests.slice(0, 2).map((interest) => (
            <Badge key={interest} variant="default" size="sm">
              {interest}
            </Badge>
          ))}
          {trip.interests.length > 2 && (
            <Badge variant="default" size="sm">
              +{trip.interests.length - 2}
            </Badge>
          )}
        </div>

        {/* Budget */}
        {trip.estimatedBudget.total > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-4">
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">
              ₹{trip.estimatedBudget.total.toLocaleString()}
            </span>
            <span className="text-slate-400">estimated</span>
          </div>
        )}

        {/* Progress bar (only if has activities) */}
        {totalActivities > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{completedActivities}/{totalActivities} activities</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              />
            </div>
          </div>
        )}

        {/* No itinerary hint */}
        {!hasItinerary && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Ready to generate AI itinerary
          </p>
        )}
      </div>

      {/* Card footer */}
      <div className="px-5 pb-5 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {new Date(trip.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
            onClick={(e) => {
              e.stopPropagation();
              router.push(ROUTES.TRIP(trip._id));
            }}
          >
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
}