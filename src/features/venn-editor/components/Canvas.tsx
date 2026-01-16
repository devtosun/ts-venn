import { useRef, useCallback, useState } from 'react';
import { useEditorState } from '../state/editorState';
import { SegmentCircle } from './SegmentCircle';
import { RegionElement, RegionDefs } from './RegionElement';

export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(
    null
  );

  // Select state (not functions that compute state)
  const renderOrder = useEditorState((s) => s.renderOrder);
  const regions = useEditorState((s) => s.regions);
  const segmentList = useEditorState((s) => s.segmentList);
  const dragging = useEditorState((s) => s.dragging);
  const resizing = useEditorState((s) => s.resizing);

  // Select actions
  const startDrag = useEditorState((s) => s.startDrag);
  const drag = useEditorState((s) => s.drag);
  const endDrag = useEditorState((s) => s.endDrag);
  const startResize = useEditorState((s) => s.startResize);
  const resize = useEditorState((s) => s.resize);
  const endResize = useEditorState((s) => s.endResize);
  const getSegmentAt = useEditorState((s) => s.getSegmentAt);
  const getRegionAt = useEditorState((s) => s.getRegionAt);
  const selectSegment = useEditorState((s) => s.selectSegment);
  const toggleRegion = useEditorState((s) => s.toggleRegion);

  const getMousePosition = useCallback(
    (event: React.MouseEvent): { x: number; y: number } => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const pos = getMousePosition(event);
      setMouseDownPos(pos);
      setHasDragged(false);

      // Check if clicked on resize handle
      const target = event.target as HTMLElement;
      if (target.classList.contains('resize-handle')) {
        const segmentId = target.dataset.segmentId;
        if (segmentId) {
          startResize(segmentId);
          if (svgRef.current) {
            svgRef.current.style.cursor = 'ew-resize';
          }
          return;
        }
      }

      // Try to start drag on segment
      const segment = getSegmentAt(pos.x, pos.y);
      if (segment) {
        startDrag(segment.id, pos.x, pos.y);
        if (svgRef.current) {
          svgRef.current.style.cursor = 'grabbing';
        }
      }
    },
    [getMousePosition, getSegmentAt, startDrag, startResize]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const pos = getMousePosition(event);

      // Handle resizing
      if (resizing) {
        resize(pos.x, pos.y);
        return;
      }

      // Handle dragging
      if (!dragging) return;

      // Check if we've actually moved (threshold of 3 pixels)
      if (mouseDownPos) {
        const dx = pos.x - mouseDownPos.x;
        const dy = pos.y - mouseDownPos.y;
        if (Math.sqrt(dx * dx + dy * dy) > 3) {
          setHasDragged(true);
        }
      }

      drag(pos.x, pos.y);
    },
    [getMousePosition, dragging, resizing, drag, resize, mouseDownPos]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      const pos = getMousePosition(event);

      if (resizing) {
        endResize();
        if (svgRef.current) {
          svgRef.current.style.cursor = '';
        }
        setMouseDownPos(null);
        return;
      }

      if (dragging) {
        endDrag();
        if (svgRef.current) {
          svgRef.current.style.cursor = '';
        }
      }

      if (hasDragged) {
        // Actual drag happened - select the dragged segment
        const segment = getSegmentAt(pos.x, pos.y);
        if (segment) {
          selectSegment(segment.id);
        }
      } else if (mouseDownPos) {
        // It was a click (not a drag) - toggle region selection
        const region = getRegionAt(pos.x, pos.y);
        if (region) {
          toggleRegion(region.id);
        }
      }

      setMouseDownPos(null);
      setHasDragged(false);
    },
    [
      getMousePosition,
      dragging,
      resizing,
      endDrag,
      endResize,
      hasDragged,
      mouseDownPos,
      getSegmentAt,
      getRegionAt,
      selectSegment,
      toggleRegion,
    ]
  );

  const handleMouseLeave = useCallback(() => {
    if (resizing) {
      endResize();
      if (svgRef.current) {
        svgRef.current.style.cursor = '';
      }
    }
    if (dragging) {
      endDrag();
      if (svgRef.current) {
        svgRef.current.style.cursor = '';
      }
    }
    setMouseDownPos(null);
    setHasDragged(false);
  }, [dragging, resizing, endDrag, endResize]);

  return (
    <svg
      ref={svgRef}
      id="canvas"
      width="800"
      height="600"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        {regions.map((region) => (
          <RegionDefs
            key={`defs-${region.id}`}
            region={region}
            segments={segmentList}
          />
        ))}
      </defs>
      <g className="regions-layer">
        {regions.map((region) => (
          <RegionElement
            key={region.id}
            region={region}
            segments={segmentList}
          />
        ))}
      </g>
      <g className="segments-layer">
        {renderOrder.map((segment) => (
          <SegmentCircle key={segment.id} segment={segment} />
        ))}
      </g>
    </svg>
  );
}
