'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from '@/hooks/useTrips';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { TripGrid } from '@/components/dashboard/TripGrid';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { DeleteTripModal } from '@/components/dashboard/DeleteTripModal';
import { Button } from '@/components/common/Button';
import { Trip } from '@/types/models';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const { trips, stats, isLoading, isDeleting, deleteTrip } =
    useTrips({});

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    await deleteTrip(tripToDelete._id);
    setTripToDelete(null);
  };

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';

    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-10 space-y-6 sm:space-y-8">
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {stats?.totalTrips === 0
              ? 'Start planning your first adventure'
              : `You have ${stats?.totalTrips ?? '–'} trip${stats?.totalTrips !== 1 ? 's' : ''} planned`}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push(ROUTES.CREATE_TRIP)}
          className="shadow-lg shadow-orange-500/20"
        >
          New trip
        </Button>
      </motion.div>

      {/* ── Stats bar ── */}
      <StatsBar stats={stats} isLoading={isLoading} />

      {/* ── Trip grid / empty state ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {!isLoading && trips.length === 0 ? (
          <EmptyState />
        ) : (
          <TripGrid
            trips={trips}
            isLoading={isLoading}
            onDelete={(trip) => setTripToDelete(trip)}
          />
        )}
      </motion.div>

      {/* ── Delete modal ── */}
      <DeleteTripModal
        trip={tripToDelete}
        isOpen={!!tripToDelete}
        isDeleting={!!isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTripToDelete(null)}
      />
    </div>
  );
}