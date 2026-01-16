# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ts-venn is an SVG-based visual Venn diagram editor with drag-and-drop support. Built with React, TypeScript, Vite, and Zustand for state management.

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Type check and production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

### State Management (`src/state/AppState.ts`)
Zustand store managing:
- `segments`: Map of all circle segments
- `regions`: Computed Venn diagram regions
- `dragging/resizing`: Interaction state
- Actions for CRUD operations, selection, drag/resize

### Types (`src/types/index.ts`)
- `Segment`: Circle with id, code, position, radius, parent/child hierarchy
- `Region`: Intersection region defined by segment IDs
- `DragState`, `ResizeState`: Interaction tracking

### Utils (`src/utils/`)
- **algorithms.ts**: Geometry functions (`isContained`, `findSmallestContainer`, `containsPoint`)
- **regions.ts**: Region computation (`calculateRegions`, `getRegionAtPoint`)

### Components (`src/components/`)
- **Canvas.tsx**: Main SVG container with mouse event handling (drag, resize, click-to-select)
- **SegmentCircle.tsx**: Renders segment circle with label and resize handle
- **RegionElement.tsx**: Renders region using nested clip-paths (intersection) and masks (exclusion)
- **FormulaPanel.tsx**: Displays set notation formula for selected regions

### Data Flow
1. User interactions in Canvas trigger Zustand actions
2. State updates trigger React re-renders
3. Regions auto-compute when segments change
4. Formula panel shows set notation (e.g., `(A ∩ B) - C`)

### Key Concepts
- Segments form parent-child hierarchy based on geometric containment
- Regions represent all 2^n-1 segment combinations
- Click on region toggles selection; drag on segment moves it
- SVG clip-paths handle intersection; masks handle exclusion
