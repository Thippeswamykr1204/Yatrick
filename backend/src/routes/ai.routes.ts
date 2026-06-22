import { Router } from 'express';
import {
  generateTripItinerary,
  regenerateTripDay,
  optimizeTripBudget,
  chatWithTripAssistant,
  generateTripPackingList,
} from '@/controllers/ai.controller.js';
import { verifyAuth } from '@/middleware/auth.middleware.js';
import { asyncHandler } from '@/middleware/errorHandler.js';

const router = Router();

// All AI routes require authentication
router.use(verifyAuth);

/**
 * Generate full AI itinerary for a trip
 * POST /api/ai/generate/:tripId
 */
router.post('/generate/:tripId', asyncHandler(generateTripItinerary));

/**
 * Regenerate a specific day
 * POST /api/ai/regenerate-day
 * Body: { tripId, dayNumber, feedback }
 */
router.post('/regenerate-day', asyncHandler(regenerateTripDay));

/**
 * Optimize trip budget
 * POST /api/ai/optimize-budget
 * Body: { tripId, targetBudgetUSD }
 */
router.post('/optimize-budget', asyncHandler(optimizeTripBudget));

/**
 * Chat with AI trip assistant
 * POST /api/ai/chat
 * Body: { tripId, message, history? }
 */
router.post('/chat', asyncHandler(chatWithTripAssistant));

/**
 * Generate weather-aware packing list
 * POST /api/ai/packing-list/:tripId
 */
router.post('/packing-list/:tripId', asyncHandler(generateTripPackingList));

export default router;