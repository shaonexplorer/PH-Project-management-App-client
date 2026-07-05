"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TaskProgressChartProps {
  data?: Array<{
    name: string;
    todo: number;
    inProgress: number;
    completed: number;
  }>;
  className?: string;
}

const COLORS = {
  todo: "var(--chart-1)",
  inProgress: "var(--chart-3)",
  completed: "var(--chart-2)",
};

// Mock data for initial implementation
const mockData = [
  { name: "Mon", todo: 4, inProgress: 3, completed: 2 },
  { name: "Tue", todo: 3, inProgress: 4, completed: 3 },
  { name: "Wed", todo: 2, inProgress: 5, completed: 4 },
  { name: "Thu", todo: 1, inProgress: 3, completed: 5 },
  { name: "Fri", todo: 0, inProgress: 2, completed: 7 },
  { name: "Sat", todo: 1, inProgress: 1, completed: 6 },
  { name: "Sun", todo: 2, inProgress: 0, completed: 8 },
];

export function TaskProgressChart({
  data = mockData,
  className,
}: TaskProgressChartProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
              cursor={{ fill: "var(--accent)" }}
            />
            <Legend />
            <Bar dataKey="todo" stackId="a" fill={COLORS.todo} radius={[4, 4, 0, 0]} />
            <Bar dataKey="inProgress" stackId="a" fill={COLORS.inProgress} radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" stackId="a" fill={COLORS.completed} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}