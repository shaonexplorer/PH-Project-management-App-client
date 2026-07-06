"use client";

import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyProjectsProps {
  onCreateProject?: () => void;
}

export function EmptyProjects({ onCreateProject }: EmptyProjectsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center col-span-1 lg:col-span-2 xl:col-span-3">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FolderOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No projects yet
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        You haven&apos;t created any projects yet. Start by creating your first
        project to organize your tasks and track progress.
      </p>
      {onCreateProject && (
        <Button onClick={onCreateProject} size="sm">
          Create Project
        </Button>
      )}
    </div>
  );
}
