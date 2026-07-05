"use client";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TaskStatusPieChartProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

const COLORS = ["var(--chart-1)", "var(--chart-3)", "var(--chart-2)"];

// Mock data for initial implementation
const mockData = [
  { name: "To Do", value: 12 },
  { name: "In Progress", value: 8 },
  { name: "Completed", value: 24 },
];

export function TaskStatusPieChart({
  data = mockData,
  className,
}: TaskStatusPieChartProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RePieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ percent = 0, x, y }) => {
                const radius = 70;
                const xCalc = x + radius * Math.cos(Math.PI * (percent * 2 - 0.5));
                const yCalc = y + radius * Math.sin(Math.PI * (percent * 2 - 0.5));
                return (
                  <text
                    x={xCalc}
                    y={yCalc}
                    fill="var(--card-foreground)"
                    fontSize={10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {`${Math.round(percent * 100)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}