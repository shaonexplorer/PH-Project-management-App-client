"use client";

import { useEffect, useState } from "react";

import TaskCard from "./Task-card";
import { Separator } from "@/components/ui/separator";
import { SheetCreateTask } from "./create-task-sheet";
import { useQuery } from "@tanstack/react-query";
import { getMyTasks } from "@/actions/Tasks/get";
import { getCookieByName } from "@/actions/auth/cookie";

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

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const id = await getCookieByName("userId");
      setUser(id);
    };

    getUser();
  }, []);

  const filteredTasks = mockTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statuses = [
    { key: "Todo", label: "To Do" },
    { key: "In_Progress", label: "In Progress" },
    { key: "Completed", label: "Completed" },
  ];

  const tasks = useQuery({
    queryKey: ["my-tasks", user],
    queryFn: () => getMyTasks(user as string),
  });

  console.log({ tasks: tasks?.data?.tasks });
  // console.log({ user });

  return (
    <div className="w-full p-4 bg-muted rounded-lg">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <SheetCreateTask />
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
              {user &&
                tasks?.data?.tasks
                  .filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (t: any) => (t.status as string) === s.key,
                  )
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((task: any) => (
                    <TaskCard
                      taskId={task.id}
                      taskStatus={task.status}
                      deadline={task.dueDate}
                      key={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      assignee={{
                        name: "Sarah Jenkins",
                        role: "Lead Engineer",
                        avatarUrl:
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                        isOnline: true,
                      }}
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
