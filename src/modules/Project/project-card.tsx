import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Plus, User } from "lucide-react";
import { DialogAddMember } from "./Add-member-dialog";

interface ProjectCardProps {
  projectId: string;
  title?: string;
  projectLead?: {
    name: string;
    avatarUrl: string;
  };
  completionPercentage?: number;
  daysLeft?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export default function ProjectInfoCard({
  projectId,
  title = "Global Brand Refresh",
  projectLead = {
    name: "Sarah Jenkins",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
  completionPercentage = 75,
  daysLeft = 12,
  onEdit,
  onDelete,
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
            <h1 className="text-lg font-semibold text-card-foreground/80 tracking-tight">
              {title}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="w-10 h-10 flex items-center justify-center rounded-full text-secondary-foreground hover:bg-muted-foreground transition-colors duration-200"
                title="Edit Project"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="w-10 h-10 flex items-center justify-center rounded-full text-secondary-foreground hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors duration-200"
                title="Delete Project"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Member Meta Information */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              {/* <img
                alt={projectLead.name}
                className="w-full h-full object-cover rounded-full border-2 border-secondary"
                src={projectLead.avatarUrl}
              /> */}
              <User className="w-[50px] h-[50px]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#006c49] rounded-full border-2 border-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Project Lead
              </p>
              <p className="text-md font-semibold text-card-foreground">
                {projectLead.name}
              </p>
            </div>
          </div>

          {/* Progress Velocity Gauge Section */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-end">
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                Current Velocity
              </p>
              <p className="text-lg font-semibold text-orange-300">
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
              <span className="text-[12px] font-semibold">
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
