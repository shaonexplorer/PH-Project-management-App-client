import { Card } from "@/components/ui/card";
import React from "react";

interface TaskCardProps {
  title?: string;
  description?: string;
  difficulty?: "Low" | "Medium" | "High";
  priority?: "Low" | "Medium" | "High" | "Critical";
  deadline?: string;
  lastUpdated?: string;
  assignee?: {
    name: string;
    role: string;
    avatarUrl: string;
    isOnline?: boolean;
  };
  onUpdateStatus?: () => void;
}

export default function TaskCard({
  title = "Implement OAuth Authentication",
  description = "Integrate robust security protocols using OAuth 2.0. Ensure multi-provider support including GitHub and Google, with full refresh token rotation logic for enhanced session security.",
  difficulty = "High",
  priority = "Critical",
  deadline = "Oct 24, 2023",
  lastUpdated = "2 hours ago",
  assignee = {
    name: "Sarah Jenkins",
    role: "Lead Engineer",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    isOnline: true,
  },
  onUpdateStatus,
}: TaskCardProps) {
  return (
    <div className="hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
      {/* Main Glass-morphism Card Frame */}
      <Card
        className="bg-card flex flex-col h-full rounded-2xl p-4 py-6 shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#424754]/30"
        style={{
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header Badge & Title Section */}
        <div className="flex justify-between items-start  h-[50px]">
          <div className="flex flex-row-reverse  flex-1">
            <div className="flex flex-1 items-center gap-2">
              {/* status */}
              <span className="ml-auto w-fit inline-flex items-center px-3 py-1 rounded-full bg-muted-foreground/50 dark:bg-muted-foreground  text-primary text-xs font-medium border border-[#ffb4ab]/30 tracking-wide">
                <svg
                  className="w-3.5 h-3.5 mr-1.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                In Progress
              </span>
            </div>

            <h1 className="flex-1 mr-auto text-lg md:text-xl font-bold text-card-foreground tracking-tight leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Task Summary Description */}
        <p className="text-sm md:text-base font-normal text-muted-foreground  w-full overflow-hidden h-full lg:h-[120px] ">
          {description}
        </p>

        {/* Priority & Deadline Grid Matrix */}
        <div className="flex gap-8  pb-2 border-b border-[#424754]/20">
          <div className="flex flex-col ">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Priority
            </span>
            <span className="text-sm md:text-base text-orange-500/70 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              High
            </span>
          </div>
          <div className="flex flex-col  ml-auto sm:ml-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Deadline
            </span>
            <span className="text-sm md:text-base text-card-foreground font-medium">
              {deadline}
            </span>
          </div>
        </div>

        {/* Assignee Meta Footprint & Call To Action */}
        <div className="flex items-end justify-between gap-8">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-shrink-0">
              <img
                alt={assignee.name}
                className="w-10 h-10 rounded-full border-2 border-[#adc6ff]/20 object-cover"
                src={assignee.avatarUrl}
              />
              {assignee.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1d2027] rounded-full" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-card-foreground truncate">
                {assignee.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {assignee.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col  items-center  gap-2 flex-1">
            <button
              onClick={onUpdateStatus}
              className="w-full bg-primary-foreground text-primary px-4 py-1 rounded-xl text-sm font-semibold hover:bg-primary-foreground/80 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-lg shadow-[#adc6ff]/10 whitespace-nowrap"
            >
              Update Status
            </button>
            <button
              onClick={onUpdateStatus}
              className="w-full bg-primary text-primary-foreground px-4 py-1 rounded-xl text-sm font-semibold hover:bg-primary/80 transition-all active:scale-95 flex items-center justify-center gap-1 shadow-lg shadow-[#adc6ff]/10 whitespace-nowrap"
            >
              Assign Member
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
