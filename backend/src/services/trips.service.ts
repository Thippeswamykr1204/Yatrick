import { Trip, type ITrip } from '@/models/Trip.js';
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  DatabaseError,
} from '@/utils/errors.js';
import logger from '@/utils/logger.js';

interface CreateTripInput {
  destination: string;
  durationDays: number;
  budgetTier: 'Low' | 'Medium' | 'High';
  interests?: string[];
  startDate?: Date;
  endDate?: Date;
}

interface UpdateTripInput {
  destination?: string;
  durationDays?: number;
  budgetTier?: 'Low' | 'Medium' | 'High';
  interests?: string[];
  itinerary?: any[];
  hotels?: any[];
  estimatedBudget?: any;
  packingList?: any[];
  status?: 'draft' | 'completed' | 'archived';
  startDate?: Date;
  endDate?: Date;
}

interface TripListResponse {
  trips: ITrip[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Create a new trip
 */
export const createTrip = async (
  userId: string,
  input: CreateTripInput
): Promise<ITrip> => {
  try {
    const trip = new Trip({
      userId,
      destination: input.destination,
      durationDays: input.durationDays,
      budgetTier: input.budgetTier,
      interests: input.interests || [],
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'draft',
    });

    await trip.save();
    logger.info(`Trip created: ${trip._id} for user ${userId}`);
    return trip;
  } catch (error) {
    logger.error('Error creating trip:', error);
    throw new DatabaseError('Failed to create trip');
  }
};

/**
 * Get all trips for a user with pagination
 */
export const getUserTrips = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  status?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<TripListResponse> => {
  try {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [trips, total] = await Promise.all([
      Trip.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      Trip.countDocuments(query),
    ]);

    return {
      trips,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error('Error fetching user trips:', error);
    throw new DatabaseError('Failed to fetch trips');
  }
};

/**
 * Get a single trip by ID
 */
export const getTripById = async (
  userId: string,
  tripId: string
): Promise<ITrip> => {
  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      throw new NotFoundError('Trip');
    }

    // Verify ownership
    if (trip.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have access to this trip');
    }

    return trip;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    logger.error('Error fetching trip:', error);
    throw new DatabaseError('Failed to fetch trip');
  }
};

/**
 * Update a trip
 */
export const updateTrip = async (
  userId: string,
  tripId: string,
  input: UpdateTripInput
): Promise<ITrip> => {
  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      throw new NotFoundError('Trip');
    }

    // Verify ownership
    if (trip.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have access to this trip');
    }

    // Update fields
    Object.assign(trip, input);

    await trip.save();
    logger.info(`Trip updated: ${tripId}`);
    return trip;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    logger.error('Error updating trip:', error);
    throw new DatabaseError('Failed to update trip');
  }
};

/**
 * Delete a trip
 */
export const deleteTrip = async (
  userId: string,
  tripId: string
): Promise<void> => {
  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      throw new NotFoundError('Trip');
    }

    // Verify ownership
    if (trip.userId.toString() !== userId) {
      throw new ForbiddenError('You do not have access to this trip');
    }

    await Trip.deleteOne({ _id: tripId });
    logger.info(`Trip deleted: ${tripId}`);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    logger.error('Error deleting trip:', error);
    throw new DatabaseError('Failed to delete trip');
  }
};

/**
 * Get trip statistics for user
 */
export const getTripStats = async (userId: string): Promise<{
  totalTrips: number;
  draftTrips: number;
  completedTrips: number;
  archivedTrips: number;
  totalDaysPlanned: number;
}> => {
  try {
    const trips = await Trip.find({ userId });

    return {
      totalTrips: trips.length,
      draftTrips: trips.filter((t) => t.status === 'draft').length,
      completedTrips: trips.filter((t) => t.status === 'completed').length,
      archivedTrips: trips.filter((t) => t.status === 'archived').length,
      totalDaysPlanned: trips.reduce((sum, t) => sum + t.durationDays, 0),
    };
  } catch (error) {
    logger.error('Error getting trip stats:', error);
    throw new DatabaseError('Failed to fetch trip statistics');
  }
};