'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map, Hotel, Wallet, Luggage, MessageCircle,
} from 'lucide-react';
import { Trip } from '@/types/models';
import { ItineraryTab } from './tabs/ItineraryTab';
import { HotelsTab }    from './tabs/HotelsTab';
import { BudgetTab }    from './tabs/BudgetTab';
import { PackingTab }   from './tabs/PackingTab';
import { AssistantTab } from './tabs/AssistantTab';
import { cn } from '@/lib/cn';

const TABS = [
  { id: 'itinerary', label: 'Itinerary',  icon: Map           },
  { id: 'hotels',    label: 'Hotels',     icon: Hotel         },
  { id: 'budget',    label: 'Budget',     icon: Wallet        },
  { id: 'packing',   label: 'Packing',    icon: Luggage       },
  { id: 'assistant', label: 'AI Chat',    icon: MessageCircle },
] as const;

type TabId = typeof TABS[number]['id'];

interface TripTabsProps {
  trip: Trip;
  onTripUpdate: (trip: Trip) => void;
  onRefetch: () => void;
}

export function TripTabs({ trip, onTripUpdate, onRefetch }: TripTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {/* Tab bar */}
      <div
  className="
    sticky top-4 z-20
    flex items-center gap-2
    p-2
    rounded-3xl
    bg-white/80
    backdrop-blur-xl
    border border-slate-200/70
    shadow-lg
    mb-8
    overflow-x-auto
  "
>
        {TABS.map((tab) => {
          const Icon    = tab.icon;
          const active  = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-xl',
                'text-sm font-medium whitespace-nowrap transition-all duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                active
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              )}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
  layoutId="active-tab"
  className="
    absolute inset-0
    rounded-2xl
    bg-gradient-to-r
    from-orange-500
    to-orange-600
    bg-white/90
    shadow-xl
  shadow-slate-200/60
  "
/>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === 'itinerary' && (
          <ItineraryTab trip={trip} onTripUpdate={onTripUpdate} />
        )}
        {activeTab === 'hotels' && <HotelsTab trip={trip} />}
        {activeTab === 'budget'  && <BudgetTab trip={trip} />}
        {activeTab === 'packing' && (
          <PackingTab trip={trip} onTripUpdate={onTripUpdate} />
        )}
        {activeTab === 'assistant' && <AssistantTab trip={trip} />}
      </motion.div>
    </motion.div>
  );
}