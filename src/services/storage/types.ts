// Foreign Key definition
export interface ForeignKey {
  id: string;
  table: string;
  column: string;
}

// Segmentation Element
export interface Element {
  id: string;
  code: string;
  description: string;
  foreignKeys: ForeignKey[];
  createdAt: string;
  updatedAt: string;
}

// Segment Definition - composed of multiple Elements
export interface SegmentDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  elementIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Segment for saved diagrams (matches venn-editor Segment but serializable)
export interface SavedSegment {
  id: string;
  name: string;
  code: string;
  cx: number;
  cy: number;
  radius: number;
  segmentDefinitionId?: string; // Reference to SegmentDefinition
}

// Saved Venn Diagram
export interface SavedDiagram {
  id: string;
  name: string;
  description: string;
  segments: SavedSegment[];
  selectedRegionIds: string[];
  createdAt: string;
  updatedAt: string;
}

// Storage interfaces for future API migration
export interface IElementStorage {
  getAll(): Promise<Element[]>;
  getById(id: string): Promise<Element | null>;
  create(element: Omit<Element, 'id' | 'createdAt' | 'updatedAt'>): Promise<Element>;
  update(id: string, element: Partial<Omit<Element, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Element>;
  delete(id: string): Promise<void>;
}

export interface IDiagramStorage {
  getAll(): Promise<SavedDiagram[]>;
  getById(id: string): Promise<SavedDiagram | null>;
  create(diagram: Omit<SavedDiagram, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedDiagram>;
  update(id: string, diagram: Partial<Omit<SavedDiagram, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SavedDiagram>;
  delete(id: string): Promise<void>;
}

export interface ISegmentDefinitionStorage {
  getAll(): Promise<SegmentDefinition[]>;
  getById(id: string): Promise<SegmentDefinition | null>;
  create(segment: Omit<SegmentDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<SegmentDefinition>;
  update(id: string, segment: Partial<Omit<SegmentDefinition, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SegmentDefinition>;
  delete(id: string): Promise<void>;
}
