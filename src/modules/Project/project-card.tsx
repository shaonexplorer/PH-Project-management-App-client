"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { DialogAddMember } from "./Add-member-dialog";
import { DeleteProjectConfirmDialog } from "./Delete-Confirm-dialog";
import { UpdateProjectDialog } from "./Update-Project-Dialog";

interface ProjectCardProps {
  projectId: string;
  title?: string;
  description?: string;
  projectLead?: {
    name: string;
    avatarUrl: string;
  };
  completionPercentage?: number;
  daysLeft?: number;
  deadline?: string;
  onViewDetails?: () => void;
}

// Status color mappings
const getStatusColors = (daysLeft: number, completionPercentage: number) => {
  if (completionPercentage >= 100) {
    return {
      accent: "bg-status-completed",
      badge: "bg-status-completed/15 text-status-completed",
    };
  }
  if (daysLeft <= 0) {
    return {
      accent: "bg-destructive",
      badge: "bg-destructive/15 text-destructive",
    };
  }
  if (daysLeft <= 7) {
    return {
      accent: "bg-amber-500",
      badge: "bg-amber-500/15 text-amber-500",
    };
  }
  return {
    accent: "bg-primary",
    badge: "bg-primary/15 text-primary",
  };
};

export default function ProjectInfoCard({
  projectId,
  title = "Global Brand Refresh",
  description = "",
  projectLead = {
    name: "Sarah Jenkins",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
  completionPercentage = 75,
  daysLeft = 12,
  deadline = "",
  onViewDetails,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const statusColors = getStatusColors(daysLeft, completionPercentage);

  useEffect(() => {
    // --- Entrance Animation Sequence ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(
        cardRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        0,
      ).from(
        progressBarRef.current,
        {
          width: "0%",
          duration: 1.2,
          ease: "power4.out",
        },
        0.3,
      );
    });

    return () => ctx.revert(); // Clean up GSAP timelines on unmount
  }, [completionPercentage]);

  return (
    <div className="hover:shadow-xl transition-shadow duration-300">
      <div
        ref={cardRef}
        className="flex flex-col h-full bg-card rounded-2xl p-6 border border-border/50 overflow-hidden"
      >
        {/* Accent Bar - Left border that indicates status */}
        <div
          ref={accentRef}
          className={cn(
            "absolute top-0 left-0 bottom-0 w-1.5",
            statusColors.accent,
          )}
        />

        {/* Title & Actions Row */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-card-foreground leading-tight">
            {title || "Untitled Project"}
          </h2>
          <div className="flex gap-2">
            <UpdateProjectDialog
              projectId={projectId}
              currentName={title || ""}
              currentDescription={description}
              currentDeadline={deadline}
            />
            <DeleteProjectConfirmDialog
              projectId={projectId}
              projectTitle={title || ""}
            />
          </div>
        </div>

        {/* Project Lead Info */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={projectLead?.avatarUrl || "/avatars/default-avatar.png"}
            alt={projectLead?.name || "Project Lead"}
            className="w-10 h-10 rounded-full object-cover border-2 border-border/50"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground">
              {projectLead?.name || "Unassigned"}
            </p>
            <p className="text-xs text-muted-foreground">
              Project Lead
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  statusColors.badge,
                )}
              >
                {completionPercentage >= 100 ? "Completed" : "Active"}
              </span>
              <span className="text-sm text-muted-foreground">
                {completionPercentage}% Complete
              </span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-muted/50 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                completionPercentage >= 100
                  ? "bg-status-completed"
                  : completionPercentage >= 50
                    ? "bg-primary"
                    : "bg-amber-500",
              )}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-center pt-3 border-t border-border/30 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
            </span>
          </div>
          <DialogAddMember projectId={projectId} />
        </div>
      </div>
    </div>
  );
}