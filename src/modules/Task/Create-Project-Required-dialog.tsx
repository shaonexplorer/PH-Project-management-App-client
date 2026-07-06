"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, FolderPlus } from "lucide-react";

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
import { useState } from "react";

export function CreateProjectRequiredDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);

  const handleCreateProject = () => {
    setIsOpen(false);
    // Navigate to the projects page where they can create a project
    router.push("/dashboard/projects");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            No Projects Available
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You need to create a project before you can add tasks. Tasks must
            belong to a project, so please create a project first.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleCreateProject} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
