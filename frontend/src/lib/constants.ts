export const APP_NAME = 'Yatrik';
export const APP_TAGLINE = 'Plan. Explore. Travel.';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  CREATE_TRIP: '/dashboard/create-trip',
  TRIP: (id: string) => `/dashboard/trip/${id}`,
} as const;

export const BUDGET_TIERS = [
  {
    value: 'Low',
    label: 'Budget',
    description: 'Dharamshalas, dhabas, state buses & free ghats',
    icon: '💰',
    range: 'Under ₹1,500/day',
  },
  {
    value: 'Medium',
    label: 'Mid-Range',
    description: 'Hotels, local restaurants, auto & tempo traveller',
    icon: '💳',
    range: '₹2,500–₹5,000/day',
  },
  {
    value: 'High',
    label: 'Luxury',
    description: 'Heritage hotels, fine dining, private cabs & flights',
    icon: '💎',
    range: '₹8,000+/day',
  },
] as const;

export const INTERESTS = [
  { value: 'Food',         label: 'Street Food & Cuisine', icon: '🍛' },
  { value: 'Culture',      label: 'Culture & Heritage',    icon: '🏛️' },
  { value: 'Adventure',    label: 'Trekking & Adventure',  icon: '🧗' },
  { value: 'Shopping',     label: 'Markets & Shopping',    icon: '🛍️' },
  { value: 'Nature',       label: 'Hills & Nature',        icon: '🌿' },
  { value: 'Spiritual',    label: 'Temples & Spirituality',icon: '🛕' },
  { value: 'Wildlife',     label: 'Wildlife & Safari',     icon: '🐯' },
  { value: 'Beaches',      label: 'Beaches & Coastal',     icon: '🏖️' },
  { value: 'Photography',  label: 'Photography & Reels',   icon: '📸' },
  { value: 'Architecture', label: 'Forts & Monuments',     icon: '🏯' },
] as const;

export const TOKEN_KEY = 'atp_access_token';
export const USER_KEY = 'atp_user';