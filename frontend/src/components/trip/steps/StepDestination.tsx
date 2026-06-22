'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StepDestinationProps {
  values: {
    destination: string;
    durationDays: number;
    startDate: string;
    endDate: string;
  };
  errors: Partial<Record<string, string>>;
  onChange: (key: string, value: any) => void;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const QUICK_DURATIONS = [3, 5, 7, 10, 14];

const POPULAR = [
  'Rajasthan, India',
  'Kerala, India',
  'Goa, India',
  'Himachal Pradesh, India',
  'Varanasi, India',
  'Leh Ladakh, India',
];

export function StepDestination({
  values,
  errors,
  onChange,
}: StepDestinationProps) {
  const calculateDuration = (
    startDate: string,
    endDate: string
  ): number | null => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();

    if (diffTime < 0) return null;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStartDateChange = (value: string) => {
    onChange('startDate', value);

    const duration = calculateDuration(value, values.endDate);
    if (duration !== null) {
      onChange('durationDays', duration);
    }
  };

  const handleEndDateChange = (value: string) => {
    onChange('endDate', value);

    const duration = calculateDuration(values.startDate, value);
    if (duration !== null) {
      onChange('durationDays', duration);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Destination input */}
      <Field label="Where do you want to go?" error={errors.destination}>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="e.g. Tokyo, Japan"
            value={values.destination}
            onChange={(e) => onChange('destination', e.target.value)}
            autoFocus
            className={cn(
              'w-full h-14 pl-11 pr-4 rounded-2xl border bg-white text-sm',
              'placeholder:text-slate-400 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
              'shadow-sm',
              errors.destination
                ? 'border-red-300'
                : 'border-slate-200 hover:border-slate-300'
            )}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {POPULAR.map((dest) => (
            <button
              key={dest}
              type="button"
              onClick={() => onChange('destination', dest)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200',
                values.destination === dest
                  ? 'bg-orange-50 border-orange-300 text-orange-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
              )}
            >
              {dest}
            </button>
          ))}
        </div>
      </Field>

      {/* Duration */}
      <Field label="How many days?" error={errors.durationDays}>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {QUICK_DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onChange('durationDays', d)}
                className={cn(
                  'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border text-sm font-semibold transition-all duration-200',
                  values.durationDays === d
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50'
                )}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 shrink-0">Custom:</span>

            <input
              type="number"
              min={1}
              max={365}
              value={values.durationDays}
              onChange={(e) =>
                onChange('durationDays', parseInt(e.target.value) || 1)
              }
              className={cn(
                'w-28 h-11 px-3 rounded-xl border text-sm text-center',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
                'border-slate-200 hover:border-slate-300'
              )}
            />

            <span className="text-sm text-slate-500">days</span>
          </div>
        </div>
      </Field>

      {/* Optional dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Start date (optional)">
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="date"
              value={values.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-slate-200
                        text-sm bg-white text-slate-700 shadow-sm
                        hover:border-slate-300 focus:outline-none
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all duration-200"
            />
          </div>
        </Field>

        <Field label="End date (optional)">
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="date"
              value={values.endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={values.startDate || new Date().toISOString().split('T')[0]}
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-slate-200
                        text-sm bg-white text-slate-700 shadow-sm
                        hover:border-slate-300 focus:outline-none
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all duration-200"
            />
          </div>
        </Field>
      </div>
    </motion.div>
  );
}