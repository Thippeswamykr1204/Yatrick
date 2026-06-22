'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RefreshCw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/cn';

interface RegenerateDayModalProps {
  isOpen: boolean;
  dayNumber: number;
  isRegenerating: boolean;
  onConfirm: (feedback: string) => Promise<void>;
  onClose: () => void;
}

const QUICK_FEEDBACK = [
  'More outdoor activities',
  'Focus on food & dining',
  'Add cultural experiences',
  'Include adventure sports',
  'Budget-friendly options',
  'Relaxed pace, fewer stops',
];

export function RegenerateDayModal({
  isOpen,
  dayNumber,
  isRegenerating,
  onConfirm,
  onClose,
}: RegenerateDayModalProps) {
  const [feedback, setFeedback] =
    useState('');

  useEffect(() => {
    if (!isOpen) {
      setFeedback('');
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    const text =
      feedback.trim() ||
      'Regenerate with different activities';

    await onConfirm(text);
    setFeedback('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Center Wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
              className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 via-white to-white px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                      <RefreshCw className="h-6 w-6 text-orange-600" />
                    </div>

                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                        Day {dayNumber}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        Regenerate Itinerary
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Tell AI what you'd like changed and receive a refreshed
                        itinerary.
                      </p>
                    </div>
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
              <div className="px-6 py-6">
                {/* Suggestions */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-orange-500" />

                    <p className="text-sm font-semibold text-slate-700">
                      Quick Suggestions
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {QUICK_FEEDBACK.map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setFeedback(
                              option
                            )
                          }
                          className={cn(
                            'rounded-full border px-3 py-2 text-xs font-medium transition-all',
                            feedback === option
                              ? 'border-orange-300 bg-orange-50 text-orange-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50'
                          )}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Custom Feedback */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Custom Instructions
                  </label>

                  <textarea
                    rows={5}
                    value={feedback}
                    onChange={(e) =>
                      setFeedback(
                        e.target.value
                      )
                    }
                    placeholder="e.g. More hiking, less shopping. Include local food experiences and avoid crowded tourist attractions."
                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm transition-all placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                  />

                  <div className="mt-2 flex justify-between">
                    <p className="text-xs text-slate-400">
                      Optional feedback helps AI generate better results.
                    </p>

                    <span className="text-xs text-slate-400">
                      {feedback.length}/500
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-orange-500" />

                    <p className="text-sm text-orange-700">
                      AI will create a new set of activities while keeping your
                      overall trip structure intact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    size="md"
                    disabled={isRegenerating}
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    loading={isRegenerating}
                    icon={
                      !isRegenerating ? (
                        <Sparkles className="h-4 w-4" />
                      ) : undefined
                    }
                    onClick={handleConfirm}
                    className="flex-1"
                  >
                    {isRegenerating
                      ? 'Regenerating...'
                      : 'Regenerate Day'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}