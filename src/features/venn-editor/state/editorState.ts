import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Segment, Region, DragState, ResizeState } from '../types';
import { findSmallestContainer, containsPoint, getArea } from '../utils/algorithms';
import { calculateRegions, getRegionAtPoint } from '../utils/regions';

const STORAGE_KEY = 'ts-venn-editor';

interface PersistedState {
  segments: Record<string, Segment>;
  nextId: number;
  selectedRegionIds: string[];
}

function numberToCode(n: number): string {
  let result = '';
  let num = n;
  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result;
}

interface EditorState {
  // State
  segments: Record<string, Segment>;
  segmentList: Segment[];
  renderOrder: Segment[];
  regions: Region[];
  dragging: DragState | null;
  resizing: ResizeState | null;
  nextId: number;

  // Actions
  addSegment: (cx: number, cy: number) => Segment;
  selectSegment: (id: string) => void;
  deselectAll: () => void;
  toggleRegion: (id: string) => void;
  startDrag: (id: string, mouseX: number, mouseY: number) => boolean;
  drag: (mouseX: number, mouseY: number) => void;
  endDrag: () => void;
  isDragging: () => boolean;
  startResize: (id: string) => boolean;
  resize: (mouseX: number, mouseY: number) => void;
  endResize: () => void;
  isResizing: () => boolean;
  getSegmentAt: (x: number, y: number) => Segment | null;
  getRegionAt: (x: number, y: number) => Region | null;
}

function computeHierarchy(segments: Record<string, Segment>): void {
  // Reset all parent/child relationships
  for (const segment of Object.values(segments)) {
    segment.parentId = null;
    segment.children = [];
  }

  const segmentList = Object.values(segments);

  for (const segment of segmentList) {
    const parentId = findSmallestContainer(segment, segmentList);

    if (parentId) {
      const seg = segments[segment.id];
      if (seg) {
        seg.parentId = parentId;
      }
      const parent = segments[parentId];
      if (parent) {
        parent.children.push(segment.id);
      }
    }
  }
}

function computeRegions(
  segments: Record<string, Segment>,
  currentRegions: Region[]
): Region[] {
  const selectedIds = new Set(
    currentRegions.filter((r) => r.selected).map((r) => r.id)
  );

  const segmentList = Object.values(segments);
  const newRegions = calculateRegions(segmentList);

  // Restore selection state
  for (const region of newRegions) {
    if (selectedIds.has(region.id)) {
      region.selected = true;
    }
  }

  return newRegions;
}

function collectWithChildren(
  segment: Segment,
  segments: Record<string, Segment>,
  result: Segment[]
): void {
  result.push(segment);
  for (const childId of segment.children) {
    const child = segments[childId];
    if (child) {
      collectWithChildren(child, segments, result);
    }
  }
}

function computeRenderOrder(segments: Record<string, Segment>): Segment[] {
  const rootSegments = Object.values(segments)
    .filter((s) => s.parentId === null)
    .sort((a, b) => getArea(b) - getArea(a));

  const result: Segment[] = [];
  for (const segment of rootSegments) {
    collectWithChildren(segment, segments, result);
  }
  return result;
}

export const useEditorState = create<EditorState>()(
  persist(
    (set, get) => ({
      segments: {},
      segmentList: [],
      renderOrder: [],
      regions: [],
      dragging: null,
      resizing: null,
      nextId: 1,

  addSegment: (cx, cy) => {
    const state = get();
    const id = `segment_${state.nextId}`;
    const code = numberToCode(state.nextId);
    const name = `Segment ${state.nextId}`;

    const segment: Segment = {
      id,
      name,
      code,
      cx,
      cy,
      radius: 80,
      parentId: null,
      children: [],
      selected: false,
    };

    const newSegments = { ...state.segments, [id]: segment };
    computeHierarchy(newSegments);
    const newRegions = computeRegions(newSegments, state.regions);
    const newSegmentList = Object.values(newSegments);
    const newRenderOrder = computeRenderOrder(newSegments);

    set({
      segments: newSegments,
      segmentList: newSegmentList,
      renderOrder: newRenderOrder,
      regions: newRegions,
      nextId: state.nextId + 1,
    });

    return segment;
  },

  selectSegment: (id) => {
    set((state) => {
      const newSegments = { ...state.segments };
      for (const segment of Object.values(newSegments)) {
        segment.selected = segment.id === id;
      }
      const newRegions = state.regions.map((r) => ({ ...r, selected: false }));
      return {
        segments: newSegments,
        segmentList: Object.values(newSegments),
        regions: newRegions,
      };
    });
  },

  deselectAll: () => {
    set((state) => {
      const newSegments = { ...state.segments };
      for (const segment of Object.values(newSegments)) {
        segment.selected = false;
      }
      const newRegions = state.regions.map((r) => ({ ...r, selected: false }));
      return {
        segments: newSegments,
        segmentList: Object.values(newSegments),
        regions: newRegions,
      };
    });
  },

  toggleRegion: (id) => {
    set((state) => {
      const newRegions = state.regions.map((r) =>
        r.id === id ? { ...r, selected: !r.selected } : r
      );
      const newSegments = { ...state.segments };
      for (const segment of Object.values(newSegments)) {
        segment.selected = false;
      }
      return {
        segments: newSegments,
        segmentList: Object.values(newSegments),
        regions: newRegions,
      };
    });
  },

  startDrag: (id, mouseX, mouseY) => {
    const { segments } = get();
    const segment = segments[id];
    if (!segment) return false;

    set({
      dragging: {
        segmentId: id,
        offsetX: mouseX - segment.cx,
        offsetY: mouseY - segment.cy,
      },
    });
    return true;
  },

  drag: (mouseX, mouseY) => {
    const { dragging, segments } = get();
    if (!dragging) return;

    const segment = segments[dragging.segmentId];
    if (!segment) return;

    const newSegments = { ...segments };
    newSegments[dragging.segmentId] = {
      ...segment,
      cx: mouseX - dragging.offsetX,
      cy: mouseY - dragging.offsetY,
    };

    set({
      segments: newSegments,
      segmentList: Object.values(newSegments),
      renderOrder: computeRenderOrder(newSegments),
    });
  },

  endDrag: () => {
    const state = get();
    const newSegments = { ...state.segments };
    computeHierarchy(newSegments);
    const newRegions = computeRegions(newSegments, state.regions);
    const newRenderOrder = computeRenderOrder(newSegments);

    set({
      dragging: null,
      segments: newSegments,
      segmentList: Object.values(newSegments),
      renderOrder: newRenderOrder,
      regions: newRegions,
    });
  },

  isDragging: () => get().dragging !== null,

  startResize: (id) => {
    const { segments } = get();
    if (!segments[id]) return false;
    set({ resizing: { segmentId: id } });
    return true;
  },

  resize: (mouseX, mouseY) => {
    const { resizing, segments } = get();
    if (!resizing) return;

    const segment = segments[resizing.segmentId];
    if (!segment) return;

    const dx = mouseX - segment.cx;
    const dy = mouseY - segment.cy;
    const newRadius = Math.max(20, Math.sqrt(dx * dx + dy * dy));

    const newSegments = { ...segments };
    newSegments[resizing.segmentId] = { ...segment, radius: newRadius };

    set({
      segments: newSegments,
      segmentList: Object.values(newSegments),
      renderOrder: computeRenderOrder(newSegments),
    });
  },

  endResize: () => {
    const state = get();
    const newSegments = { ...state.segments };
    computeHierarchy(newSegments);
    const newRegions = computeRegions(newSegments, state.regions);
    const newRenderOrder = computeRenderOrder(newSegments);

    set({
      resizing: null,
      segments: newSegments,
      segmentList: Object.values(newSegments),
      renderOrder: newRenderOrder,
      regions: newRegions,
    });
  },

  isResizing: () => get().resizing !== null,

  getSegmentAt: (x, y) => {
    const { segmentList } = get();
    const candidates = segmentList.filter((s) => containsPoint(s, x, y));

    if (candidates.length === 0) return null;

    return candidates.reduce((smallest, current) =>
      getArea(current) < getArea(smallest) ? current : smallest
    );
  },

  getRegionAt: (x, y) => {
    const { regions, segmentList } = get();
    return getRegionAtPoint(x, y, regions, segmentList);
  },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state): PersistedState => ({
        segments: state.segments,
        nextId: state.nextId,
        selectedRegionIds: state.regions.filter((r) => r.selected).map((r) => r.id),
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedState | undefined;

        if (!persisted || Object.keys(persisted.segments).length === 0) {
          return currentState;
        }

        // Recompute hierarchy
        const segments = { ...persisted.segments };
        computeHierarchy(segments);

        // Compute regions and restore selection
        const regions = calculateRegions(Object.values(segments));
        const selectedIds = new Set(persisted.selectedRegionIds || []);
        for (const region of regions) {
          if (selectedIds.has(region.id)) {
            region.selected = true;
          }
        }

        return {
          ...currentState,
          segments,
          segmentList: Object.values(segments),
          renderOrder: computeRenderOrder(segments),
          regions,
          nextId: persisted.nextId,
        };
      },
    }
  )
);
