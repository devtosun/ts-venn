import type { Segment } from '../types';

interface SegmentCircleProps {
  segment: Segment;
  showLabel?: boolean;
}

export function SegmentCircle({ segment, showLabel = false }: SegmentCircleProps) {
  return (
    <g
      className={`segment ${segment.selected ? 'selected' : ''}`}
      data-segment-id={segment.id}
    >
      <circle
        className="segment-circle"
        cx={segment.cx}
        cy={segment.cy}
        r={segment.radius}
      />
      {showLabel && (
        <text
          className="segment-label"
          x={segment.cx}
          y={segment.cy - segment.radius - 12}
          textAnchor="middle"
        >
          {segment.code}
        </text>
      )}
      <circle
        className="resize-handle"
        data-segment-id={segment.id}
        cx={segment.cx + segment.radius}
        cy={segment.cy}
        r={8}
      />
    </g>
  );
}

interface SegmentLabelsProps {
  segments: Segment[];
}

type TextAnchor = 'start' | 'middle' | 'end';
type DominantBaseline = 'auto' | 'middle' | 'hanging';

// Calculate label position based on segment's position relative to diagram center
function calculateLabelPosition(
  segment: Segment,
  allSegments: Segment[],
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; anchor: TextAnchor; baseline: DominantBaseline } {
  // Calculate diagram center (average of all segment centers, or canvas center if only one)
  let diagramCenterX = canvasWidth / 2;
  let diagramCenterY = canvasHeight / 2;

  if (allSegments.length > 1) {
    diagramCenterX = allSegments.reduce((sum, s) => sum + s.cx, 0) / allSegments.length;
    diagramCenterY = allSegments.reduce((sum, s) => sum + s.cy, 0) / allSegments.length;
  }

  const { cx, cy, radius } = segment;
  const offset = radius * 0.15; // Offset from circle edge

  // Determine segment position relative to diagram center
  const dx = cx - diagramCenterX;
  const dy = cy - diagramCenterY;

  // Calculate angle from diagram center to segment center
  const angle = Math.atan2(dy, dx);

  // Determine primary direction based on angle
  const absAngle = Math.abs(angle);
  const isMoreHorizontal = absAngle < Math.PI / 4 || absAngle > (3 * Math.PI) / 4;

  let x: number;
  let y: number;
  let anchor: TextAnchor;
  let baseline: DominantBaseline;

  if (allSegments.length === 1) {
    // Single segment: place label on top
    x = cx;
    y = cy - radius - offset;
    anchor = 'middle';
    baseline = 'auto';
  } else if (isMoreHorizontal) {
    // Segment is more to the left or right
    if (dx > 0) {
      // Segment is to the right of center -> label on right
      x = cx + radius + offset;
      y = cy;
      anchor = 'start';
      baseline = 'middle';
    } else {
      // Segment is to the left of center -> label on left
      x = cx - radius - offset;
      y = cy;
      anchor = 'end';
      baseline = 'middle';
    }
  } else {
    // Segment is more above or below
    if (dy > 0) {
      // Segment is below center -> label on bottom
      x = cx;
      y = cy + radius + offset + 4;
      anchor = 'middle';
      baseline = 'hanging';
    } else {
      // Segment is above center -> label on top
      x = cx;
      y = cy - radius - offset;
      anchor = 'middle';
      baseline = 'auto';
    }
  }

  // Collision avoidance: check if label position is inside another segment
  for (const other of allSegments) {
    if (other.id === segment.id) continue;

    const distToOther = Math.sqrt(
      Math.pow(x - other.cx, 2) + Math.pow(y - other.cy, 2)
    );

    // If label is inside another segment, push it further out
    if (distToOther < other.radius + 10) {
      const pushAngle = Math.atan2(y - other.cy, x - other.cx);
      const pushDistance = other.radius + 20 - distToOther;
      x += Math.cos(pushAngle) * pushDistance;
      y += Math.sin(pushAngle) * pushDistance;
    }
  }

  // Keep label within canvas bounds
  const labelPadding = 20;
  x = Math.max(labelPadding, Math.min(canvasWidth - labelPadding, x));
  y = Math.max(labelPadding, Math.min(canvasHeight - labelPadding, y));

  return { x, y, anchor, baseline };
}

export function SegmentLabels({ segments }: SegmentLabelsProps) {
  const canvasWidth = 800;
  const canvasHeight = 600;

  return (
    <>
      {segments.map((segment) => {
        const pos = calculateLabelPosition(segment, segments, canvasWidth, canvasHeight);
        return (
          <text
            key={`label-${segment.id}`}
            className="segment-label"
            x={pos.x}
            y={pos.y}
            textAnchor={pos.anchor}
            dominantBaseline={pos.baseline}
            style={{ pointerEvents: 'none' }}
          >
            {segment.code}
          </text>
        );
      })}
    </>
  );
}

// Keep old component for backwards compatibility
interface SegmentLabelProps {
  segment: Segment;
}

export function SegmentLabel({ segment }: SegmentLabelProps) {
  return (
    <text
      className="segment-label"
      x={segment.cx}
      y={segment.cy - segment.radius - 12}
      textAnchor="middle"
      style={{ pointerEvents: 'none' }}
    >
      {segment.code}
    </text>
  );
}
