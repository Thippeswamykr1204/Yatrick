import api from './api';
import { Trip, TripStats } from '@/types/models';
import { PaginatedResponse } from '@/types/api';

export interface CreateTripInput {
  destination: string;
  durationDays: number;
  budgetTier: 'Low' | 'Medium' | 'High';
  interests: string[];
  startDate?: string;
  endDate?: string;
}

export interface UpdateTripInput {
  destination?: string;
  durationDays?: number;
  budgetTier?: 'Low' | 'Medium' | 'High';
  interests?: string[];
  itinerary?: any[];
  hotels?: any[];
  estimatedBudget?: any;
  packingList?: any[];
  status?: 'draft' | 'completed' | 'archived';
}

export interface TripsQuery {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const tripsService = {
  async getAll(query: TripsQuery = {}): Promise<{
    trips: Trip[];
    total: number;
    page: number;
    pages: number;
  }> {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.status) params.set('status', query.status);
    if (query.sortBy) params.set('sortBy', query.sortBy);
    if (query.sortOrder) params.set('sortOrder', query.sortOrder);

    const { data } = await api.get<PaginatedResponse<Trip>>(
      `/trips?${params.toString()}`
    );
    return {
      trips: data.data,
      total: data.pagination.total,
      page: data.pagination.page,
      pages: data.pagination.pages,
    };
  },

  async getById(tripId: string): Promise<Trip> {
    const { data } = await api.get<{ data: Trip }>(`/trips/${tripId}`);
    return data.data;
  },

  async create(input: CreateTripInput): Promise<Trip> {
    const { data } = await api.post<{ data: Trip }>('/trips', input);
    return data.data;
  },

  async update(tripId: string, input: UpdateTripInput): Promise<Trip> {
    const { data } = await api.put<{ data: Trip }>(`/trips/${tripId}`, input);
    return data.data;
  },

  async delete(tripId: string): Promise<void> {
    await api.delete(`/trips/${tripId}`);
  },

  async getStats(): Promise<TripStats> {
    const { data } = await api.get<{ data: TripStats }>('/trips/stats/overview');
    return data.data;
  },

  async generateItinerary(tripId: string): Promise<Trip> {
    const { data } = await api.post<{ data: Trip }>(`/ai/generate/${tripId}`);
    return data.data;
  },

  async regenerateDay(
    tripId: string,
    dayNumber: number,
    feedback: string
  ): Promise<Trip> {
    const { data } = await api.post<{ data: Trip }>('/ai/regenerate-day', {
      tripId,
      dayNumber,
      feedback,
    });
    return data.data;
  },

  async optimizeBudget(
    tripId: string,
    targetBudgetUSD: number
  ): Promise<any> {
    const { data } = await api.post('/ai/optimize-budget', {
      tripId,
      targetBudgetUSD,
    });
    return data.data;
  },

  async chat(
    tripId: string,
    message: string,
    history: any[]
  ): Promise<{ message: string; role: string }> {
    const { data } = await api.post('/ai/chat', { tripId, message, history });
    return data.data;
  },

  async generatePackingList(tripId: string): Promise<Trip> {
    const { data } = await api.post<{ data: Trip }>(
      `/ai/packing-list/${tripId}`
    );
    return data.data;
  },
};