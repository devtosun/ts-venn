import { useRef, useCallback, useState } from 'react';
import { useEditorState } from '../state/editorState';
import { SegmentCircle, SegmentLabels } from './SegmentCircle';
import { RegionElement, RegionDefs } from './RegionElement';
import { SEGMENT_DRAG_TYPE } from './ElementsSidebar';
import type { SegmentDefinition } from '@/services/storage/types';

export function Canvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const [isDragOver, setIsDragOver] = useState(false);

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
  const addSegmentFromDefinition = useEditorState((s) => s.addSegmentFromDefinition);

  const getMousePosition = useCallback(
    (event: React.MouseEvent): { x: number; y: number } => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();

      // Convert screen coordinates to SVG viewBox coordinates
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
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

  // Drag & Drop handlers for external segments
  const getDropPosition = useCallback(
    (event: React.DragEvent): { x: number; y: number } => {
      if (!svgRef.current) return { x: 400, y: 300 };
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();

      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (event.dataTransfer.types.includes(SEGMENT_DRAG_TYPE)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const data = event.dataTransfer.getData(SEGMENT_DRAG_TYPE);
      if (!data) return;

      try {
        const segmentDef: SegmentDefinition = JSON.parse(data);
        const pos = getDropPosition(event);
        addSegmentFromDefinition(segmentDef, pos.x, pos.y);
      } catch (e) {
        console.error('Failed to parse dropped segment:', e);
      }
    },
    [getDropPosition, addSegmentFromDefinition]
  );

  return (
    <svg
      ref={svgRef}
      id="canvas"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-full transition-colors ${isDragOver ? 'bg-primary/5' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
      <g className="labels-layer">
        <SegmentLabels segments={segmentList} />
      </g>
      {isDragOver && (
        <rect
          x="10"
          y="10"
          width="780"
          height="580"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray="8 4"
          rx="8"
          opacity="0.5"
        />
      )}
    </svg>
  );
}
