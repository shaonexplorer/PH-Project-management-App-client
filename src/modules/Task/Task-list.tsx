"use client";

import { useEffect, useState, useCallback } from "react";

import TaskCard from "./Task-card";
import { TaskCardSkeleton } from "./task-card-skeleton";
import { EmptyTasks } from "./empty-tasks";
import { Separator } from "@/components/ui/separator";
import { SheetCreateTask } from "./create-task-sheet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyTasks } from "@/actions/Tasks/get";
import { updateTask } from "@/actions/Tasks/update";
import { getCookieByName } from "@/actions/auth/cookie";
import { toast } from "sonner";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getMyProjects } from "@/actions/Project/get";
import { CreateProjectRequiredDialog } from "./Create-Project-Required-dialog";

// Status definitions with custom colors
const statusConfig = {
  Todo: {
    key: "Todo",
    label: "To Do",
    description: "Tasks waiting to be started",
    icon: "📋",
    color: "text-status-todo",
    bg: "bg-status-todo/10",
    border: "border-status-todo/20",
  },
  In_Progress: {
    key: "In_Progress",
    label: "In Progress",
    description: "Tasks currently being worked on",
    icon: "🚧",
    color: "text-status-inprogress",
    bg: "bg-status-inprogress/10",
    border: "border-status-inprogress/20",
  },
  Completed: {
    key: "Completed",
    label: "Completed",
    description: "Finished tasks",
    icon: "✅",
    color: "text-status-completed",
    bg: "bg-status-completed/10",
    border: "border-status-completed/20",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

interface Task {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "In_Progress" | "Completed";
  priority?: "Low" | "Medium" | "High" | "Critical";
  dueDate?: string;
  assignee?: {
    name: string;
    role?: string;
    avatarUrl?: string;
    isOnline?: boolean;
  };
}

interface KanbanTask extends Task {
  position?: number;
}

// Sortable Task Card Component
function SortableTaskCard({ task }: { task: KanbanTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-3"
    >
      <TaskCard
        taskId={task.id}
        taskStatus={task.status}
        deadline={task.dueDate}
        title={task.title}
        description={task.description}
        priority={task.priority}
        assignee={{
          name: task.assignee?.name || "Unassigned",
          role: task.assignee?.role || "Team Member",
          avatarUrl:
            task.assignee?.avatarUrl ||
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          isOnline: task.assignee?.isOnline ?? false,
        }}
        onUpdateStatus={() => console.log(`Update ${task.id}`)}
      />
    </div>
  );
}

// Sortable Column Component - makes the column a droppable area
function SortableColumn({
  status,
  config,
  tasks,
  isLoading,
}: {
  status: StatusKey;
  config: (typeof statusConfig)[StatusKey];
  tasks: KanbanTask[];
  isLoading?: boolean;
}) {
  // Make the entire column a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex flex-col rounded-2xl border transition-all duration-300 ${
        isOver
          ? `${config.border} bg-card shadow-2xl ring-2 ${config.bg.replace("/10", "/20")} backdrop-blur-sm`
          : "bg-card border-border/50 hover:bg-card/80"
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <h2
          className={`text-lg font-semibold flex items-center gap-2 ${config.color}`}
        >
          <span className="text-2xl">{config.icon}</span>
          <span>{config.label}</span>
          <span
            className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
          >
            {tasks.length}
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {config.description}
        </p>
      </div>

      {/* Sortable Tasks */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-3 opacity-40">📭</div>
              <p className="text-sm">Drop task here</p>
            </div>
          ) : (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function TaskList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const id = await getCookieByName("userId");
      setUser(id);
    };

    getUser();
  }, []);

  const queryClient = useQueryClient();

  const tasks = useQuery({
    queryKey: ["my-tasks", user],
    queryFn: () => getMyTasks(user as string),
  });

  // Mutation for updating task status via drag and drop
  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTask({ taskId, status }),
    onSuccess: () => {
      toast.success("Task moved successfully");
      queryClient.invalidateQueries({ queryKey: ["my-tasks", user] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update task");
    },
  });

  // Get tasks from API
  const apiTasks: KanbanTask[] = (tasks?.data?.tasks || []) as KanbanTask[];

  // Filter tasks based on search
  const filteredTasks = apiTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Group tasks by status
  const tasksByStatus = Object.keys(statusConfig).reduce(
    (acc, status) => {
      acc[status as StatusKey] = filteredTasks
        .filter((t) => (t.status as string) === status)
        .sort((a, b) => {
          const aPos = a.position ?? 0;
          const bPos = b.position ?? 0;
          return aPos - bPos;
        });
      return acc;
    },
    {} as Record<StatusKey, KanbanTask[]>,
  );

  // Sensors for drag and drop (pointer-only, keyboard drag disabled)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    }),
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;

    const task = filteredTasks.find((t) => t.id === taskId);
    if (task) {
      setDraggedTask(task);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;

    // Reset state
    setDraggedTask(null);

    // If dropped on nothing, just return
    if (!over) {
      return;
    }

    const overId = over.id;

    // Find the active task
    const activeTask = filteredTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if we dropped on a column (empty column or not)
    const overStatus = overId as StatusKey;
    if (Object.keys(statusConfig).includes(overStatus)) {
      // Dropped on a column
      if (activeTask.status !== overStatus) {
        updateMutation.mutate({
          taskId: activeId,
          status: overStatus,
        });
      }
      return;
    }

    // Check if we dropped on a task in a different column
    const overTask = filteredTasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      updateMutation.mutate({
        taskId: activeId,
        status: overTask.status,
      });
    }
  };

  const projects = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full p-4 sm:p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-3xl">{statusConfig.Todo.icon}</span>
              <span>Kanban Board</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {!projects?.isLoading && projects?.data?.projects?.length > 0 ? (
              <SheetCreateTask />
            ) : !projects?.isLoading ? (
              <CreateProjectRequiredDialog />
            ) : null}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-xs px-4 py-2 text-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-project-blue/50 bg-card/50 backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.354-4.354A7 7 0 1116.954 16.954z"
                />
              </svg>
            </div>
          </div>
        </div>

        <Separator className="mb-6 opacity-50" />

        {/* Global Loading State */}
        {tasks.isLoading ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {Object.entries(statusConfig).map(([statusKey, config]) => {
              const status = statusKey as StatusKey;
              return (
                <SortableColumn
                  key={status}
                  status={status}
                  config={config}
                  tasks={[]}
                  isLoading={true}
                />
              );
            })}
          </div>
        ) : apiTasks.length === 0 ? (
          // Show empty state when no tasks exist
          <EmptyTasks />
        ) : (
          // Kanban Columns
          <div className="flex flex-col lg:flex-row gap-6">
            {Object.entries(statusConfig).map(([statusKey, config]) => {
              const status = statusKey as StatusKey;
              const tasksInColumn = tasksByStatus[status] || [];

              return (
                <SortableColumn
                  key={status}
                  status={status}
                  config={config}
                  tasks={tasksInColumn}
                  isLoading={tasks.isLoading}
                />
              );
            })}
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {draggedTask ? (
            <div className="mb-3">
              <TaskCard
                taskId={draggedTask.id}
                taskStatus={draggedTask.status}
                deadline={draggedTask.dueDate}
                title={draggedTask.title}
                description={draggedTask.description}
                priority={draggedTask.priority}
                assignee={{
                  name: draggedTask.assignee?.name || "Unassigned",
                  role: draggedTask.assignee?.role || "Team Member",
                  avatarUrl:
                    draggedTask.assignee?.avatarUrl ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                  isOnline: draggedTask.assignee?.isOnline ?? false,
                }}
              />
            </div>
          ) : null}
        </DragOverlay>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Total tasks:{" "}
              <strong className="text-foreground font-medium">
                {apiTasks.length}
              </strong>
            </span>
            {searchTerm && (
              <span>
                Filtered:{" "}
                <strong className="text-foreground font-medium">
                  {filteredTasks.length}
                </strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")}`}
                ></div>
                <span className="text-xs">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default TaskList;