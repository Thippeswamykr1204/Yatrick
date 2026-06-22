import { Request, Response, NextFunction } from 'express';
import {
  generateItinerary,
  regenerateDay,
  optimizeBudget,
  chatWithAssistant,
  generatePackingList,
} from '@/services/ai.service.js';
import { getTripById, updateTrip } from '@/services/trips.service.js';
import {
  validateRegenerateDay,
  validateOptimizeBudget,
  validateChat,
} from '@/validators/ai.validators.js';
import { sendSuccess } from '@/utils/apiResponse.js';
import { ValidationError, NotFoundError } from '@/utils/errors.js';
import logger from '@/utils/logger.js';

/**
 * Generate full AI itinerary for a trip
 * POST /api/ai/generate/:tripId
 */
export const generateTripItinerary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) throw new Error('User not authenticated');

    const { tripId } = req.params;

    // Get trip (validates ownership)
    const trip = await getTripById(req.user.id, tripId);

    // Generate AI itinerary
    const aiResult = await generateItinerary({
      destination: trip.destination,
      durationDays: trip.durationDays,
      budgetTier: trip.budgetTier,
      interests: trip.interests,
    });

    // Save generated data to trip
    const updatedTrip = await updateTrip(req.user.id, tripId, {
      itinerary: aiResult.itinerary,
      hotels: aiResult.hotels,
      estimatedBudget: aiResult.estimatedBudget,
      packingList: aiResult.packingList,
      status: 'completed',
    });

    sendSuccess(res, updatedTrip, 'Itinerary generated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Regenerate a specific day
 * POST /api/ai/regenerate-day
 * Body: { tripId, dayNumber, feedback }
 */
export const regenerateTripDay = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) throw new Error('User not authenticated');

    const validation = validateRegenerateDay(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    const { tripId, dayNumber, feedback } = validation.data;

    // Get trip (validates ownership)
    const trip = await getTripById(req.user.id, tripId);

    // Validate day number exists
    const dayExists = trip.itinerary.some((d) => d.dayNumber === dayNumber);
    if (!dayExists) {
      throw new ValidationError(`Day ${dayNumber} does not exist in this trip`);
    }

    // Regenerate the specific day
    const newDay = await regenerateDay(trip, dayNumber, feedback);

    // Update the itinerary with the new day
    const updatedItinerary = trip.itinerary.map((day) =>
      day.dayNumber === dayNumber ? { ...day, activities: newDay.activities } : day
    );

    const updatedTrip = await updateTrip(req.user.id, tripId, {
      itinerary: updatedItinerary as any,
    });

    sendSuccess(res, updatedTrip, `Day ${dayNumber} regenerated successfully`, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Optimize trip budget
 * POST /api/ai/optimize-budget
 * Body: { tripId, targetBudgetUSD }
 */
export const optimizeTripBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) throw new Error('User not authenticated');

    const validation = validateOptimizeBudget(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    const { tripId, targetBudgetUSD } = validation.data;

    // Get trip (validates ownership)
    const trip = await getTripById(req.user.id, tripId);

    // Optimize budget using AI
    const optimization = await optimizeBudget(trip, targetBudgetUSD);

    sendSuccess(res, optimization, 'Budget optimized successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Chat with AI trip assistant
 * POST /api/ai/chat
 * Body: { tripId, message, history? }
 */
export const chatWithTripAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) throw new Error('User not authenticated');

    const validation = validateChat(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    const { tripId, message, history } = validation.data;

    // Get trip (validates ownership)
    const trip = await getTripById(req.user.id, tripId);

    // Chat with AI assistant
    const reply = await chatWithAssistant(trip, message, history);

    sendSuccess(
      res,
      { message: reply, role: 'model' },
      'Response generated successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Generate weather-aware packing list
 * POST /api/ai/packing-list/:tripId
 */
export const generateTripPackingList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) throw new Error('User not authenticated');

    const { tripId } = req.params;

    // Get trip (validates ownership)
    const trip = await getTripById(req.user.id, tripId);

    // Generate packing list
    const packingList = await generatePackingList(trip);

    // Save to trip
    const updatedTrip = await updateTrip(req.user.id, tripId, {
      packingList: packingList as any,
    });

    sendSuccess(res, updatedTrip, 'Packing list generated successfully', 200);
  } catch (error) {
    next(error);
  }
};