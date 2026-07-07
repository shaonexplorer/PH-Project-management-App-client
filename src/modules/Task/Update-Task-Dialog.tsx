"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTask } from "@/actions/Tasks/update";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { getCookieByName } from "@/actions/auth/cookie";

const taskUpdateSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  deadline: z.string().optional(),
  status: z.enum(["Todo", "In_Progress", "Completed"]),
});

type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>;

interface UpdateTaskDialogProps {
  taskId: string;
  currentStatus: "Todo" | "In_Progress" | "Completed";
  currentTitle?: string;
  currentDescription?: string;
  currentPriority?: "Low" | "Medium" | "High";
  currentDeadline?: string;
}

export function UpdateTaskDialog({
  taskId,
  currentStatus,
  currentTitle = "",
  currentDescription = "",
  currentPriority = "Medium",
  currentDeadline = "",
}: UpdateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskUpdateFormData>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      title: currentTitle,
      description: currentDescription,
      priority: currentPriority,
      deadline: currentDeadline,
      status: currentStatus,
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const id = await getCookieByName("userId");
      setUser(id);
    };

    getUser();
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: TaskUpdateFormData) => {
      const updateData: {
        taskId: string;
        status?: string;
        title?: string;
        description?: string;
        priority?: "Low" | "Medium" | "High" | "Critical";
        dueDate?: string;
      } = { taskId };

      // Only include fields that have been changed
      if (data.status !== currentStatus) updateData.status = data.status;
      if (data.title !== currentTitle) updateData.title = data.title;
      if (data.description !== currentDescription)
        updateData.description = data.description;
      if (data.priority !== currentPriority)
        updateData.priority = data.priority;
      if (data.deadline !== currentDeadline) updateData.dueDate = data.deadline;

      // If nothing changed, just update status if it's different
      if (
        Object.keys(updateData).length === 1 &&
        updateData.taskId === taskId
      ) {
        if (data.status !== currentStatus) {
          updateData.status = data.status;
        }
      }

      return updateTask(updateData);
    },
    onSuccess: () => {
      toast.success("Task updated successfully");
      setOpen(false);
      // Invalidate any task list queries so UI refreshes.
      queryClient.invalidateQueries({ queryKey: ["my-tasks", user] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      toast.error(message);
      console.error("Error updating task:", error);
    },
  });

  const onSubmit = async (data: TaskUpdateFormData) => {
    mutation.mutate(data);
  };

  const statusOptions = [
    { value: "Todo", label: "Todo" },
    { value: "In_Progress", label: "In‑Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low", color: "text-emerald-500" },
    { value: "Medium", label: "Medium", color: "text-amber-500" },
    { value: "High", label: "High", color: "text-orange-500" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full text-secondary-foreground hover:bg-muted-foreground transition-colors duration-200"
          title="Edit Project"
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Task</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the task details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              {...register("title")}
              placeholder="Task title"
              className="border-border/50"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <textarea
              id="task-description"
              {...register("description")}
              placeholder="Task description"
              className="min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="grid gap-2">
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              onValueChange={(value: "Low" | "Medium" | "High") =>
                setValue("priority", value)
              }
              defaultValue={currentPriority}
            >
              <SelectTrigger className="w-full border-border/50">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {priorityOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="py-2"
                    >
                      <span className={`font-medium ${opt.color}`}>
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div className="grid gap-2">
            <Label htmlFor="task-deadline">Due Date</Label>
            <Input id="task-deadline" type="date" {...register("deadline")} />
            {errors.deadline && (
              <p className="text-sm text-destructive mt-1">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="task-status">Status</Label>
            <Select
              onValueChange={(value: "Todo" | "In_Progress" | "Completed") =>
                setValue("status", value)
              }
              defaultValue={currentStatus}
            >
              <SelectTrigger className="w-full border-border/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((opt) => {
                    const statusColor =
                      opt.value === "Todo"
                        ? "text-status-todo"
                        : opt.value === "In_Progress"
                          ? "text-status-inprogress"
                          : "text-status-completed";
                    return (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="py-2"
                      >
                        <span className={`font-medium ${statusColor}`}>
                          {opt.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
            >
              {mutation.isPending ? "Updating…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
