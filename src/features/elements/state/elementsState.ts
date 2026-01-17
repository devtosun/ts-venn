import { create } from 'zustand';
import type { Element, ForeignKey } from '@/services/storage/types';
import { elementStorage } from '@/services/storage';

interface ElementsState {
  elements: Element[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchElements: () => Promise<void>;
  createElement: (element: Omit<Element, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Element>;
  updateElement: (id: string, updates: Partial<Omit<Element, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteElement: (id: string) => Promise<void>;
  addForeignKey: (elementId: string, fk: Omit<ForeignKey, 'id'>) => Promise<void>;
  removeForeignKey: (elementId: string, fkId: string) => Promise<void>;
}

function generateFkId(): string {
  return `fk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useElementsState = create<ElementsState>((set, get) => ({
  elements: [],
  loading: false,
  error: null,

  fetchElements: async () => {
    set({ loading: true, error: null });
    try {
      const elements = await elementStorage.getAll();
      set({ elements, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createElement: async (element) => {
    set({ loading: true, error: null });
    try {
      const newElement = await elementStorage.create(element);
      set((state) => ({
        elements: [...state.elements, newElement],
        loading: false,
      }));
      return newElement;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  updateElement: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await elementStorage.update(id, updates);
      set((state) => ({
        elements: state.elements.map((e) => (e.id === id ? updated : e)),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  deleteElement: async (id) => {
    set({ loading: true, error: null });
    try {
      await elementStorage.delete(id);
      set((state) => ({
        elements: state.elements.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  addForeignKey: async (elementId, fk) => {
    const { elements } = get();
    const element = elements.find((e) => e.id === elementId);
    if (!element) return;

    const newFk: ForeignKey = { ...fk, id: generateFkId() };
    const updates = {
      foreignKeys: [...element.foreignKeys, newFk],
    };

    await get().updateElement(elementId, updates);
  },

  removeForeignKey: async (elementId, fkId) => {
    const { elements } = get();
    const element = elements.find((e) => e.id === elementId);
    if (!element) return;

    const updates = {
      foreignKeys: element.foreignKeys.filter((fk) => fk.id !== fkId),
    };

    await get().updateElement(elementId, updates);
  },
}));
