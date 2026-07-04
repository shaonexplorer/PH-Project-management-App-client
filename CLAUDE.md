# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Install dependencies**: `npm install` (or `yarn` / `pnpm` / `bun` if preferred)
- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run production server**: `npm start`
- **Run linting**: `npm run lint`

These commands are defined in `package.json` under the `scripts` section.

## High‑Level Architecture

- **Framework**: Next.js 16 (App Router). The entry point is `src/app/layout.tsx` which sets up global fonts, Tailwind utilities, and the `ThemeProvider`.
- **Routing**: All pages live under `src/app`. Dynamic route groups are denoted by parentheses, e.g. `(auth)` for authentication routes and `(dashboard)` for the main app UI.
- **Layout hierarchy**:
  - `src/app/layout.tsx` – root layout applied to the whole site.
  - `src/app/(auth)/layout.tsx` – layout for authentication pages (login, signup).
  - `src/app/(dashboard)/layout.tsx` – layout for the dashboard area, wrapping content with a sidebar (`SidebarProvider` / `AppSidebar`).
- **Component library**: UI components are in `src/components/ui/*` and are largely based on the **shadcn/ui** primitives (Button, Input, Card, Tooltip, etc.). Custom components such as `nav-main`, `nav-projects`, `team-switcher` live in `src/components/`.
- **State / Domain Modules**: Business‑logic modules are under `src/modules/`.
  - `Theme/provider.tsx` – wraps the app with `next-themes` to enable dark/light mode.
  - `auth/` – contains `Login-form.tsx` and `Signup-Form.tsx` components used by the authentication routes.
  - `Task/` – contains task-related components including the Kanban board implementation.
- **Utilities**: Helper functions are in `src/lib/` (e.g., `utils.ts` for class name merging). The `cn` utility is imported in the root layout.
- **Styling**: Tailwind CSS (v4) with `globals.css` for base styles. The project uses `tailwind-merge` to combine class strings safely.
- **Icons**: Icons are provided by `@phosphor-icons/react` and `lucide-react`.

### Folder Overview
```
src/
├─ app/                 # Next.js route segments (pages, layouts)
│   ├─ layout.tsx       # Root layout
│   ├─ (auth)/          # Authentication routes
│   │   ├─ layout.tsx
│   │   ├─ login/page.tsx
│   │   └─ signup/page.tsx
│   └─ (dashboard)/    # Protected dashboard area
│       ├─ layout.tsx
│       └─ dashboard/page.tsx
├─ components/          # Reusable UI components
│   ├─ ui/              # shadcn primitives (button, input, …)
│   ├─ app-sidebar.tsx
│   └─ nav-*.tsx        # Navigation components
├─ modules/             # Feature‑level modules (auth, theme, task, …)
│   └─ Task/            # Task management module
│       ├─ Task-list.tsx      # Kanban board implementation
│       ├─ Task-card.tsx      # Individual task card component
│       ├─ Update-Task-Dialog.tsx  # Dialog for updating task status
│       └─ create-task-sheet.tsx   # Sheet for creating new tasks
├─ lib/                 # Utility functions
└─ styles/ (globals.css)
```

## Kanban Board Implementation (dnd-kit)

The Kanban board in `src/modules/Task/Task-list.tsx` uses **dnd-kit** for drag-and-drop functionality. Key components:

### Dependencies Installed
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @dnd-kit/dom
```

### Key Concepts

1. **DndContext** - The root provider for drag-and-drop functionality
2. **SortableContext** - Makes a list of items sortable
3. **useSortable** - Hook for making individual items draggable
4. **useDroppable** - Hook for making areas droppable (columns)
5. **Sensors** - Input sensors (PointerSensor for mouse/touch, KeyboardSensor for accessibility)

### Components

- **SortableTaskCard** - Individual task card that is draggable
- **SortableColumn** - Column container that is a droppable area
- **TaskList** - Main component that orchestrates the drag-and-drop

### Status Columns
- `Todo` (📋) - Tasks that need to be done
- `In_Progress` (🚧) - Tasks currently being worked on
- `Completed` (✅) - Finished tasks

### Drag and Drop Flow
1. User drags a task card
2. The `handleDragStart` captures the active task
3. User drops on a column (detected via `useDroppable`)
4. The `handleDragEnd` updates the task status via the `updateTask` API mutation

### Accessibility
- Keyboard navigation supported via `KeyboardSensor`
- Screen reader announcements via dnd-kit's built-in accessibility features

## Project‑Specific Hooks / Rules
- There are no `.cursor` or Copilot rule files in this repository, so no special linting or AI‑assistant configurations need to be considered.
- The `README.md` already contains the basic "Getting Started" instructions; the commands above are derived from it and `package.json`.

## Future Claude Code Usage
- When performing code changes, prefer editing existing components under `src/components/ui/` or adding new feature modules under `src/modules/`.
- Use the `ThemeProvider` for any UI that depends on dark/light mode.
- Follow the existing file‑naming conventions (PascalCase for components, kebab‑case for route folders).
- Run `npm run lint` after modifications to keep the codebase clean.

---

*Generated on 2026-06-07*