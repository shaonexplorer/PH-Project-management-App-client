"use client";

import React, { useState, useMemo } from "react";
import ProjectInfoCard from "./project-card";
import { ProjectCardSkeleton } from "./project-card-skeleton";
import { EmptyProjects } from "./empty-projects";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetCreateProject } from "./Create-Project-sheet";
import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "@/actions/Project/get";
import { getTasksByProject } from "@/actions/Tasks/get-by-project";
import { differenceInDays } from "date-fns";
import { ListFilter } from "lucide-react";

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

// Calculate completion percentage from tasks
function calculateCompletionPercentage(tasks?: Task[]): number {
  if (!tasks || tasks.length === 0) {
    return 0;
  }
  const completedCount = tasks.filter(
    (task) => task.status === "Completed",
  ).length;
  return Math.round((completedCount / tasks.length) * 100);
}

function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Completed" | "On Hold">("all");

  const projects = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });

  // Fetch tasks for each project and calculate completion percentage
  const projectTasks = useQuery({
    queryKey: [
      "project-tasks",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects?.data?.projects?.map((p: any) => p.id),
    ],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const projectIds = projects?.data?.projects?.map((p: any) => p.id) || [];
      const tasksMap: Record<string, Task[]> = {};

      for (const projectId of projectIds) {
        try {
          const result = await getTasksByProject(projectId);
          tasksMap[projectId] = result?.tasks || [];
        } catch (error) {
          console.error(
            `Failed to fetch tasks for project ${projectId}:`,
            error,
          );
          tasksMap[projectId] = [];
        }
      }
      return tasksMap;
    },
    enabled: !!projects?.data?.projects?.length,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get all projects data for filtering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allProjects: any[] = projects?.data?.projects || [];

  // Filter projects based on search, project selection, and status
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Search filter - matches name or description
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Project filter - either all projects or specific project
      const matchesProject = selectedProject ? p.id === selectedProject : true;

      // Status filter - all, Active, or Completed
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [allProjects, searchTerm, selectedProject, statusFilter]);

  // Check if any projects match the current filters
  const hasFilteredProjects = filteredProjects.length > 0;
  const hasAllProjects = allProjects.length > 0;

  return (
    <div className="w-full p-4 sm:p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">
            Projects
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <SheetCreateProject />
          <Select
            value={selectedProject ?? "__all__"}
            onValueChange={(value) =>
              setSelectedProject(value === "__all__" ? undefined : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Projects</SelectLabel>
                <SelectItem value="__all__">
                  <span className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    All Projects
                  </span>
                </SelectItem>
                {allProjects?.map(
                  (project: { id: string; name: string }) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as "all" | "Active" | "Completed" | "On Hold")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xs px-4 py-2 text-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-project-blue/50 bg-card/50 backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <Separator className="mb-6 opacity-50" />

      {/* Project cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.isLoading || projectTasks.isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))
        ) : !hasAllProjects ? (
          // Show empty state when no projects exist
          <EmptyProjects />
        ) : !hasFilteredProjects ? (
          // Show empty state when no projects match the filter
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full">
            <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-902/30 dark:to-orange-902/30">
              <svg
                className="h-12 w-12 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5v6h6V5H9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              No projects found
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {selectedProject
                ? "No projects found in this project. Try clearing the filter or creating a new project."
                : statusFilter !== "all"
                ? "No projects match the selected status. Try clearing the filter or creating a new project."
                : "No projects match your search. Try adjusting your search terms."}
            </p>
            {(selectedProject || searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSelectedProject(undefined);
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filteredProjects.map((project: any) => {
            const daysLeft = differenceInDays(
              new Date(project.deadline),
              new Date(),
            );

            // Get tasks for this project and calculate completion percentage
            const projectTaskData = projectTasks.data?.[project.id] || [];
            const calculatedCompletion =
              calculateCompletionPercentage(projectTaskData);

            // Use server-provided completion percentage if available, otherwise use calculated
            let completionPercentage =
              project.completionPercentage ?? calculatedCompletion;

            // Clamp completion percentage to 0-100 range
            completionPercentage = Math.max(0, Math.min(100, completionPercentage));

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

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>
            Total projects:{" "}
            <strong className="text-foreground font-medium">
              {allProjects.length}
            </strong>
          </span>
          {selectedProject && (
            <span>
              Project:{" "}
              <strong className="text-foreground font-medium">
                {allProjects?.find(
                  (p: { id: string; name: string }) => p.id === selectedProject,
                )?.name || "Unknown"}
              </strong>
            </span>
          )}
          {statusFilter !== "all" && (
            <span>
              Status:{" "}
              <strong className="text-foreground font-medium">
                {statusFilter}
              </strong>
            </span>
          )}
          {(searchTerm || selectedProject || statusFilter !== "all") && (
            <span>
              Filtered:{" "}
              <strong className="text-foreground font-medium">
                {filteredProjects.length}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectList;
