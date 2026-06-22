'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, MapPin, Wallet, Hotel, Luggage } from 'lucide-react';

const STEPS = [
  { icon: MapPin, text: 'Planning day-by-day itinerary…', color: 'text-orange-500' },
  { icon: Wallet, text: 'Estimating budget breakdown…', color: 'text-emerald-500' },
  { icon: Hotel, text: 'Finding hotel suggestions…', color: 'text-sky-500' },
  { icon: Luggage, text: 'Building your packing list…', color: 'text-violet-500' },
  { icon: Sparkles, text: 'Polishing your trip plan…', color: 'text-orange-400' },
];

interface GeneratingScreenProps {
  destination: string;
}

export function GeneratingScreen({ destination }: GeneratingScreenProps) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const current = STEPS[stepIdx];
  const StepIcon = current.icon;

  return (
    <div className="
fixed inset-0 z-50
bg-gradient-to-br
from-slate-950
via-slate-900
to-orange-950
flex flex-col
items-center
justify-center
overflow-hidden
px-4
text-center
"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      {/* Animated globe */}
      <div className="relative z-10 mb-10">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-orange-300/40"
        />

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-2 border-dashed border-orange-200/30"
        />

        {/* Globe center */}
        <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 5, -5, 0],
            boxShadow: [
              '0 0 0 rgba(249,115,22,0)',
              '0 0 40px rgba(249,115,22,.35)',
              '0 0 0 rgba(249,115,22,0)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
        >
          <Globe className="w-10 h-10 text-white" />
        </motion.div>
        </div>

        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-3 h-3 rounded-full bg-orange-400 shadow-glow-sm" />
        </motion.div>
      </div>

      {/* Headline */}
<motion.h2
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative z-10 text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl"
>
        Planning your trip to{' '}
        <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">{destination}</span>
      </motion.h2>
      <p className="
relative z-10
text-center
text-3xl sm:text-4xl lg:text-5xl
font-bold
text-white
max-w-3xl
mb-4
">
        Our AI is crafting a personalised itinerary just for you.
        This usually takes 10–20 seconds.
      </p>

      {/* Animated step indicator */}
<div
  className="
    relative z-10
    w-full max-w-md
    rounded-3xl
    border border-white/10
    bg-white/5
    backdrop-blur-2xl
    p-5
  "
>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl
                    bg-white/5 border border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10
                            flex items-center justify-center shrink-0">
              <StepIcon className={`w-4 h-4 ${current.color}`} />
            </div>
            <span className="text-sm text-slate-200 font-medium">
              {current.text}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
animate={{
  width: i === stepIdx ? 28 : 6,
  backgroundColor: i === stepIdx ? '#f97316' : '#334155',
}}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}