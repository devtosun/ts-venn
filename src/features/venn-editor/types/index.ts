export interface Segment {
  id: string;
  name: string;
  code: string;
  cx: number;
  cy: number;
  radius: number;
  parentId: string | null;
  children: string[];
  selected: boolean;
  elementId?: string; // Reference to storage Element
}

export interface Region {
  id: string;
  segmentIds: string[];
  selected: boolean;
}

export interface DragState {
  segmentId: string;
  offsetX: number;
  offsetY: number;
}

export interface ResizeState {
  segmentId: string;
}
