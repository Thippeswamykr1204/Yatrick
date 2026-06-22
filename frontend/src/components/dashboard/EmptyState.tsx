'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/lib/constants';

export function EmptyState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-2 sm:py-6 px-4 text-center"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-[28px] bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 border border-orange-200 flex items-center justify-center mx-auto shadow-xl shadow-orange-500/10">
          <Globe className="w-14 h-14 text-orange-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      {/* Copy */}
      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
        No trips yet
      </h3>
      <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
        Create your first AI-powered trip and get a complete
        day-by-day itinerary in seconds.
      </p>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        className="bg-orange-500 hover:bg-orange-400 shadow-xl shadow-orange-500/20"
        icon={<Plus className="w-4 h-4" />}
        onClick={() => router.push(ROUTES.CREATE_TRIP)}
      >
        Plan your first trip
      </Button>

      {/* Feature hints */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full">
        {[
          { emoji: '🗺️', text: 'Day-by-day itineraries' },
          { emoji: '💰', text: 'Budget estimation' },
          { emoji: '🏨', text: 'Hotel suggestions' },
        ].map((hint) => (
          <div
            key={hint.text}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm text-slate-600"
          >
            <span>{hint.emoji}</span>
            <span>{hint.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}