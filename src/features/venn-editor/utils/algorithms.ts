import type { Segment } from '../types';

export function distanceBetween(a: Segment, b: Segment): number {
  const dx = a.cx - b.cx;
  const dy = a.cy - b.cy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isContained(child: Segment, parent: Segment): boolean {
  if (child.id === parent.id) {
    return false;
  }
  // A circle is contained in another if distance + child_radius <= parent_radius
  const distance = distanceBetween(child, parent);
  return distance + child.radius <= parent.radius;
}

export function findSmallestContainer(
  segment: Segment,
  candidates: Segment[]
): string | null {
  let smallestContainer: Segment | null = null;
  let smallestArea = Infinity;

  for (const candidate of candidates) {
    if (isContained(segment, candidate)) {
      const area = Math.PI * candidate.radius * candidate.radius;
      if (area < smallestArea) {
        smallestArea = area;
        smallestContainer = candidate;
      }
    }
  }

  return smallestContainer?.id ?? null;
}

export function containsPoint(segment: Segment, px: number, py: number): boolean {
  const dx = px - segment.cx;
  const dy = py - segment.cy;
  return dx * dx + dy * dy <= segment.radius * segment.radius;
}

export function getArea(segment: Segment): number {
  return Math.PI * segment.radius * segment.radius;
}
