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
import { createProjectAction } from "@/actions/Project/create";
import { getTeamMembers } from "@/actions/team-member";
import { useState } from "react";
import { toast } from "sonner";

// Zod schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  memberId: z.string().min(1, "Assign a member"),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export function SheetCreateProject() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      memberId: "",
      dueDate: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateProjectForm) => createProjectAction(data),
    onSuccess: (result) => {
      console.log("Project created successfully:", result);
      // Optionally close the sheet or reset form here
      setOpen(false);
      toast.success("Project created succesfully");

      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to create project");
    },
  });

  const teamMembers = useQuery({
    queryKey: ["team-member"],
    queryFn: getTeamMembers,
  });

  const allMembers = teamMembers?.data?.members.map(
    (m: { id: string; name: string }) => ({
      id: m.id,
      value: m.name,
    }),
  );

  const onSubmit = async (data: CreateProjectForm) => {
    const result = await mutation.mutateAsync(data);
    console.log("Mutation result:", result);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
          <Plus className="w-5 h-5" />
          Create Project
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
          <SheetDescription>
            Fill in the details for your new project.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-4 h-full"
        >
          {/* Project Name */}
          <div className="grid gap-3">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              {...register("name")}
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-3">
            <Label htmlFor="project-description">Description</Label>
            <textarea
              id="project-description"
              {...register("description")}
              placeholder="Optional description"
              className="min-h-[80px] w-full rounded-md border border-input   px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Assign Member */}
          <div className="grid gap-3">
            <Label htmlFor="project-member">Project Lead</Label>
            <Select
              onValueChange={(value) => setValue("memberId", value)}
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
            {errors.memberId && (
              <p className="text-sm text-red-500">{errors.memberId.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="grid gap-3">
            <Label htmlFor="project-due-date">Due Date</Label>
            <Input id="project-due-date" type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>

          <SheetFooter className="mt-auto w-full p-0 pb-6">
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Project"}
            </Button>
            <SheetClose asChild>
              <Button className="w-full" variant="outline">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
