import { create } from 'zustand';
import { segmentDefinitionStorage } from '@/services/storage';
import type { SegmentDefinition } from '@/services/storage/types';

interface SegmentsState {
  segments: SegmentDefinition[];
  loading: boolean;
  error: string | null;
  fetchSegments: () => Promise<void>;
  createSegment: (segment: Omit<SegmentDefinition, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SegmentDefinition>;
  updateSegment: (id: string, updates: Partial<Omit<SegmentDefinition, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteSegment: (id: string) => Promise<void>;
}

export const useSegmentsState = create<SegmentsState>((set) => ({
  segments: [],
  loading: false,
  error: null,

  fetchSegments: async () => {
    set({ loading: true, error: null });
    try {
      const segments = await segmentDefinitionStorage.getAll();
      set({ segments, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch segments', loading: false });
    }
  },

  createSegment: async (segment) => {
    try {
      const newSegment = await segmentDefinitionStorage.create(segment);
      set((state) => ({ segments: [...state.segments, newSegment] }));
      return newSegment;
    } catch (error) {
      set({ error: 'Failed to create segment' });
      throw error;
    }
  },

  updateSegment: async (id, updates) => {
    try {
      const updated = await segmentDefinitionStorage.update(id, updates);
      set((state) => ({
        segments: state.segments.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error) {
      set({ error: 'Failed to update segment' });
      throw error;
    }
  },

  deleteSegment: async (id) => {
    try {
      await segmentDefinitionStorage.delete(id);
      set((state) => ({
        segments: state.segments.filter((s) => s.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete segment' });
      throw error;
    }
  },
}));
