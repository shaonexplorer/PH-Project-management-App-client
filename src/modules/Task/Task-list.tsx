"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./Task-card";
import { Separator } from "@/components/ui/separator";

// Mock task data – replace with real API later
const mockTasks = [
  {
    id: 1,
    title: "Design landing page",
    description: "Create wireframes and mockups for the new landing page.",
    status: "todo",
  },
  {
    id: 2,
    title: "Implement authentication",
    description: "Set up OAuth2 login flow with Google and GitHub.",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Write unit tests",
    description: "Add Jest tests for the user service. dolor sit amet.",
    status: "completed",
  },
  {
    id: 4,
    title: "Fix header bug",
    description: "Header overlaps content on mobile devices.",
    status: "todo",
  },
  {
    id: 5,
    title: "Optimize API calls",
    description: "Reduce payload size and add caching.",
    status: "in-progress",
  },
  {
    id: 6,
    title: "Write unit tests",
    description:
      "Add Jest tests for the user service. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet.",
    status: "completed",
  },
];

function TaskList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = mockTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateTask = () => {
    // TODO: Open modal or navigate to task creation page
    console.log("Create task clicked");
  };

  const statuses = [
    { key: "todo", label: "To Do" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="w-full p-4 bg-muted rounded-lg">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <button
          onClick={handleCreateTask}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
        <input
          type="text"
          placeholder="Search tasks…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-sm"
        />
      </div>

      <Separator className="mb-4" />

      {/* Columns for each status */}
      <div className="flex flex-col lg:flex-row gap-6">
        {statuses.map((s) => (
          <div key={s.key} className="flex-1">
            <h2 className="text-lg font-semibold mb-3 text-card-foreground">
              {s.label}
            </h2>
            <div className="grid gap-4">
              {filteredTasks
                .filter((t) => t.status === s.key)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    // Placeholder callbacks – can be wired up later
                    onUpdateStatus={() => console.log(`Update ${task.id}`)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
