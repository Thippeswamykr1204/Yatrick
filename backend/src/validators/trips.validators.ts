import { z } from 'zod';

const activitySchema = z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .min(1, 'Activity title is required')
    .max(200, 'Activity title must not exceed 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  estimatedCostUSD: z
    .number()
    .min(0, 'Cost cannot be negative')
    .default(0),
  timeOfDay: z
    .enum(['Morning', 'Afternoon', 'Evening'])
    .default('Morning'),
  location: z.string().optional(),
  completed: z.boolean().default(false),
});

const itineraryDaySchema = z.object({
  dayNumber: z
    .number()
    .min(1, 'Day number must be at least 1'),
  activities: z.array(activitySchema).default([]),
});

const hotelSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(1, 'Hotel name is required')
    .max(200, 'Hotel name must not exceed 200 characters'),
  tier: z.enum(['Budget', 'Mid-Range', 'Luxury']),
  estimatedCostPerNightUSD: z
    .number()
    .min(0, 'Cost cannot be negative'),
  rating: z
    .number()
    .min(0, 'Rating cannot be less than 0')
    .max(5, 'Rating cannot exceed 5'),
  address: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

const budgetSchema = z.object({
  transport: z.number().min(0).default(0),
  accommodation: z.number().min(0).default(0),
  food: z.number().min(0).default(0),
  activities: z.number().min(0).default(0),
  total: z.number().min(0).default(0),
});

const packingItemSchema = z.object({
  _id: z.string().optional(),
  item: z
    .string()
    .min(1, 'Item name is required')
    .max(100, 'Item name must not exceed 100 characters'),
  category: z.enum(['Documents', 'Clothing', 'Gear', 'Toiletries', 'Other']),
  isPacked: z.boolean().default(false),
  weatherRelevant: z.boolean().optional(),
});

export const createTripSchema = z.object({
  destination: z
    .string()
    .min(1, 'Destination is required')
    .max(100, 'Destination must not exceed 100 characters'),
  durationDays: z
    .number()
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration cannot exceed 365 days'),
  budgetTier: z.enum(['Low', 'Medium', 'High']),
  interests: z
    .array(z.string())
    .max(20, 'Cannot have more than 20 interests')
    .default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = z.object({
  destination: z.string().max(100).optional(),
  durationDays: z
    .number()
    .min(1)
    .max(365)
    .optional(),
  budgetTier: z.enum(['Low', 'Medium', 'High']).optional(),
  interests: z.array(z.string()).max(20).optional(),
  itinerary: z.array(itineraryDaySchema).optional(),
  hotels: z.array(hotelSchema).optional(),
  estimatedBudget: budgetSchema.optional(),
  packingList: z.array(packingItemSchema).optional(),
  status: z.enum(['draft', 'completed', 'archived']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),  
});

export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['draft', 'completed', 'archived']).optional(),
  sortBy: z.enum(['createdAt', 'destination', 'durationDays']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type QueryInput = z.infer<typeof querySchema>;

export const validateCreateTrip = (data: unknown) => {
  return createTripSchema.safeParse(data);
};

export const validateUpdateTrip = (data: unknown) => {
  return updateTripSchema.safeParse(data);
};

export const validateQuery = (data: unknown) => {
  return querySchema.safeParse(data);
};