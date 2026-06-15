"use client";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addNewProjectMember,
  addOldProjectMember,
} from "@/actions/Project/add-member";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamMembers } from "@/actions/team-member";
import { toast } from "sonner";
import { useState } from "react";

// Schemas
const newMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const existingMemberSchema = z.object({
  userId: z.string().min(1, "Select a member"),
});

export function DialogAddMember({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
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

  const {
    register: registerNew,
    handleSubmit: handleNewSubmit,
    formState: { errors: newErrors },
    reset: resetNew,
  } = useForm({
    resolver: zodResolver(newMemberSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const {
    register: registerExisting,
    handleSubmit: handleExistingSubmit,
    formState: { errors: existingErrors },
    reset: resetExisting,
    setValue,
  } = useForm({
    resolver: zodResolver(existingMemberSchema),
    defaultValues: { userId: "" },
  });

  const queryClient = useQueryClient();

  const addNew = useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) =>
      addNewProjectMember({
        data: { email: data.email, name: data.name, password: data.password },
        projectId: projectId,
      }),
    onSuccess: (result) => {
      console.log("Member added successfully:", result);
      // Optionally close the sheet or reset form here
      setOpen(false);
      toast.success("Member added succesfully");

      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to add member to the project");
    },
  });

  const addOld = useMutation({
    mutationFn: (data: { userId: string }) =>
      addOldProjectMember({
        projectId,
        userId: data.userId,
      }),
    onSuccess: (result) => {
      console.log("Member added successfully:", result);
      // Optionally close the sheet or reset form here
      setOpen(false);
      toast.success("Member added succesfully");

      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to add member to the project");
    },
  });

  const onAddNew = async (data: z.infer<typeof newMemberSchema>) => {
    await addNew.mutateAsync(data);
    resetNew();
  };

  const onAddExisting = async (data: z.infer<typeof existingMemberSchema>) => {
    await addOld.mutateAsync({ userId: data.userId });
    resetExisting();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 font-semibold dark:text-[#d3e4fe] text-primary hover:underline underline-offset-4 transform group-hover:translate-x-1 transition-transform duration-300">
          Add Member
          <Plus className="w-6 h-6 text-current" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add an existing user to the project or invite a new member.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Add Existing</TabsTrigger>
            <TabsTrigger value="new">Add New</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <form
              onSubmit={handleExistingSubmit(onAddExisting)}
              className="space-y-4"
            >
              <Label htmlFor="existing-member" className="sr-only">
                Select Member
              </Label>
              <div className="w-full">
                <Select
                  onValueChange={(value) => setValue("userId", value)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {allMembers?.map((m: { id: string; value: string }) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" {...registerExisting("userId")} />
              </div>
              {existingErrors.userId && (
                <p className="text-sm text-red-500">
                  {existingErrors.userId.message}
                </p>
              )}
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={addOld.isPending}>
                  {addOld.isPending ? "Adding Existing ..." : "Add Existing"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="new">
            <form onSubmit={handleNewSubmit(onAddNew)} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...registerNew("name")} />
                  {newErrors.name && (
                    <p className="text-sm text-red-500">
                      {newErrors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...registerNew("email")} />
                  {newErrors.email && (
                    <p className="text-sm text-red-500">
                      {newErrors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerNew("password")}
                />
                {newErrors.password && (
                  <p className="text-sm text-red-500">
                    {newErrors.password.message}
                  </p>
                )}
              </div>
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={addNew.isPending}>
                  {addNew.isPending ? "Adding New ..." : "Add New"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
