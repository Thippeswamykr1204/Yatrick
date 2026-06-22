'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  MapPin,
  IndianRupee,
  Sun,
  CloudSun,
  Moon,
} from 'lucide-react';
import { Activity } from '@/types/models';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/cn';

interface ActivityModalProps {
  isOpen: boolean;
  activity?: Activity | null;
  dayNumber: number;
  onSave: (activity: Partial<Activity>) => Promise<void>;
  onClose: () => void;
}

const TIME_OPTIONS = [
  {
    value: 'Morning',
    label: 'Morning',
    icon: Sun,
  },
  {
    value: 'Afternoon',
    label: 'Afternoon',
    icon: CloudSun,
  },
  {
    value: 'Evening',
    label: 'Evening',
    icon: Moon,
  },
] as const;

export function ActivityModal({
  isOpen,
  activity,
  dayNumber,
  onSave,
  onClose,
}: ActivityModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    estimatedCostUSD: 0,
    timeOfDay: 'Morning' as
      | 'Morning'
      | 'Afternoon'
      | 'Evening',
    location: '',
  });

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const isEdit = !!activity;

  useEffect(() => {
    if (activity) {
      setForm({
        title: activity.title,
        description:
          activity.description || '',
        estimatedCostUSD:
          activity.estimatedCostUSD,
        timeOfDay:
          activity.timeOfDay,
        location:
          activity.location || '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        estimatedCostUSD: 0,
        timeOfDay: 'Morning',
        location: '',
      });
    }

    setError('');
  }, [activity, isOpen]);

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError(
        'Activity title is required'
      );
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        ...form,
        completed:
          activity?.completed ??
          false,
      });

      onClose();
    } catch {
      setError(
        'Failed to save activity'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-24px)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 via-white to-white px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                    Day {dayNumber}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {isEdit
                      ? 'Edit Activity'
                      : 'Add Activity'}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Plan your itinerary
                    activity details.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Activity Title
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    autoFocus
                    value={form.title}
                    placeholder="e.g. Visit Senso-ji Temple"
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        title:
                          e.target.value,
                      }));

                      setError('');
                    }}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm transition-all placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    placeholder="Add activity notes, recommendations, or important details..."
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        description:
                          e.target.value,
                      }))
                    }
                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Time of Day
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {TIME_OPTIONS.map(
                      (option) => {
                        const Icon =
                          option.icon;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              setForm(
                                (f) => ({
                                  ...f,
                                  timeOfDay:
                                    option.value,
                                })
                              )
                            }
                            className={cn(
                              'flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition-all',
                              form.timeOfDay ===
                                option.value
                                ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50'
                            )}
                          >
                            <Icon className="h-5 w-5" />

                            <span className="text-sm font-medium">
                              {
                                option.label
                              }
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Cost + Location */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Estimated Cost
                    </label>

                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="number"
                        min={0}
                        value={
                          form.estimatedCostUSD
                        }
                        placeholder="0"
                        onChange={(e) =>
                          setForm(
                            (f) => ({
                              ...f,
                              estimatedCostUSD:
                                parseFloat(
                                  e.target
                                    .value
                                ) || 0,
                            })
                          )
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location
                    </label>

                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={
                          form.location
                        }
                        placeholder="e.g. Asakusa"
                        onChange={(e) =>
                          setForm(
                            (f) => ({
                              ...f,
                              location:
                                e.target
                                  .value,
                            })
                          )
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  size="md"
                  disabled={isSaving}
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  loading={isSaving}
                  icon={
                    !isSaving ? (
                      <Save className="h-4 w-4" />
                    ) : undefined
                  }
                  onClick={handleSave}
                  className="flex-1"
                >
                  {isSaving
                    ? 'Saving...'
                    : isEdit
                    ? 'Save Changes'
                    : 'Add Activity'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}