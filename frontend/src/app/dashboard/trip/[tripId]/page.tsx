'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTrip } from '@/hooks/useTrips';
import { TripHero } from '@/components/trip/TripHero';
import { TripTabs } from '@/components/trip/TripTabs';
import { Button } from '@/components/common/Button';
import { DashboardSkeleton } from '@/components/common/Skeleton';
import { ROUTES } from '@/lib/constants';

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export default function TripDetailPage({ params }: PageProps) {
  const { tripId } = use(params);
  const router = useRouter();
  const { trip, isLoading, isGenerating, refetch, generateItinerary, updateTrip } =
    useTrip(tripId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="text-center py-24">
          <p className="text-slate-500 mb-4">Trip not found.</p>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.DASHBOARD)}
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          className="rounded-xl"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push(ROUTES.DASHBOARD)}
        >
          All trips
        </Button>
      </motion.div>

      {/* Hero */}
      <TripHero
        trip={trip}
        isGenerating={isGenerating}
        onGenerate={generateItinerary}
      />

      {/* Tabs */}
      <TripTabs
        trip={trip}
        onTripUpdate={updateTrip}
        onRefetch={refetch}
      />
    </div>
  );
}