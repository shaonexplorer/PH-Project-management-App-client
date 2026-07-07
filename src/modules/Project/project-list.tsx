"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import ProjectInfoCard from "./project-card";
import { ProjectCardSkeleton } from "./project-card-skeleton";
import { EmptyProjects } from "./empty-projects";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetCreateProject } from "./Create-Project-sheet";
import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "@/actions/Project/get";
import { getTasksByProject } from "@/actions/Tasks/get-by-project";
import { differenceInDays } from "date-fns";

interface ProjectWithTasks {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  projectLead?: {
    name: string;
    avatarUrl: string;
  };
  members?: Array<{
    name: string;
    avatarUrl?: string;
  }>;
  completionPercentage?: number;
  daysLeft?: number;
  status?: string;
  tasks?: Array<{
    id: string;
    status: "Todo" | "In_Progress" | "Completed";
  }>;
}

interface Task {
  id: string;
  status: "Todo" | "In_Progress" | "Completed";
}

// Mock project data – replace with real API/data source later
const mockProjects: ProjectWithTasks[] = [
  {
    id: "1",
    name: "Global Brand Refresh",
    projectLead: {
      name: "Sarah Jenkins",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    completionPercentage: 75,
    daysLeft: 12,
    status: "active",
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    projectLead: {
      name: "Alex Lee",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    },
    completionPercentage: 40,
    daysLeft: 30,
    status: "on-hold",
  },
  {
    id: "3",
    name: "Quarterly Reporting",
    projectLead: {
      name: "Mia Patel",
      avatarUrl:
        "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=150",
    },
    completionPercentage: 100,
    daysLeft: 0,
    status: "completed",
  },
];

// Calculate completion percentage from tasks
function calculateCompletionPercentage(tasks?: Task[]): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  return Math.round((completedCount / tasks.length) * 100);
}

function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const projects = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });

  // Fetch tasks for each project and calculate completion percentage
  const projectTasks = useQuery({
    queryKey: ["project-tasks", projects?.data?.projects?.map((p: any) => p.id)],
    queryFn: async () => {
      const projectIds = projects?.data?.projects?.map((p: any) => p.id) || [];
      const tasksMap: Record<string, Task[]> = {};

      for (const projectId of projectIds) {
        try {
          const result = await getTasksByProject(projectId);
          tasksMap[projectId] = result?.tasks || [];
        } catch (error) {
          console.error(`Failed to fetch tasks for project ${projectId}:`, error);
          tasksMap[projectId] = [];
        }
      }
      return tasksMap;
    },
    enabled: !!projects?.data?.projects?.length,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredProjects = useMemo(() => {
    const projectsData = projects?.data?.projects || mockProjects;
    return projectsData.filter((p: any) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || p.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [projects?.data?.projects, searchTerm, filter]);

  // console.log({ projects: projects?.data?.projects });

  return (
    <div className="w-full p-4 bg-muted rounded-lg">
      {/* Header controls: create button, search, filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <SheetCreateProject />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search projects…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Select>
            <SelectTrigger className="flex-1 md:min-w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Project cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.isLoading || projectTasks.isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))
        ) : filteredProjects.length === 0 ? (
          // Show empty state when no projects exist
          <EmptyProjects />
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filteredProjects.map((project: any) => {
            const daysLeft = differenceInDays(
              new Date(project.deadline),
              new Date(),
            );

            // Get tasks for this project and calculate completion percentage
            const projectTaskData = projectTasks.data?.[project.id] || [];
            const calculatedCompletion = calculateCompletionPercentage(projectTaskData);

            // Use server-provided completion percentage if available, otherwise use calculated
            const completionPercentage = project.completionPercentage ?? calculatedCompletion;

            return (
              <ProjectInfoCard
                projectId={project.id}
                key={project.id}
                title={project.name}
                description={project.description}
                deadline={project.deadline}
                projectLead={
                  project.projectLead || {
                    name: project.members?.[0]?.name || "John Doe",
                    avatarUrl:
                      project.members?.[0]?.avatarUrl ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                  }
                }
                completionPercentage={completionPercentage}
                daysLeft={project.daysLeft ?? daysLeft}
                onViewDetails={() => console.log("View", project.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default ProjectList;