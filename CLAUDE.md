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
  - `Project/` – contains project-related components for the Projects page.
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
│   ├─ Task/            # Task management module
│   │   ├─ Task-list.tsx          # Kanban board implementation
│   │   ├─ Task-card.tsx          # Individual task card component
│   │   ├─ task-card-skeleton.tsx # Loading skeleton for task cards
│   │   ├─ Update-Task-Dialog.tsx # Dialog for updating task status
│   │   ├─ create-task-sheet.tsx  # Sheet for creating new tasks
│   │   ├─ Create-Project-Required-dialog.tsx # Dialog for no projects
│   │   └─ Add-member-to-project-dialog.tsx # Dialog to add member when project has no members
│   └─ Project/         # Project management module
│       ├─ project-list.tsx       # Projects grid view
│       ├─ project-card.tsx       # Individual project card component
│       ├─ project-card-skeleton.tsx # Loading skeleton for project cards
│       ├─ Delete-Confirm-dialog.tsx # Delete confirmation dialog
│       ├─ Update-Project-Dialog.tsx # Dialog for editing projects
│       └─ Add-member-dialog.tsx  # Dialog for adding members to projects
├─ lib/                 # Utility functions
└─ styles/ (globals.css)
```

## Authentication

### Server Actions
Server actions are located in `src/actions/auth/`:
- `login.ts` - `loginAction` - Authenticates users and sets auth cookies
- `register.ts` - `registerAction` - Registers new users with a specified role (e.g., "projectManager")

### Login Form
`src/modules/auth/Login-form.tsx` uses:
- React Hook Form with Zod validation
- TanStack Query `useMutation` for API calls
- `loginAction` server action for authentication

### Signup Form
`src/modules/auth/Signup-Form.tsx` uses:
- React Hook Form with Zod validation
- TanStack Query `useMutation` for API calls
- `registerAction` server action for registration
- Automatically registers users as `projectManager` role
- Password visibility toggle for both password fields
- Form validation with error messages displayed inline

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
5. **Sensors** - Input sensors (PointerSensor for mouse/touch drag-and-drop)

### Current Sensor Configuration

- **PointerSensor** - Enabled with `distance: 0` activation constraint for immediate drag start
- **KeyboardSensor** - Not currently used (keyboard drag-and-drop disabled)
- To re-enable keyboard drag: add KeyboardSensor with `sortableKeyboardCoordinates` back to `useSensors()`

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
- Screen reader announcements via dnd-kit's built-in accessibility features
- **Note**: Keyboard drag-and-drop is currently disabled (KeyboardSensor removed from sensors array)
- PointerSensor activation constraint uses `distance: 0` for immediate drag start (cursor-card alignment)
- To enable keyboard drag-and-drop: add `KeyboardSensor` back to the `useSensors()` call

## Loading Skeletons

The project uses skeleton loaders for smooth loading states:

- **Skeleton component**: Located at `src/components/ui/skeleton.tsx` - a reusable loading indicator with `animate-pulse` class
- **ProjectCardSkeleton**: Located at `src/modules/Project/project-card-skeleton.tsx` - displays while projects are loading in the Projects page
- **TaskCardSkeleton**: Located at `src/modules/Task/task-card-skeleton.tsx` - displays while tasks are loading in the Kanban board columns

Both skeletons use the same styling as their respective card components (colors, borders, rounded corners) but with animated pulse effect for visual feedback during data fetching.

## Project‑Specific Hooks / Rules

### Documentation Research
- **Use context7 for library documentation**: When asking about libraries, frameworks, SDKs, APIs, or CLI tools, use `npx ctx7@latest library <name>` to fetch current documentation
- **Get updated docs**: Use `npx ctx7@latest docs <libraryId>` to get specific documentation for the library
- **This ensures**: You get the most recent API syntax, configuration, and best practices

### Frontend Development
- **Use the `/frontend-design` skill**: For improving/fixing UI components, invoke the `frontend-design` skill to get design guidance
- **Leverage shadcn/ui components**: Prefer shadcn/ui components over custom implementations for consistency
- **Check available shadcn components**: Use `npx shadcn-ui@latest add <component>` to add new components
- **Follow existing patterns**: Match the styling and structure of similar dialogs in the project (UpdateTaskDialog, UpdateProjectDialog)

### Code Patterns
- There are no `.cursor` or Copilot rule files in this repository, so no special linting or AI‑assistant configurations need to be considered.
- The `README.md` already contains the basic "Getting Started" instructions; the commands above are derived from it and `package.json`.

## Recent Changes

### Delete Confirmation Dialog for Project Cards
- **Created**: `src/actions/Project/delete.ts` - Server action for deleting projects
- **Created**: `src/modules/Project/Delete-Confirm-dialog.tsx` - Delete confirmation dialog component
- **Updated**: `src/modules/Project/project-card.tsx` - Integrated delete dialog with shadcn/ui Dialog
- **Updated**: `src/modules/Project/project-list.tsx` - Removed onDelete callback (handled internally)

### Create Project Required Dialog for Tasks
- **Created**: `src/modules/Task/Create-Project-Required-dialog.tsx` - Dialog shown when no projects exist
- **Updated**: `src/modules/Task/create-task-sheet.tsx` - Added logic to check for projects and show dialog when needed

### Update Project Dialog
- **Created**: `src/actions/Project/update.ts` - Server action for updating projects
- **Created**: `src/modules/Project/Update-Project-Dialog.tsx` - Dialog for editing project details
- **Updated**: `src/modules/Project/project-card.tsx` - Integrated update dialog with edit button
- **Updated**: `src/modules/Project/project-list.tsx` - Pass description and deadline props to project card

### Add Member to Project Dialog
- **Created**: `src/modules/Project/Add-member-dialog.tsx` - Dialog for adding members to projects
- **Updated**: `src/modules/Project/project-card.tsx` - Integrated add member dialog with button
- **Updated**: `src/modules/Task/create-task-sheet.tsx` - Automatically shows dialog when selecting a project with no members

### Key Implementation Details

#### Delete Confirmation Dialog (Project Cards)
- Uses shadcn/ui Dialog component with proper animations
- Shows confirmation message with project title
- Displays loading state during deletion
- Uses toast notifications for user feedback
- Invalidates project queries after successful deletion
- Follows the same pattern as UpdateTaskDialog

#### Create Project Required Dialog (Tasks)
- Alerts users when no projects exist
- Provides clear guidance to create a project first
- Includes navigation button to the projects page
- Prevents task creation without a project
- Uses shadcn/ui Dialog component with alert icon

#### Update Project Dialog
- Uses shadcn/ui Dialog, Input, Label, Button components
- Form with fields for Name, Description, and Deadline
- TanStack Query mutation for API calls
- Toast notifications for success/error feedback
- Invalidates project queries after successful update

#### Add Member to Project Dialog
- Uses shadcn/ui Dialog, Button, Input, Label, Select, Tabs components
- Two tabs: "Add Existing" (select from team) and "Invite New" (invite new member)
- React Hook Form with Zod validation for both tabs
- Uses `Users` icon from lucide-react for the trigger button
- Toast notifications for success/error feedback
- Invalidates project queries after successful addition
- Integrated in `project-card.tsx` with proper Button component styling
- Error messages use `text-destructive` for proper theming

### Drag-and-Drop Configuration Changes

#### Disabled Keyboard Drag-and-Drop
- Removed `KeyboardSensor` from the sensors array in `Task-list.tsx`
- Keyboard-based drag activation (Space/Enter) is no longer available
- Mouse/touch drag-and-drop via `PointerSensor` still works

#### Fixed Cursor Offset During Drag
- Changed `PointerSensor` activation constraint `distance` from `3` to `0`
- This ensures the cursor and moving task card are perfectly aligned when drag starts
- Previously, the 3px distance caused an offset between cursor position and card position

---

## Project List Search and Filter

### Implementation

#### Filtering Controls
The project list (`src/modules/Project/project-list.tsx`) supports three types of filtering:

1. **Search Filter** - Searches by project name and description (case-insensitive)
2. **Project Filter** - Dropdown to select a specific project or "All Projects"
3. **Status Filter** - Dropdown to filter by project status

#### Status Values
The status filter uses the database enum values from `ProjectStatus`:
- **Active** - Projects currently in progress
- **Completed** - Finished projects
- **On Hold** - Projects paused or on hold
- **All** - Shows all projects (default)

#### UI Components
- Uses shadcn/ui `Select` component for project and status dropdowns
- Uses `ListFilter` icon from lucide-react for the "All Projects" option
- `SelectGroup` with `SelectLabel` for proper grouping

#### Filtering Logic
Projects are filtered client-side based on:
- Search term (matches name or description)
- Selected project ID
- Status value

#### Empty States
- When no projects exist: Shows `EmptyProjects` component
- When filters yield no results: Shows custom empty state with:
  - Appropriate messaging based on filter type
  - "Clear all filters" button when filters are active
  - SVG illustration with amber color scheme

#### Footer Stats
Displays in the footer:
- Total project count
- Selected project name (when project filter is active)
- Status (when status filter is active)
- Filtered count (when any filter is active)

#### How It Works
1. Projects are fetched via `getMyProjects` query
2. Tasks are fetched for each project via `getTasksByProject` (5-minute cache)
3. Completion percentage is calculated from tasks
4. Client-side filtering is applied based on search, project, and status
5. Filtered projects are displayed in a responsive grid

*Updated on 2026-07-08*

---

## Task Filtering by Projects

### Implementation

#### Task Interface Update
- **Updated**: `src/modules/Task/Task-list.tsx` - Added `projectId?: string` field to the `Task` interface to support project association

#### Project Filter Dropdown
- **Updated**: `src/modules/Task/Task-list.tsx` - Added a project filter dropdown using shadcn/ui Select component
- The dropdown allows filtering tasks by project or selecting "All Projects"
- Uses `ListFilter` icon from lucide-react for the "All Projects" option
- Properly wrapped in `SelectGroup` with `SelectLabel` as required by radix-ui

#### Filtering Logic
- **Updated**: `src/modules/Task/Task-list.tsx` - Combined search and project filters
- When a project is selected, only tasks belonging to that project are displayed
- Search filter works in conjunction with project filter
- "Clear all filters" button appears when filters are active

#### Empty State Handling
- **Updated**: `src/modules/Task/Task-list.tsx` - Added custom empty state for filtered results
- Shows appropriate messaging when no tasks match the current filters
- Suggests either clearing filters or creating a new task

#### Footer Stats Enhancement
- **Updated**: `src/modules/Task/Task-list.tsx` - Shows selected project name in the stats footer
- Displays filtered count when filters are active

### How It Works
1. Projects are fetched via `getMyProjects` query
2. Tasks are fetched via `getMyTasks` query
3. Tasks are filtered client-side based on:
   - Search term (title or description match)
   - Selected project ID match
4. Filtered tasks are grouped by status and displayed in Kanban columns
5. Stats footer shows total tasks, selected project, and filtered count

*Updated on 2026-07-08*

## Completion Percentage Implementation

### Server Data Integration for Project Cards

#### New Server Action
- **Created**: `src/actions/Tasks/get-by-project.ts` - Server action to fetch tasks for a specific project using the `/tasks/project/{projectId}` endpoint

#### Project List Updates
- **Updated**: `src/modules/Project/project-list.tsx` - Now fetches tasks for each project and calculates completion percentage
- Added `calculateCompletionPercentage()` function: calculates `(completed tasks / total tasks) * 100`
- Added React Query to fetch tasks for each project with 5-minute caching
- Uses server-provided `completionPercentage` if available, otherwise falls back to calculated value from tasks

#### Project Card Updates
- **Updated**: `src/modules/Project/project-card.tsx` - Improved handling of completion percentage from server data
- Changed default `completionPercentage` from `75` to `0` for better initial state
- Added `calculateDaysLeft()` helper to derive days left from deadline
- Added clamping logic to ensure `completionPercentage` is between 0-100
- Improved handling of undefined values with proper fallbacks
- Progress bar and status badge now correctly display calculated completion

#### How It Works
1. When projects are loaded, tasks are fetched for each project
2. Completion percentage is calculated based on task status
3. The project card displays:
   - Progress bar showing the percentage
   - Status badge showing "Completed" (100%) or "Active" (<100%)
   - Color-coded accent bar based on status (green/completed, amber/overdue, blue/on-track)