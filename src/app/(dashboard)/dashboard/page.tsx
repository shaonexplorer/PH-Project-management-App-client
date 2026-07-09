"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyTasks } from "@/actions/Tasks/get";
import { getMyProjects } from "@/actions/Project/get";
import { getCurrentUser } from "@/actions/auth/get-user";
import {
  StatCard,
  TaskProgressChart,
  TaskStatusPieChart,
  ActivityTrendChart,
} from "@/modules/Analytics";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
  dueDate?: string;
  assignee?: {
    name: string;
    role?: string;
    avatarUrl?: string;
    isOnline?: boolean;
  };
}

interface Project {
  id: string;
  name: string;
  completionPercentage?: number;
  daysLeft?: number;
  status?: string;
  projectLead?: {
    name: string;
    avatarUrl?: string;
  };
  members?: Array<{
    name: string;
    avatarUrl?: string;
  }>;
}

function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      setUserId(user?.id || null);
    };

    getUser();
  }, []);

  // Fetch tasks
  const tasksQuery = useQuery({
    queryKey: ["my-tasks", userId],
    queryFn: () => getMyTasks(userId as string),
    enabled: !!userId,
  });

  // Fetch projects
  const projectsQuery = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
    enabled: !!userId,
  });

  // Calculate statistics
  const tasks: Task[] = (tasksQuery?.data?.tasks || []) as Task[];
  const projects: Project[] = (projectsQuery?.data?.projects || []) as Project[];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In_Progress").length;
  const todoTasks = tasks.filter((t) => t.status === "Todo").length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Generate task progress data (last 7 days)
  const taskProgressData = [
    { name: "Mon", todo: Math.max(0, todoTasks - 2), inProgress: Math.max(0, inProgressTasks - 1), completed: Math.max(0, completedTasks - 3) },
    { name: "Tue", todo: Math.max(0, todoTasks - 1), inProgress: Math.max(0, inProgressTasks), completed: Math.max(0, completedTasks - 2) },
    { name: "Wed", todo: Math.max(0, todoTasks), inProgress: Math.max(0, inProgressTasks - 1), completed: Math.max(0, completedTasks - 1) },
    { name: "Thu", todo: Math.max(0, todoTasks - 1), inProgress: Math.max(0, inProgressTasks), completed: Math.max(0, completedTasks) },
    { name: "Fri", todo: 0, inProgress: Math.max(0, inProgressTasks - 1), completed: completedTasks + 1 },
    { name: "Sat", todo: 0, inProgress: 0, completed: completedTasks + 2 },
    { name: "Sun", todo: Math.min(todoTasks, 2), inProgress: Math.min(inProgressTasks, 3), completed: completedTasks + 3 },
  ];

  const isLoading = tasksQuery.isLoading || projectsQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your projects and tasks
        </p>
      </div>

      {/* Stats Overview - 6 Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          change={activeProjects > 0 ? `+${activeProjects} active` : "No active projects"}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          change={totalProjects > 0 ? `${Math.round((activeProjects / totalProjects) * 100)}% completion rate` : "No projects yet"}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          change={`${completedTasks} completed`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M5 13h14a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          change={`${Math.round((completedTasks / Math.max(totalTasks, 1)) * 100)}% complete`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 20a4 4 0 01-4-4V6a2 2 0 012-2h4a2 2 0 012 2v6l2 2 4-4v10a4 4 0 01-4 4H7z" /></svg>}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          change={`${Math.round((inProgressTasks / Math.max(totalTasks, 1)) * 100)}% in progress`}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M5 13a7 7 0 0114 0" /></svg>}
          iconColor="text-amber-500"
        />
        <StatCard
          title="Productivity Score"
          value={`${productivityScore}%`}
          change={productivityScore >= 80 ? "Excellent" : productivityScore >= 50 ? "Good" : "Needs improvement"}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          iconColor="text-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <TaskProgressChart data={taskProgressData} />
        <TaskStatusPieChart />
      </div>

      <ActivityTrendChart />

      {/* Recent Activity Section */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-xl p-4">
                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: {task.status} • Priority: {task.priority || "Normal"}
                          </p>
                        </div>
                      </div>
                    ))}
                    {tasks.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground">
                        +{tasks.length - 5} more tasks
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M5 13a7 7 0 0114 0" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">No tasks yet. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Page;