"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { AlertCircle } from "lucide-react";
import { getMembersByProjectManager } from "@/actions/team-member";
import {
  addNewProjectMember,
  addOldProjectMember,
} from "@/actions/Project/add-member";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProjectById } from "@/actions/Project/get";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  label: string;
}

// Schemas
const newMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const existingMemberSchema = z.object({
  userId: z.string().min(1, "Select a member"),
});

interface AddMemberToProjectDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdded: () => void;
}

export function AddMemberToProjectDialog({
  projectId,
  open,
  onOpenChange,
  onMemberAdded,
}: AddMemberToProjectDialogProps) {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Fetch the project to get the creator (Project Manager)
  const project = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: open, // Only fetch when dialog is open
  });

  // Get Project Manager ID from the project
  const projectManagerId = project.data?.project?.createdBy;

  // Fetch available members (members under the Project Manager, excluding current project)
  const availableMembers = useQuery({
    queryKey: ["available-members", projectManagerId, projectId],
    queryFn: () => {
      if (!projectManagerId) return { members: [] };
      return getMembersByProjectManager(projectManagerId, projectId);
    },
    enabled: !!projectManagerId, // Only fetch when we have a Project Manager ID
  });

  const allMembers: TeamMember[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    availableMembers?.data?.members?.map((m: any) => {
      const member = m?.member || m;
      return {
        id: member?.id || m?.id,
        name: member?.name || m?.name || "",
        email: member?.email || m?.email || "",
        label: `${member?.name || m?.name || ""} (${member?.email || m?.email || ""})`,
      };
    }) || [];

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
    handleSubmit: handleExistingSubmit,
    formState: { errors: existingErrors },
    reset: resetExisting,
    setValue,
  } = useForm({
    resolver: zodResolver(existingMemberSchema),
    defaultValues: { userId: "" },
  });

  // const selectedUserId = watch("userId");

  const queryClient = useQueryClient();

  const addNew = useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) =>
      addNewProjectMember({
        data: { email: data.email, name: data.name, password: data.password },
        projectId: projectId,
      }),
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({
        queryKey: ["team-member-project", projectId],
      });
      onMemberAdded();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to add member");
    },
  });

  const addOld = useMutation({
    mutationFn: (data: { userId: string }) =>
      addOldProjectMember({
        projectId,
        userId: data.userId,
      }),
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({
        queryKey: ["team-member-project", projectId],
      });
      onMemberAdded();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to add member");
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

  const handleClose = () => {
    onOpenChange(false);
    setActiveTab("existing");
    resetNew();
    resetExisting();
  };

  const handleSelectMember = (member: TeamMember) => {
    // Stop propagation to prevent dialog close
    setSelectedMember(member);
    setValue("userId", member.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Member to Project</DialogTitle>
          <DialogDescription>
            Add an existing user to the project or invite a new member to
            complete the task.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            No members found in this project. Add a member to continue.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("existing")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "existing"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Add Existing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "new"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Add New
            </button>
          </div>

          {activeTab === "existing" && (
            <form
              onSubmit={handleExistingSubmit(onAddExisting)}
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="existing-member">Team Member</Label>
                <Combobox
                  items={allMembers}
                  value={selectedMember?.name ?? ""}
                  onValueChange={(value) => {
                    if (value) {
                      const member = allMembers.find((m) => m.name === value);
                      if (member) {
                        handleSelectMember(member);
                      }
                    }
                  }}
                  itemToStringValue={(item) => {
                    if (!item) return "";
                    if (typeof item === "string") return item;
                    return (item as TeamMember).name;
                  }}
                  filter={(item, query) => {
                    if (typeof item === "string") {
                      return item.toLowerCase().includes(query.toLowerCase());
                    }
                    const member = item as TeamMember;
                    const str = member.name.toLowerCase();
                    const email = member.email?.toLowerCase() || "";
                    return (
                      str.includes(query.toLowerCase()) ||
                      email.includes(query.toLowerCase())
                    );
                  }}
                >
                  <ComboboxInput placeholder="Search by name or email..." />
                  <ComboboxContent className="pointer-events-auto!">
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem
                          key={item.id}
                          value={item.name}
                          onSelect={() => handleSelectMember(item)}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.email}
                            </span>
                          </div>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                    <ComboboxEmpty>No members found.</ComboboxEmpty>
                  </ComboboxContent>
                </Combobox>
                {existingErrors.userId && (
                  <p className="text-sm text-destructive">
                    {existingErrors.userId.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {activeTab === "new" && (
            <form onSubmit={handleNewSubmit(onAddNew)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  {...registerNew("name")}
                  placeholder="Member name"
                />
                {newErrors.name && (
                  <p className="text-sm text-red-500">
                    {newErrors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  {...registerNew("email")}
                  placeholder="member@example.com"
                />
                {newErrors.email && (
                  <p className="text-sm text-red-500">
                    {newErrors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-password">Password</Label>
                <Input
                  id="member-password"
                  type="password"
                  {...registerNew("password")}
                  placeholder="Set password (min 6 characters)"
                />
                {newErrors.password && (
                  <p className="text-sm text-red-500">
                    {newErrors.password.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>
          {activeTab === "existing" && (
            <Button
              type="submit"
              onClick={handleExistingSubmit(onAddExisting)}
              disabled={addOld.isPending}
            >
              {addOld.isPending ? "Adding..." : "Add Existing"}
            </Button>
          )}
          {activeTab === "new" && (
            <Button
              type="submit"
              onClick={handleNewSubmit(onAddNew)}
              disabled={addNew.isPending}
            >
              {addNew.isPending ? "Adding..." : "Add New"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
