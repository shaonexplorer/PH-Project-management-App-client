"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  iconColor?: string;
  className?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  iconColor = "text-primary",
  className,
  description,
}: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg", iconColor.replace("text-", "bg-").replace("-foreground", "") + "/10")}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Predefined stat card variants for common metrics
export const StatCardVariants = {
  Projects: ({ value, change }: { value: number; change?: string }) => (
    <StatCard
      title="Total Projects"
      value={value}
      change={change}
      icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
      iconColor="text-blue-500"
    />
  ),

  ActiveTasks: ({ value, change }: { value: number; change?: string }) => (
    <StatCard
      title="Active Tasks"
      value={value}
      change={change}
      icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M5 13h14a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>}
      iconColor="text-amber-500"
    />
  ),

  Completed: ({ value, change }: { value: number; change?: string }) => (
    <StatCard
      title="Completed Tasks"
      value={value}
      change={change}
      icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 20a4 4 0 01-4-4V6a2 2 0 012-2h4a2 2 0 012 2v6l2 2 4-4v10a4 4 0 01-4 4H7z" /></svg>}
      iconColor="text-emerald-500"
    />
  ),

  Productivity: ({ value, change }: { value: number; change?: string }) => (
    <StatCard
      title="Productivity Score"
      value={`${value}%`}
      change={change}
      icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
      iconColor="text-purple-500"
    />
  ),

  Overdue: ({ value, change }: { value: number; change?: string }) => (
    <StatCard
      title="Overdue Tasks"
      value={value}
      change={change}
      icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M9 17h6a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
      iconColor="text-red-500"
    />
  ),

  TeamMembers: ({ value, change }: { value: number; change?: string }) => (
    <StatCard
      title="Team Members"
      value={value}
      change={change}
      icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-6m-6 6v-6m-2 0h12M8 7a4 4 0 118 0v10a2 2 0 01-2 2H10a2 2 0 01-2-2V7z" /></svg>}
      iconColor="text-green-500"
    />
  ),
};