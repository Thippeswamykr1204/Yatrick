'use client';

import { Trip } from '@/types/models';
import { TripCard } from './TripCard';
import { TripCardSkeleton } from '@/components/common/Skeleton';

interface TripGridProps {
  trips: Trip[];
  isLoading: boolean;
  onDelete: (trip: Trip) => void;
}

export function TripGrid({ trips, isLoading, onDelete }: TripGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {trips.map((trip, index) => (
        <TripCard
          key={trip._id}
          trip={trip}
          index={index}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}