import { z } from 'zod';

export const generateItinerarySchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
});

export const regenerateDaySchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  dayNumber: z.coerce.number().min(1, 'Day number must be at least 1'),
  feedback: z
    .string()
    .min(1, 'Feedback is required')
    .max(500, 'Feedback must not exceed 500 characters')
    .default('Regenerate with different activities'),
});

export const optimizeBudgetSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  targetBudgetUSD: z
    .number()
    .min(1, 'Target budget must be at least $1'),
});

export const chatSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message must not exceed 1000 characters'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .max(20, 'History cannot exceed 20 messages')
    .default([]),
});

export const packingListSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
});

export type GenerateItineraryInput = z.infer<typeof generateItinerarySchema>;
export type RegenerateDayInput = z.infer<typeof regenerateDaySchema>;
export type OptimizeBudgetInput = z.infer<typeof optimizeBudgetSchema>;
export type ChatInput = z.infer<typeof chatSchema>;

export const validateGenerateItinerary = (data: unknown) =>
  generateItinerarySchema.safeParse(data);

export const validateRegenerateDay = (data: unknown) =>
  regenerateDaySchema.safeParse(data);

export const validateOptimizeBudget = (data: unknown) =>
  optimizeBudgetSchema.safeParse(data);

export const validateChat = (data: unknown) =>
  chatSchema.safeParse(data);

export const validatePackingList = (data: unknown) =>
  packingListSchema.safeParse(data);