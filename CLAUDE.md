# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ts-venn is an SVG-based visual Venn diagram editor with drag-and-drop support. Built with React, TypeScript, Vite, Zustand for state management, and React Router for navigation.

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Type check and production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

Feature-based architecture with three main features:

```
src/
├── features/
│   ├── auth/          # Authentication feature
│   ├── home/          # Dashboard/homepage feature
│   └── venn-editor/   # Venn diagram editor feature
├── routes/            # React Router configuration
├── App.tsx            # Root component with RouterProvider
└── App.css            # Global styles
```

### Features

#### Auth (`src/features/auth/`)
- **state/authState.ts**: Zustand store with localStorage persistence (`user`, `isAuthenticated`, `login()`, `logout()`)
- **components/LoginForm.tsx**: Email/password form
- **LoginPage.tsx**: Login page with redirect if authenticated

#### Home (`src/features/home/`)
- **components/ProjectCard.tsx**: Project card component for dashboard
- **HomePage.tsx**: Dashboard with project list and "New Venn Diagram" button

#### Venn Editor (`src/features/venn-editor/`)
- **state/editorState.ts**: Zustand store managing segments, regions, drag/resize state
- **components/Canvas.tsx**: Main SVG container with mouse event handling
- **components/SegmentCircle.tsx**: Renders segment circle with label and resize handle
- **components/RegionElement.tsx**: Renders region using nested clip-paths and masks
- **components/FormulaPanel.tsx**: Displays set notation formula for selected regions
- **utils/algorithms.ts**: Geometry functions (`isContained`, `findSmallestContainer`, `containsPoint`)
- **utils/regions.ts**: Region computation (`calculateRegions`, `getRegionAtPoint`)
- **types/index.ts**: TypeScript interfaces (`Segment`, `Region`, `DragState`, `ResizeState`)

### Routes (`src/routes/`)
- `/login` - Login page (public)
- `/` - Dashboard (protected)
- `/editor` - Venn editor (protected)

### Data Flow
1. User authenticates via login form → authState updated → redirect to dashboard
2. User clicks project or "New" → navigate to `/editor`
3. User interactions in Canvas trigger editorState actions
4. State updates trigger React re-renders
5. Regions auto-compute when segments change
6. Formula panel shows set notation (e.g., `(A ∩ B) - C`)

### Key Concepts
- Segments form parent-child hierarchy based on geometric containment
- Regions represent all 2^n-1 segment combinations
- Click on region toggles selection; drag on segment moves it
- SVG clip-paths handle intersection; masks handle exclusion
- Auth state persisted to localStorage
