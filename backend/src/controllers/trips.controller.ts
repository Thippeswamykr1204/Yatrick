import { Request, Response, NextFunction } from 'express';
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripStats,
} from '@/services/trips.service.js';
import {
  validateCreateTrip,
  validateUpdateTrip,
  validateQuery,
} from '@/validators/trips.validators.js';
import { sendSuccess, sendError, sendPaginated } from '@/utils/apiResponse.js';
import { ValidationError, NotFoundError } from '@/utils/errors.js';
import logger from '@/utils/logger.js';

/**
 * Create a new trip
 * POST /api/trips
 */
export const createNewTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    // Validate input
    const validation = validateCreateTrip(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({
          ...acc,
          [err.path[0]]: err.message,
        }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    // Convert string dates to Date objects
    const tripData = {
      ...validation.data,
      startDate: validation.data.startDate ? new Date(validation.data.startDate) : undefined,
      endDate: validation.data.endDate ? new Date(validation.data.endDate) : undefined,
    };

    // Create trip
    const trip = await createTrip(req.user.id, tripData);

    sendSuccess(res, trip, 'Trip created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips for current user
 * GET /api/trips
 */
export const getAllTrips = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    // Validate query parameters
    const validation = validateQuery(req.query);
    if (!validation.success) {
      throw new ValidationError('Invalid query parameters');
    }

    const { page, limit, status, sortBy, sortOrder } = validation.data;

    // Get trips
    const result = await getUserTrips(
      req.user.id,
      page,
      limit,
      status,
      sortBy,
      sortOrder
    );

    sendPaginated(res, result.trips, result.total, result.page, result.limit);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single trip by ID
 * GET /api/trips/:tripId
 */
export const getSingleTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    const { tripId } = req.params;

    // Get trip
    const trip = await getTripById(req.user.id, tripId);

    sendSuccess(res, trip, 'Trip fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a trip
 * PUT /api/trips/:tripId
 */
export const updateExistingTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    const { tripId } = req.params;

    // Validate input
    const validation = validateUpdateTrip(req.body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce(
        (acc, err) => ({
          ...acc,
          [err.path[0]]: err.message,
        }),
        {}
      );
      throw new ValidationError('Validation failed', errors);
    }

    // Convert string dates to Date objects
    const tripData = {
      ...validation.data,
      startDate: validation.data.startDate ? new Date(validation.data.startDate) : undefined,
      endDate: validation.data.endDate ? new Date(validation.data.endDate) : undefined,
    };

    // Update trip
    const trip = await updateTrip(req.user.id, tripId, tripData);

    sendSuccess(res, trip, 'Trip updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a trip
 * DELETE /api/trips/:tripId
 */
export const deleteExistingTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    const { tripId } = req.params;

    // Delete trip
    await deleteTrip(req.user.id, tripId);

    sendSuccess(res, null, 'Trip deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get trip statistics
 * GET /api/trips/stats/overview
 */
export const getTripStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }

    // Get stats
    const stats = await getTripStats(req.user.id);

    sendSuccess(res, stats, 'Trip statistics fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};