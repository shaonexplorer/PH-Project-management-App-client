"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  addNewProjectMember,
  addOldProjectMember,
} from "@/actions/Project/add-member";
import { getTeamMembers } from "@/actions/team-member";

// Schema for adding a new member
const newMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for adding an existing member
const existingMemberSchema = z.object({
  userId: z.string().min(1, "Please select a member"),
});

export function DialogAddMember({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);

  // Fetch team members for the "Add Existing" tab
  const teamMembers = useQuery({
    queryKey: ["team-members"],
    queryFn: getTeamMembers,
  });

  const allMembers = teamMembers?.data?.members.map(
    (m: { id: string; name: string }) => ({
      id: m.id,
      value: m.name,
    }),
  );

  // Form for adding a new member
  const formNew = useForm<z.infer<typeof newMemberSchema>>({
    resolver: zodResolver(newMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Form for adding an existing member
  const formExisting = useForm<z.infer<typeof existingMemberSchema>>({
    resolver: zodResolver(existingMemberSchema),
    defaultValues: {
      userId: "",
    },
  });

  const queryClient = useQueryClient();

  // Mutation for adding a new member
  const addNew = useMutation({
    mutationFn: (data: z.infer<typeof newMemberSchema>) =>
      addNewProjectMember({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        projectId,
      }),
    onSuccess: () => {
      setOpen(false);
      toast.success("Member invited successfully");
      formNew.reset();
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to add member";
      toast.error(message);
    },
  });

  // Mutation for adding an existing member
  const addOld = useMutation({
    mutationFn: (data: z.infer<typeof existingMemberSchema>) =>
      addOldProjectMember({
        projectId,
        userId: data.userId,
      }),
    onSuccess: () => {
      setOpen(false);
      toast.success("Member added successfully");
      formExisting.reset();
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to add member";
      toast.error(message);
    },
  });

  const onAddNew = (data: z.infer<typeof newMemberSchema>) => {
    addNew.mutate(data);
  };

  const onAddExisting = (data: z.infer<typeof existingMemberSchema>) => {
    addOld.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Users className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add an existing team member or invite a new user to this project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Add Existing</TabsTrigger>
            <TabsTrigger value="new">Invite New</TabsTrigger>
          </TabsList>

          {/* Add Existing Member */}
          <TabsContent value="existing">
            <form
              onSubmit={formExisting.handleSubmit(onAddExisting)}
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="existing-member">Team Member</Label>
                <Select
                  onValueChange={(value) => formExisting.setValue("userId", value)}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers?.map((m: { id: string; value: string }) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formExisting.formState.errors.userId && (
                  <p className="text-sm text-destructive">
                    {formExisting.formState.errors.userId.message}
                  </p>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={addOld.isPending}
                >
                  {addOld.isPending ? "Adding..." : "Add Existing"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Invite New Member */}
          <TabsContent value="new">
            <form onSubmit={formNew.handleSubmit(onAddNew)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  {...formNew.register("name")}
                />
                {formNew.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {formNew.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...formNew.register("email")}
                />
                {formNew.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {formNew.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...formNew.register("password")}
                />
                {formNew.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {formNew.formState.errors.password.message}
                  </p>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={addNew.isPending}
                >
                  {addNew.isPending ? "Inviting..." : "Invite Member"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}