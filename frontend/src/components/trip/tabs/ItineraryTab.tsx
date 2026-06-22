'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Circle,
  MapPin,
  IndianRupee,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Trip, Activity, ItineraryDay } from '@/types/models';
import { tripsService } from '@/services/trips.service';
import { useToast } from '@/store/uiStore';
import { ActivityModal } from '../modals/ActivityModal';
import { RegenerateDayModal } from '../modals/RegenerateDayModal';
import { cn } from '@/lib/cn';

const timeColors = {
  Morning:
    'bg-amber-50 text-amber-700 border-amber-200',
  Afternoon:
    'bg-sky-50 text-sky-700 border-sky-200',
  Evening:
    'bg-violet-50 text-violet-700 border-violet-200',
};

interface ItineraryTabProps {
  trip: Trip;
  onTripUpdate: (trip: Trip) => void;
}

export function ItineraryTab({
  trip,
  onTripUpdate,
}: ItineraryTabProps) {
  const toast = useToast();

  const [activityModal, setActivityModal] = useState<{
    open: boolean;
    dayNumber: number;
    activity: Activity | null;
    activityIndex: number;
  }>({
    open: false,
    dayNumber: 1,
    activity: null,
    activityIndex: -1,
  });

  const [regenModal, setRegenModal] = useState<{
    open: boolean;
    dayNumber: number;
  }>({
    open: false,
    dayNumber: 1,
  });

  const [isRegenerating, setIsRegenerating] =
    useState(false);

  const toggleActivity = async (
    dayNumber: number,
    activityIndex: number
  ) => {
    const newItinerary = trip.itinerary.map((day) => {
      if (day.dayNumber !== dayNumber) return day;

      return {
        ...day,
        activities: day.activities.map((act, i) =>
          i === activityIndex
            ? {
                ...act,
                completed: !act.completed,
              }
            : act
        ),
      };
    });

    try {
      const updated = await tripsService.update(
        trip._id,
        {
          itinerary: newItinerary as any,
        }
      );

      onTripUpdate(updated);
    } catch {
      toast.error('Failed to update activity');
    }
  };

  const handleAddActivity = async (
    activity: Partial<Activity>
  ) => {
    const { dayNumber } = activityModal;

    const newItinerary = trip.itinerary.map((day) => {
      if (day.dayNumber !== dayNumber) return day;

      return {
        ...day,
        activities: [
          ...day.activities,
          activity as Activity,
        ],
      };
    });

    const updated = await tripsService.update(
      trip._id,
      {
        itinerary: newItinerary as any,
      }
    );

    onTripUpdate(updated);
    toast.success('Activity added');
  };

  const handleEditActivity = async (
    activity: Partial<Activity>
  ) => {
    const { dayNumber, activityIndex } =
      activityModal;

    const newItinerary = trip.itinerary.map((day) => {
      if (day.dayNumber !== dayNumber) return day;

      return {
        ...day,
        activities: day.activities.map((act, i) =>
          i === activityIndex
            ? { ...act, ...activity }
            : act
        ),
      };
    });

    const updated = await tripsService.update(
      trip._id,
      {
        itinerary: newItinerary as any,
      }
    );

    onTripUpdate(updated);
    toast.success('Activity updated');
  };

  const handleDeleteActivity = async (
    dayNumber: number,
    activityIndex: number
  ) => {
    const newItinerary = trip.itinerary.map((day) => {
      if (day.dayNumber !== dayNumber) return day;

      return {
        ...day,
        activities: day.activities.filter(
          (_, i) => i !== activityIndex
        ),
      };
    });

    try {
      const updated = await tripsService.update(
        trip._id,
        {
          itinerary: newItinerary as any,
        }
      );

      onTripUpdate(updated);
      toast.success('Activity removed');
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  const handleRegenerateDay = async (
    feedback: string
  ) => {
    setIsRegenerating(true);

    try {
      const updated =
        await tripsService.regenerateDay(
          trip._id,
          regenModal.dayNumber,
          feedback
        );

      onTripUpdate(updated);

      toast.success(
        `Day ${regenModal.dayNumber} regenerated!`
      );

      setRegenModal({
        open: false,
        dayNumber: 1,
      });
    } catch {
      toast.error(
        'Regeneration failed',
        'Please try again'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  if (trip.itinerary.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50">
            <Sparkles className="h-7 w-7 text-orange-500" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            No itinerary generated yet
          </h3>

          <p className="text-sm text-slate-500">
            Use the Generate Itinerary button
            above to create your personalized
            travel plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {trip.itinerary.map((day, dayIdx) => {
          const dayCompleted =
            day.activities.filter(
              (a) => a.completed
            ).length;

          const dayTotal =
            day.activities.length;

          const dayProgress =
            dayTotal > 0
              ? Math.round(
                  (dayCompleted / dayTotal) * 100
                )
              : 0;

          return (
            <motion.div
              key={day.dayNumber}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: dayIdx * 0.05,
              }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Day Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 via-white to-white px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">
                      <span className="text-sm font-bold text-white">
                        {day.dayNumber}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Day {day.dayNumber}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {dayCompleted}/
                        {dayTotal} completed •{' '}
                        {dayProgress}% progress
                      </p>

                      <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${dayProgress}%`,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setRegenModal({
                          open: true,
                          dayNumber:
                            day.dayNumber,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </button>

                    <button
                      onClick={() =>
                        setActivityModal({
                          open: true,
                          dayNumber:
                            day.dayNumber,
                          activity: null,
                          activityIndex: -1,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600"
                    >
                      <Plus className="h-4 w-4" />
                      Add Activity
                    </button>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div>
                <AnimatePresence>
                  {day.activities.map(
                    (activity, actIdx) => (
                      <motion.div
                        key={actIdx}
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="group border-b border-slate-100 p-5 transition-colors hover:bg-slate-50/60 last:border-0 sm:p-6"
                      >
                        <div className="flex gap-4">
                          <button
                            onClick={() =>
                              toggleActivity(
                                day.dayNumber,
                                actIdx
                              )
                            }
                            className="mt-1 shrink-0"
                          >
                            {activity.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            ) : (
                              <Circle className="h-6 w-6 text-slate-300 transition-colors hover:text-orange-500" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-start gap-2">
                              <h4
                                className={cn(
                                  'text-base font-semibold',
                                  activity.completed
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-900'
                                )}
                              >
                                {activity.title}
                              </h4>

                              <span
                                className={cn(
                                  'rounded-full border px-3 py-1 text-xs font-medium',
                                  timeColors[
                                    activity.timeOfDay
                                  ]
                                )}
                              >
                                {
                                  activity.timeOfDay
                                }
                              </span>
                            </div>

                            {activity.description && (
                              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                                {
                                  activity.description
                                }
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4">
                              {activity.estimatedCostUSD >
                                0 && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                  <IndianRupee className="h-4 w-4 text-orange-500" />
                                  {
                                    activity.estimatedCostUSD
                                  }
                                </div>
                              )}

                              {activity.location && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                  <MapPin className="h-4 w-4 text-orange-500" />
                                  {
                                    activity.location
                                  }
                                </div>
                              )}

                              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <Clock className="h-4 w-4 text-orange-500" />
                                {
                                  activity.timeOfDay
                                }
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-start gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                            <button
                              onClick={() =>
                                setActivityModal(
                                  {
                                    open: true,
                                    dayNumber:
                                      day.dayNumber,
                                    activity,
                                    activityIndex:
                                      actIdx,
                                  }
                                )
                              }
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteActivity(
                                  day.dayNumber,
                                  actIdx
                                )
                              }
                              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>

                {day.activities.length === 0 && (
                  <div className="p-10 text-center">
                    <p className="mb-3 text-sm text-slate-500">
                      No activities planned for
                      this day.
                    </p>

                    <button
                      onClick={() =>
                        setActivityModal({
                          open: true,
                          dayNumber:
                            day.dayNumber,
                          activity: null,
                          activityIndex: -1,
                        })
                      }
                      className="font-medium text-orange-600 transition-colors hover:text-orange-700"
                    >
                      + Add first activity
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <ActivityModal
        isOpen={activityModal.open}
        activity={activityModal.activity}
        dayNumber={activityModal.dayNumber}
        onSave={
          activityModal.activity
            ? handleEditActivity
            : handleAddActivity
        }
        onClose={() =>
          setActivityModal((s) => ({
            ...s,
            open: false,
          }))
        }
      />

      <RegenerateDayModal
        isOpen={regenModal.open}
        dayNumber={regenModal.dayNumber}
        isRegenerating={isRegenerating}
        onConfirm={handleRegenerateDay}
        onClose={() =>
          setRegenModal({
            open: false,
            dayNumber: 1,
          })
        }
      />
    </>
  );
}