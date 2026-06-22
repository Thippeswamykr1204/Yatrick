'use client';

import { motion } from 'framer-motion';
import { Globe, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { TripStats } from '@/types/models';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { Skeleton } from '@/components/common/Skeleton';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, color, bg }: StatCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className="group bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex items-center gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-none"
        >
          {value}
        </motion.p>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex items-center  gap-4">
      <Skeleton width="40px" height="40px" rounded="lg" />
      <div className="space-y-2">
        <Skeleton width="48px" height="28px" />
        <Skeleton width="80px" height="12px" />
      </div>
    </div>
  );
}

interface StatsBarProps {
  stats: TripStats | null;
  isLoading: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  const items = [
    {
      icon: Globe,
      label: 'Total trips',
      value: stats?.totalTrips ?? 0,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Calendar,
      label: 'Days planned',
      value: stats?.totalDaysPlanned ?? 0,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'In progress',
      value: stats?.draftTrips ?? 0,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: stats?.completedTrips ?? 0,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </motion.div>
  );
}