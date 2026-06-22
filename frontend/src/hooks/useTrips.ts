'use client';

import { useState, useEffect, useCallback } from 'react';
import { tripsService, TripsQuery } from '@/services/trips.service';
import { Trip, TripStats } from '@/types/models';
import { useToast } from '@/store/uiStore';

export function useTrips(query: TripsQuery = {}) {
  const toast = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tripsResult, statsResult] = await Promise.all([
        tripsService.getAll(query),
        tripsService.getStats(),
      ]);
      setTrips(tripsResult.trips);
      setTotal(tripsResult.total);
      setPages(tripsResult.pages);
      setStats(statsResult);
    } catch (error) {
      toast.error('Failed to load trips', 'Please refresh the page');
    } finally {
      setIsLoading(false);
    }
  }, []);

// After deleting, also reset stats fully by refetching
const deleteTrip = useCallback(async (tripId: string) => {
  try {
    setIsDeleting(tripId);
    await tripsService.delete(tripId);
    // Refetch everything instead of manual state update
    await fetchTrips();
    toast.success('Trip deleted');
  } catch {
    toast.error('Failed to delete trip');
  } finally {
    setIsDeleting(null);
  }
}, [fetchTrips, toast]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    stats,
    isLoading,
    isDeleting,
    total,
    pages,
    refetch: fetchTrips,
    deleteTrip,
  };
}

export function useTrip(tripId: string) {
  const toast = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchTrip = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await tripsService.getById(tripId);
      setTrip(result);
    } catch {
      toast.error('Failed to load trip');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  const generateItinerary = useCallback(async () => {
    try {
      setIsGenerating(true);
      toast.info('Generating itinerary…', 'This may take 10–20 seconds');
      const result = await tripsService.generateItinerary(tripId);
      setTrip(result);
      toast.success('Itinerary generated!', 'Your trip plan is ready');
    } catch {
      toast.error('Generation failed', 'Please try again');
    } finally {
      setIsGenerating(false);
    }
  }, [tripId]);

  const updateTrip = useCallback((updated: Trip) => {
    setTrip(updated);
  }, []);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return {
    trip,
    isLoading,
    isGenerating,
    refetch: fetchTrip,
    generateItinerary,
    updateTrip,
  };
}