import type { Region, Segment } from '../types';
import { containsPoint } from './algorithms';

export function createRegion(segmentIds: string[]): Region {
  const sortedIds = [...segmentIds].sort();
  return {
    id: `region_${sortedIds.join('_')}`,
    segmentIds: sortedIds,
    selected: false,
  };
}

export function calculateRegions(segments: Segment[]): Region[] {
  if (segments.length === 0) {
    return [];
  }

  const n = segments.length;
  const regions: Region[] = [];

  // Generate all possible non-empty combinations (1 to 2^n - 1)
  for (let mask = 1; mask < (1 << n); mask++) {
    const segmentIds: string[] = [];

    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        segmentIds.push(segments[i].id);
      }
    }

    regions.push(createRegion(segmentIds));
  }

  // Sort by number of segments (fewer segments first)
  regions.sort((a, b) => a.segmentIds.length - b.segmentIds.length);

  return regions;
}

export function getRegionAtPoint(
  px: number,
  py: number,
  regions: Region[],
  segments: Segment[]
): Region | null {
  // Find which segments contain this point
  const pointSegmentIds = new Set(
    segments.filter((s) => containsPoint(s, px, py)).map((s) => s.id)
  );

  if (pointSegmentIds.size === 0) {
    return null;
  }

  // Find the matching region
  return (
    regions.find((r) => {
      const regionSegmentIds = new Set(r.segmentIds);
      if (regionSegmentIds.size !== pointSegmentIds.size) {
        return false;
      }
      for (const id of regionSegmentIds) {
        if (!pointSegmentIds.has(id)) {
          return false;
        }
      }
      return true;
    }) ?? null
  );
}

export function regionContainsPoint(
  region: Region,
  px: number,
  py: number,
  segments: Segment[]
): boolean {
  // A point is in this region if it's in exactly these segments
  const pointSegmentIds = new Set(
    segments.filter((s) => containsPoint(s, px, py)).map((s) => s.id)
  );

  const regionSegmentIds = new Set(region.segmentIds);

  if (regionSegmentIds.size !== pointSegmentIds.size) {
    return false;
  }

  for (const id of regionSegmentIds) {
    if (!pointSegmentIds.has(id)) {
      return false;
    }
  }

  return true;
}
