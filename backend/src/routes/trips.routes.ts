import { Router } from 'express';
import {
  createNewTrip,
  getAllTrips,
  getSingleTrip,
  updateExistingTrip,
  deleteExistingTrip,
  getTripStatistics,
} from '@/controllers/trips.controller.js';
import { verifyAuth } from '@/middleware/auth.middleware.js';
import { asyncHandler } from '@/middleware/errorHandler.js';

const router = Router();

/**
 * All trip routes are protected (require authentication)
 */
router.use(verifyAuth);

/**
 * Trip Statistics
 * GET /api/trips/stats/overview
 * Returns: { totalTrips, draftTrips, completedTrips, archivedTrips, totalDaysPlanned }
 */
router.get('/stats/overview', asyncHandler(getTripStatistics));

/**
 * Create a new trip
 * POST /api/trips
 * Body: { destination, durationDays, budgetTier, interests?, startDate?, endDate? }
 */
router.post('/', asyncHandler(createNewTrip));

/**
 * Get all trips for current user (with pagination)
 * GET /api/trips
 * Query: page=1, limit=10, status?, sortBy?, sortOrder?
 */
router.get('/', asyncHandler(getAllTrips));

/**
 * Get a single trip by ID
 * GET /api/trips/:tripId
 * Ownership validation: User can only access own trips
 */
router.get('/:tripId', asyncHandler(getSingleTrip));

/**
 * Update a trip
 * PUT /api/trips/:tripId
 * Body: { destination?, durationDays?, budgetTier?, interests?, itinerary?, hotels?, estimatedBudget?, packingList?, status?, startDate?, endDate? }
 * Ownership validation: User can only update own trips
 */
router.put('/:tripId', asyncHandler(updateExistingTrip));

/**
 * Delete a trip
 * DELETE /api/trips/:tripId
 * Ownership validation: User can only delete own trips
 */
router.delete('/:tripId', asyncHandler(deleteExistingTrip));

export default router;