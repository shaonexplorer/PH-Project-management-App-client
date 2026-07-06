"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/actions/Project/delete";

export function DeleteProjectConfirmDialog({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteProjectAction(id),
    onSuccess: () => {
      toast.success("Project deleted successfully");
      setOpen(false);
      // Invalidate any project list queries so UI refreshes.
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete project";
      toast.error(message);
    },
  });

  const handleDelete = () => {
    mutation.mutate(projectId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full text-secondary-foreground hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors duration-200"
          title="Delete Project"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Project?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete &#34;{projectTitle}&#34;? This
            action cannot be undone and all associated tasks will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleDelete}
          >
            {mutation.isPending ? "Deleting…" : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
