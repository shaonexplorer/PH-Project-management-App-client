"use client";

import { useEffect, useState } from "react";

import TaskCard from "./Task-card";
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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Status definitions
const statusConfig = {
  Todo: {
    key: "Todo",
    label: "To Do",
    description: "Tasks that need to be done",
    icon: "📋",
  },
  In_Progress: {
    key: "In_Progress",
    label: "In Progress",
    description: "Tasks currently being worked on",
    icon: "🚧",
  },
  Completed: {
    key: "Completed",
    label: "Completed",
    description: "Finished tasks",
    icon: "✅",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
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
}: {
  status: StatusKey;
  config: (typeof statusConfig)[StatusKey];
  tasks: KanbanTask[];
}) {
  // Make the entire column a droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex flex-col bg-background/50 rounded-xl border transition-all duration-300 ${
        isOver
          ? "border-primary bg-background/80 shadow-lg ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <span>{config.label}</span>
          <span className="ml-auto bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
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
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-3xl mb-2 opacity-50">📭</div>
              <p className="text-sm opacity-50">Drop task here</p>
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

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag start
  const handleDragStart = (event: DragEndEvent) => {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full p-4 bg-muted rounded-lg">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">
              {statusConfig.Todo.icon} Kanban Board
            </span>
          </div>
          <div className="flex items-center gap-3">
            <SheetCreateTask />
            <input
              type="text"
              placeholder="Search tasks…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-sm"
            />
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Kanban Columns */}
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
              />
            );
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedTask ? (
            <div className="bg-background border border-border rounded-lg p-4 shadow-lg w-75">
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
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Total tasks: <strong className="text-foreground">
                {apiTasks.length}
              </strong>
            </span>
            {searchTerm && (
              <span>
                Filtered: <strong className="text-foreground">
                  {filteredTasks.length}
                </strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs">To Do</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default TaskList;