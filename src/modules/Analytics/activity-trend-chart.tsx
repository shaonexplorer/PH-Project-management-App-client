"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityTrendChartProps {
  data?: Array<{
    name: string;
    tasks: number;
    projects: number;
  }>;
  className?: string;
}

const COLORS = {
  tasks: "var(--chart-1)",
  projects: "var(--primary)",
};

// Mock data for initial implementation
const mockData = [
  { name: "Week 1", tasks: 5, projects: 1 },
  { name: "Week 2", tasks: 8, projects: 2 },
  { name: "Week 3", tasks: 12, projects: 1 },
  { name: "Week 4", tasks: 15, projects: 3 },
  { name: "Week 5", tasks: 22, projects: 2 },
  { name: "Week 6", tasks: 18, projects: 1 },
  { name: "Week 7", tasks: 25, projects: 4 },
];

export function ActivityTrendChart({
  data = mockData,
  className,
}: ActivityTrendChartProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activity Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              cursor={{ stroke: "var(--border)", strokeWidth: 2 }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="tasks"
              name="Tasks"
              stroke={COLORS.tasks}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="projects"
              name="Projects"
              stroke={COLORS.projects}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}