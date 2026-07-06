import { useEffect, useRef } from "react";
import gsap from "gsap";
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
  const innerCardRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Entrance Animation Sequence ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
      }).to(
        progressBarRef.current,
        {
          width: `${completionPercentage}%`,
          duration: 1.5,
          ease: "power4.out",
        },
        "-=0.5",
      );
    });

    return () => ctx.revert(); // Clean up GSAP timelines on unmount
  }, [completionPercentage]);

  return (
    <div className="hover:scale-[1.02] transition-transform duration-300">
      {/* Container Wrapper with initial opacity/transform for entrance */}
      <main ref={cardRef} className=" w-full  h-full ">
        <div
          ref={innerCardRef}
          className="flex flex-col h-full relative bg-card rounded-2xl p-6 group transition-all duration-300 overflow-hidden style={{ border: '1px solid rgba(115, 118, 134, 0.1)' }}"
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          {/* Hover Sweep Gradient Layer */}
          <div
            ref={highlightRef}
            className="absolute top-0 left-[-100%] w-1/2 h-full pointer-events-none bg-gradient-to-r from-transparent via-blue-600/[0.03] to-transparent"
          />

          {/* Title & Actions Row */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-base font-semibold text-card-foreground/80 tracking-tight">
              {title}
            </h1>
            <div className="flex gap-2">
              <UpdateProjectDialog
                projectId={projectId}
                currentName={title}
                currentDescription={description}
                currentDeadline={deadline}
              />
              <DeleteProjectConfirmDialog
                projectId={projectId}
                projectTitle={title}
              />
            </div>
          </div>

          {/* Progress Velocity Gauge Section */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-end">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Current Velocity
              </p>
              <p className="text-base font-semibold text-orange-300">
                {completionPercentage}% Complete
              </p>
            </div>
            <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-primary w-0 rounded-full transition-all duration-1000 ease-out"
              />
            </div>
          </div>

          {/* Card Meta Footer Section */}
          <div className="flex justify-between items-center pt-4 border-t border-[#c3c6d7]/30">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#d3e4fe] text-[#0b1c30] rounded-full">
              <svg
                className="w-4 h-4 text-current"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold">
                {daysLeft} Days Left
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DialogAddMember projectId={projectId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
