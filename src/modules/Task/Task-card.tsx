import { Card } from "@/components/ui/card";

import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";

import { UpdateTaskDialog } from "./Update-Task-Dialog";
import { DeleteTaskConfirmDialog } from "./Delete-Task-Confirm-dialog";
import { User } from "lucide-react";

interface TaskCardProps {
  taskId: string;
  taskStatus: "Todo" | "In_Progress" | "Completed";
  title?: string;
  description?: string;
  difficulty?: "Low" | "Medium" | "High";
  priority?: "Low" | "Medium" | "High" | "Critical";
  deadline?: string;
  lastUpdated?: string;
  assignee?: {
    name: string;
    role?: string;
    avatarUrl?: string;
    isOnline?: boolean;
  };
  onUpdateStatus?: () => void;
}

// Priority color mapping
const priorityColors = {
  Critical: "text-destructive",
  High: "text-orange-500",
  Medium: "text-amber-500",
  Low: "text-emerald-500",
} as const;

const priorityBgColors = {
  Critical: "bg-destructive/10",
  High: "bg-orange-500/10",
  Medium: "bg-amber-500/10",
  Low: "bg-emerald-500/10",
} as const;

export default function TaskCard({
  taskId,
  title = "Implement OAuth Authentication",
  description = "Integrate robust security protocols using OAuth 2.0. Ensure multi-provider support including GitHub and Google, with full refresh token rotation logic for enhanced session security.",
  priority = "Critical",
  deadline = "Oct 24, 2023",
  assignee = {
    name: "Sarah Jenkins",
    role: "Lead Engineer",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    isOnline: true,
  },
  taskStatus,
}: TaskCardProps) {
  // Status color mapping
  const getStatusColors = (status: string) => {
    if (status === "Completed")
      return {
        badge:
          "bg-status-completed/15 text-status-completed border-status-completed/30",
        accent: "bg-status-completed",
      };
    if (status === "In_Progress")
      return {
        badge:
          "bg-status-inprogress/15 text-status-inprogress border-status-inprogress/30",
        accent: "bg-status-inprogress",
      };
    return {
      badge: "bg-status-todo/15 text-status-todo border-status-todo/30",
      accent: "bg-status-todo",
    };
  };

  const statusColors = getStatusColors(taskStatus);

  return (
    <div className="hover:scale-[1.01] transition-all duration-200 flex flex-col h-full">
      {/* Main Card Frame */}
      <Card
        className={cn(
          "bg-card flex flex-col h-full p-4 shadow-lg",
          "transition-all duration-300 border",
          "hover:shadow-xl hover:shadow-black/5",
          "border-border/50",
          "overflow-hidden relative",
        )}
      >
        {/* Accent Bar - positioned inside card with overflow-hidden clipping */}
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 w-0.5",
            statusColors.accent,
            "rounded-l-xl",
            "z-0",
          )}
        ></div>

        {/* Header Section with Status Badge */}
        <div className="flex items-start gap-3  relative">
          <span
            className={cn(
              "w-fit inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
              statusColors.badge,
            )}
          >
            {taskStatus.split("_").join(" ")}
          </span>
          {/* <h2 className="text-sm font-bold text-card-foreground leading-tight line-clamp-2">
            {title}
          </h2> */}
        </div>

        {/* Task Summary Description */}
        <p className="text-sm opacity-75 line-clamp-2 flex-1">{description}</p>

        {/* Meta Information Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Priority Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                priorityBgColors[priority].replace("bg-", "bg-"),
              )}
            ></div>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                "bg-muted/50 text-muted-foreground",
                priorityColors[priority],
              )}
            >
              {priority}
            </span>
          </div>

          {/* Deadline */}
          <div className="text-xs text-muted-foreground">
            {deadline && `Due: ${format(deadline, "MMM d")}`}
          </div>
        </div>

        {/* Assignee & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30 mt-auto">
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <User className="w-[18px] h-[18px] text-muted-foreground" />
              {assignee.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-completed border-2 border-card rounded-full" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-card-foreground truncate">
                {assignee.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UpdateTaskDialog
              taskId={taskId}
              currentStatus={taskStatus}
              currentTitle={title}
              currentDescription={description}
              currentPriority={priority}
              currentDeadline={
                deadline && isValid(parse(deadline, "MMM d, yyyy", new Date()))
                  ? format(
                      parse(deadline, "MMM d, yyyy", new Date()),
                      "yyyy-MM-dd",
                    )
                  : ""
              }
            />
            <DeleteTaskConfirmDialog taskId={taskId} taskTitle={title} />
          </div>
        </div>
      </Card>
    </div>
  );
}
