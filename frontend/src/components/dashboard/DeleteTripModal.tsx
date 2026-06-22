'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Trip } from '@/types/models';
import { Button } from '@/components/common/Button';

interface DeleteTripModalProps {
  trip: Trip | null;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTripModal({
  trip,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteTripModalProps) {
  return (
    <AnimatePresence>
      {isOpen && trip && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200 shadow-[0_25px_80px_rgba(15,23,42,0.15)] z-50 p-6 sm:p-7"
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-lg
                         text-slate-400 hover:text-slate-600 hover:bg-slate-100
                         transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200
                            flex items-center justify-center mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">
              Delete trip?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              <span className="text-sm leading-relaxed text-slate-500 mb-7">
                {trip.destination}
              </span>{' '}
              will be permanently deleted. This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onCancel}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={onConfirm}
                loading={isDeleting}
                icon={!isDeleting ? <Trash2 className="w-4 h-4" /> : undefined}
                className="flex-1"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}