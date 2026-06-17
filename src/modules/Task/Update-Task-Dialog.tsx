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
  triggerLabel = "Change Status",
}: {
  taskId: string;
  currentStatus: string;
  triggerLabel?: string;
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
        <Button className="w-full bg-primary-foreground text-primary px-4 py-4 rounded-xl text-sm font-semibold hover:bg-primary-foreground/80 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-lg shadow-[#adc6ff]/10 whitespace-nowrap">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Task Status</DialogTitle>
          <DialogDescription>
            Choose a new status for this task and click update.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Select
            onValueChange={(value) => setSelectedStatus(value)}
            defaultValue={currentStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating…" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
