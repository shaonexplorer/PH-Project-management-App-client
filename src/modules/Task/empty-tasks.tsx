"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyTasksProps {
  onCreateTask?: () => void;
}

export function EmptyTasks({ onCreateTask }: EmptyTasksProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full">
      <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-902/30 dark:to-purple-902/30">
        <CheckCircle2 className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        All caught up!
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        No tasks have been created yet. Create your first task to get started
        with organizing your work.
      </p>
      {onCreateTask && (
        <Button onClick={onCreateTask} className="gap-2">
          Create First Task
        </Button>
      )}
    </div>
  );
}