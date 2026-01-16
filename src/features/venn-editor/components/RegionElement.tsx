import { useMemo } from 'react';
import type { Region, Segment } from '../types';

interface RegionElementProps {
  region: Region;
  segments: Segment[];
}

export function RegionElement({ region, segments }: RegionElementProps) {
  const { inSegments, outSegments } = useMemo(() => {
    const inSet = new Set(region.segmentIds);
    return {
      inSegments: segments.filter((s) => inSet.has(s.id)),
      outSegments: segments.filter((s) => !inSet.has(s.id)),
    };
  }, [region.segmentIds, segments]);

  if (inSegments.length === 0) return null;

  const baseSegment = inSegments[0];
  const maskId = `mask-${region.id}`;

  // Build the nested structure for intersection
  const renderNestedClips = () => {
    let content = (
      <circle
        className="region-fill"
        cx={baseSegment.cx}
        cy={baseSegment.cy}
        r={baseSegment.radius}
      />
    );

    // Apply clip for each additional 'in' segment
    for (let i = 1; i < inSegments.length; i++) {
      const seg = inSegments[i];
      content = (
        <g clipPath={`url(#clip-region-${region.id}-${seg.id})`}>{content}</g>
      );
    }

    // Apply mask for exclusions
    if (outSegments.length > 0) {
      content = <g mask={`url(#${maskId})`}>{content}</g>;
    }

    return content;
  };

  return (
    <g
      className={`region ${region.selected ? 'selected' : ''}`}
      data-region-id={region.id}
      data-level={region.segmentIds.length}
    >
      {renderNestedClips()}
    </g>
  );
}

// Export helper to generate defs for a region
export function RegionDefs({ region, segments }: RegionElementProps) {
  const inSet = new Set(region.segmentIds);
  const inSegments = segments.filter((s) => inSet.has(s.id));
  const outSegments = segments.filter((s) => !inSet.has(s.id));

  if (inSegments.length === 0) return null;

  const maskId = `mask-${region.id}`;

  return (
    <>
      {/* Clip paths for intersection */}
      {inSegments.map((seg) => (
        <clipPath key={`clip-${region.id}-${seg.id}`} id={`clip-region-${region.id}-${seg.id}`}>
          <circle cx={seg.cx} cy={seg.cy} r={seg.radius} />
        </clipPath>
      ))}

      {/* Mask for exclusion */}
      {outSegments.length > 0 && (
        <mask id={maskId}>
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="white" />
          {outSegments.map((seg) => (
            <circle
              key={`exclude-${seg.id}`}
              cx={seg.cx}
              cy={seg.cy}
              r={seg.radius}
              fill="black"
            />
          ))}
        </mask>
      )}
    </>
  );
}
