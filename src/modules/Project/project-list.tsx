"use client";

import React, { useState } from "react";
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
import { differenceInDays } from "date-fns";

// Mock project data – replace with real API/data source later
const mockProjects = [
  {
    id: 1,
    title: "Global Brand Refresh",
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
    id: 2,
    title: "Mobile App Redesign",
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
    id: 3,
    title: "Quarterly Reporting",
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

function ProjectList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const projects = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });

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
        {projects.isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))
        ) : projects?.data?.projects?.length === 0 ? (
          // Show empty state when no projects exist
          <EmptyProjects />
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          projects?.data?.projects.map((project: any) => {
            const daysLeft = differenceInDays(
              new Date(project.deadline),
              new Date(),
            );
            return (
              <ProjectInfoCard
                projectId={project.id}
                key={project.id}
                title={project.name}
                projectLead={
                  project.projectLead || {
                    name: project.members[0]?.name || "John Doe",
                    avatarUrl:
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                  }
                }
                completionPercentage={project.completionPercentage || 50}
                daysLeft={project.daysLeft || daysLeft}
                // Placeholder callbacks – can be wired up later
                onEdit={() => console.log("Edit", project.id)}
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
