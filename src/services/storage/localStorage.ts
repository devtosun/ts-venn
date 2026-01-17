import type { Element, SavedDiagram, SegmentDefinition, IElementStorage, IDiagramStorage, ISegmentDefinitionStorage } from './types';

const ELEMENTS_KEY = 'ts-venn-elements';
const DIAGRAMS_KEY = 'ts-venn-diagrams';
const SEGMENTS_KEY = 'ts-venn-segments';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getTimestamp(): string {
  return new Date().toISOString();
}

// Element Storage Implementation
export const elementStorage: IElementStorage = {
  async getAll(): Promise<Element[]> {
    try {
      const data = localStorage.getItem(ELEMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<Element | null> {
    const elements = await this.getAll();
    return elements.find((e) => e.id === id) || null;
  },

  async create(element: Omit<Element, 'id' | 'createdAt' | 'updatedAt'>): Promise<Element> {
    const elements = await this.getAll();
    const now = getTimestamp();
    const newElement: Element = {
      ...element,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    elements.push(newElement);
    localStorage.setItem(ELEMENTS_KEY, JSON.stringify(elements));
    return newElement;
  },

  async update(id: string, updates: Partial<Omit<Element, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Element> {
    const elements = await this.getAll();
    const index = elements.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(`Element with id ${id} not found`);
    }
    const updated: Element = {
      ...elements[index],
      ...updates,
      updatedAt: getTimestamp(),
    };
    elements[index] = updated;
    localStorage.setItem(ELEMENTS_KEY, JSON.stringify(elements));
    return updated;
  },

  async delete(id: string): Promise<void> {
    const elements = await this.getAll();
    const filtered = elements.filter((e) => e.id !== id);
    localStorage.setItem(ELEMENTS_KEY, JSON.stringify(filtered));
  },
};

// Diagram Storage Implementation
export const diagramStorage: IDiagramStorage = {
  async getAll(): Promise<SavedDiagram[]> {
    try {
      const data = localStorage.getItem(DIAGRAMS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<SavedDiagram | null> {
    const diagrams = await this.getAll();
    return diagrams.find((d) => d.id === id) || null;
  },

  async create(diagram: Omit<SavedDiagram, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedDiagram> {
    const diagrams = await this.getAll();
    const now = getTimestamp();
    const newDiagram: SavedDiagram = {
      ...diagram,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    diagrams.push(newDiagram);
    localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(diagrams));
    return newDiagram;
  },

  async update(id: string, updates: Partial<Omit<SavedDiagram, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SavedDiagram> {
    const diagrams = await this.getAll();
    const index = diagrams.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Diagram with id ${id} not found`);
    }
    const updated: SavedDiagram = {
      ...diagrams[index],
      ...updates,
      updatedAt: getTimestamp(),
    };
    diagrams[index] = updated;
    localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(diagrams));
    return updated;
  },

  async delete(id: string): Promise<void> {
    const diagrams = await this.getAll();
    const filtered = diagrams.filter((d) => d.id !== id);
    localStorage.setItem(DIAGRAMS_KEY, JSON.stringify(filtered));
  },
};

// Segment Definition Storage Implementation
export const segmentDefinitionStorage: ISegmentDefinitionStorage = {
  async getAll(): Promise<SegmentDefinition[]> {
    try {
      const data = localStorage.getItem(SEGMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getById(id: string): Promise<SegmentDefinition | null> {
    const segments = await this.getAll();
    return segments.find((s) => s.id === id) || null;
  },

  async create(segment: Omit<SegmentDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<SegmentDefinition> {
    const segments = await this.getAll();
    const now = getTimestamp();
    const newSegment: SegmentDefinition = {
      ...segment,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    segments.push(newSegment);
    localStorage.setItem(SEGMENTS_KEY, JSON.stringify(segments));
    return newSegment;
  },

  async update(id: string, updates: Partial<Omit<SegmentDefinition, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SegmentDefinition> {
    const segments = await this.getAll();
    const index = segments.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Segment with id ${id} not found`);
    }
    const updated: SegmentDefinition = {
      ...segments[index],
      ...updates,
      updatedAt: getTimestamp(),
    };
    segments[index] = updated;
    localStorage.setItem(SEGMENTS_KEY, JSON.stringify(segments));
    return updated;
  },

  async delete(id: string): Promise<void> {
    const segments = await this.getAll();
    const filtered = segments.filter((s) => s.id !== id);
    localStorage.setItem(SEGMENTS_KEY, JSON.stringify(filtered));
  },
};
