import type { Segment } from '../types';

interface SegmentCircleProps {
  segment: Segment;
}

export function SegmentCircle({ segment }: SegmentCircleProps) {
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
      <text
        className="segment-label"
        x={segment.cx}
        y={segment.cy - segment.radius - 10}
        textAnchor="middle"
      >
        {segment.code}
      </text>
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
