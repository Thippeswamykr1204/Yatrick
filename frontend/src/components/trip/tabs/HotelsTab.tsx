'use client';

import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Wifi,
  Coffee,
  Dumbbell,
  Waves,
  IndianRupee,
} from 'lucide-react';
import { Trip } from '@/types/models';
import { Badge } from '@/components/common/Badge';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { cn } from '@/lib/cn';

const tierConfig = {
  Budget: {
    variant: 'info' as const,
    color: 'from-sky-500 via-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  'Mid-Range': {
    variant: 'purple' as const,
    color: 'from-violet-500 via-indigo-500 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
  Luxury: {
    variant: 'warning' as const,
    color: 'from-orange-500 via-amber-500 to-yellow-500',
    glow: 'shadow-orange-500/20',
  },
};

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Wifi: Wifi,
  Breakfast: Coffee,
  Pool: Waves,
  Gym: Dumbbell,
  Restaurant: Coffee,
};

interface HotelsTabProps {
  trip: Trip;
}

export function HotelsTab({ trip }: HotelsTabProps) {
  if (!trip.hotels.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <MapPin className="h-6 w-6 text-orange-500" />
          </div>

          <p className="text-sm font-medium text-slate-600">
            No hotel suggestions yet. Generate an itinerary first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {trip.hotels.map((hotel, index) => {
        const tier = tierConfig[hotel.tier] ?? tierConfig['Mid-Range'];
        const nights = trip.durationDays;
        const total = hotel.estimatedCostPerNightUSD * nights;

        return (
          <motion.div
            key={index}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            className={cn(
              'group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300',
              'hover:border-orange-200 hover:shadow-2xl',
              tier.glow
            )}
          >
            {/* Header */}
            <div
              className={cn(
                'relative h-32 overflow-hidden bg-gradient-to-br',
                tier.color
              )}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />
              </div>

              <div className="absolute left-4 top-4">
                <Badge variant={tier.variant} size="sm">
                  {hotel.tier}
                </Badge>
              </div>

              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                <span className="text-xs font-semibold text-white">
                  {hotel.rating}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 backdrop-blur-md">
                  <IndianRupee className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium text-white">
                    ₹{hotel.estimatedCostPerNightUSD}/night
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-4">
                <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
                  {hotel.name}
                </h3>

                {hotel.address && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <span className="line-clamp-2">
                      {hotel.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Per Night
                    </p>

                    <div className="mt-1 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-slate-900" />
                      <span className="text-2xl font-bold text-slate-900">
                        {hotel.estimatedCostPerNightUSD.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Total Stay
                    </p>

                    <p className="mt-1 text-sm font-semibold text-orange-600">
                      ₹{total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amenities
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity];

                      return (
                        <div
                          key={amenity}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {Icon && <Icon className="h-3.5 w-3.5" />}
                          {amenity}
                        </div>
                      );
                    })}

                    {hotel.amenities.length > 4 && (
                      <div className="inline-flex items-center rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">
                        +{hotel.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}