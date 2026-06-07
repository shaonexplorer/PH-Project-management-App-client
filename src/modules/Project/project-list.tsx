"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import ProjectInfoCard from "./project-card";
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

  const handleCreateProject = () => {
    // TODO: Open a modal or navigate to a create‑project page
    console.log("Create project clicked");
  };

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
        {filteredProjects.map((project) => (
          <ProjectInfoCard
            key={project.id}
            title={project.title}
            projectLead={project.projectLead}
            completionPercentage={project.completionPercentage}
            daysLeft={project.daysLeft}
            // Placeholder callbacks – can be wired up later
            onEdit={() => console.log("Edit", project.id)}
            onDelete={() => console.log("Delete", project.id)}
            onViewDetails={() => console.log("View", project.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
