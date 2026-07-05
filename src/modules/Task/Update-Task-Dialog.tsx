"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { getCookieByName } from "@/actions/auth/cookie";

export function UpdateTaskDialog({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const id = await getCookieByName("userId");
      setUser(id);
    };

    getUser();
  }, []);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (status: string) => updateTask({ taskId, status }),
    onSuccess: () => {
      toast.success("Task status updated");
      setOpen(false);
      // Invalidate any task list queries so UI refreshes.
      queryClient.invalidateQueries({ queryKey: ["my-tasks", user] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update task");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    mutation.mutate(selectedStatus);
  };

  const statusOptions = [
    { value: "Todo", label: "Todo" },
    { value: "In_Progress", label: "In‑Progress" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit bg-card text-card-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-card/80 transition-all active:scale-95 flex items-center justify-center gap-2 border border-border/50 shadow-md">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm border-border/50 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Update Task Status</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose a new status for this task
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Select
            onValueChange={(value) => setSelectedStatus(value)}
            defaultValue={currentStatus}
          >
            <SelectTrigger className="w-full border-border/50">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((opt) => {
                  const isSelected = opt.value === selectedStatus;
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
              className="bg-project-blue text-primary-foreground hover:bg-project-blue/90"
            >
              {mutation.isPending ? "Updating…" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
