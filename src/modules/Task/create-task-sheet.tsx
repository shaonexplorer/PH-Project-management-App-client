"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef } from "react";

import { getTeamMembersByProject } from "@/actions/team-member";
import { useState } from "react";
import { toast } from "sonner";
import { createTaskAction } from "@/actions/Tasks/create";
import { getMyProjects } from "@/actions/Project/get";
import { AddMemberToProjectDialog } from "./Add-member-to-project-dialog";

// Zod schema for task creation
const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.string().optional(),
  assignedMemberId: z.string().min(1, "Assign a member"),
  projectId: z.string().min(1, "Assign a project"),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

export function SheetCreateTask() {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const hasShownDialogRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedMemberId: "",
      deadline: "",
      projectId: "",
      priority: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTaskForm) => createTaskAction(data),
    onSuccess: (result) => {
      console.log("Task created successfully:", result);
      setOpen(false);
      toast.success("Task created successfully");

      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
      hasShownDialogRef.current = false; // Reset for next time
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error(error.message || "Failed to create task");
    },
  });

  const teamMembers = useQuery({
    queryKey: ["team-member-project", projectId],
    queryFn: () => getTeamMembersByProject(projectId),
    enabled: !!projectId, // Only fetch when projectId is set
  });

  const allMembers = teamMembers?.data?.members.map(
    (m: { userId: string; name: string }) => ({
      id: m.userId,
      value: m.name,
    }),
  );

  // Check if project has no members

  // Show dialog when project is selected but has no members
  // Use useLayoutEffect to avoid the synchronous state update warning
  useLayoutEffect(() => {
    if (
      projectId &&
      teamMembers?.data?.members?.length === 0 &&
      !hasShownDialogRef.current
    ) {
      hasShownDialogRef.current = true;
      setShowAddMemberDialog(true);
    }
  }, [projectId, teamMembers?.data?.members?.length]);

  const projects = useQuery({
    queryKey: ["user-project"],
    queryFn: () => getMyProjects(),
  });

  const myProjects = projects?.data?.projects.map(
    (m: { id: string; name: string }) => ({
      id: m.id,
      value: m.name,
    }),
  );

  const priorityLevels = [
    { value: "Low", name: "Low" },
    { value: "Medium", name: "Medium" },
    { value: "High", name: "High" },
  ];

  const onSubmit = async (data: CreateTaskForm) => {
    const result = await mutation.mutateAsync(data);
    console.log("Mutation result:", result);
  };

  const handleMemberAdded = () => {
    setShowAddMemberDialog(false);
    queryClient.invalidateQueries({
      queryKey: ["team-member-project", projectId],
    });
  };

  // Reset dialog flag when sheet closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      hasShownDialogRef.current = false;
    }
    setOpen(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
          <Plus className="w-5 h-5" />
          Create Task
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>
            Fill in the details for your new task.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4 h-full"
        >
          {/* Task Title */}
          <div className="grid gap-3">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              {...register("title")}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-3">
            <Label htmlFor="task-description">Description</Label>
            <textarea
              id="task-description"
              {...register("description")}
              placeholder="Optional description"
              className="min-h-[80px] w-full rounded-md border border-input   px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Assign Project */}
          <div className="grid gap-3">
            <Label htmlFor="task-project">Project</Label>
            <Select
              onValueChange={(value) => {
                setValue("projectId", value);
                setProjectId(value);
              }}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {myProjects?.map((project: { id: string; value: string }) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-sm text-red-500">{errors.projectId.message}</p>
            )}
          </div>

          {/* Assign Member */}
          <div className="grid gap-3">
            <Label htmlFor="task-member">Assign Member</Label>
            <Select
              disabled={projectId.length === 0}
              onValueChange={(value) => setValue("assignedMemberId", value)}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allMembers?.map((member: { id: string; value: string }) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.assignedMemberId && (
              <p className="text-sm text-red-500">
                {errors.assignedMemberId.message}
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="grid gap-3">
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              onValueChange={(value) => setValue("priority", value)}
              defaultValue=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {priorityLevels?.map(
                    (level: { name: string; value: string }) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.name}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500">{errors.priority.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="grid gap-3">
            <Label htmlFor="task-due-date">Due Date</Label>
            <Input id="task-due-date" type="date" {...register("deadline")} />
            {errors.deadline && (
              <p className="text-sm text-red-500">{errors.deadline.message}</p>
            )}
          </div>

          <SheetFooter className="mt-auto w-full p-0 pb-6">
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Task"}
            </Button>
            <SheetClose asChild>
              <Button className="w-full" variant="outline">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>

        {/* Dialog to add member when project has no members */}
        <AddMemberToProjectDialog
          projectId={projectId}
          open={showAddMemberDialog}
          onOpenChange={setShowAddMemberDialog}
          onMemberAdded={handleMemberAdded}
        />
      </SheetContent>
    </Sheet>
  );
}
