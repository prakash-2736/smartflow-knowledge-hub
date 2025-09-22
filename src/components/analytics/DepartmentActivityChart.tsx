import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ChartCard } from "./ChartCard";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface DepartmentActivityChartProps {
  data: Array<{
    department: string;
    documents: number;
    processed: number;
    pending: number;
    compliance: number;
    color?: string;
  }>;
  type?: "pie" | "bar";
  className?: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))", 
  "hsl(var(--warning))",
  "hsl(220, 70%, 50%)",
  "hsl(160, 70%, 50%)",
  "hsl(320, 70%, 50%)",
];

const formatTooltipValue = (value: number, name: string) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  return [`${value.toLocaleString()}`, formattedName];
};

export const DepartmentActivityChart = ({
  data,
  type = "bar",
  className
}: DepartmentActivityChartProps) => {
  const [timeRange, setTimeRange] = useState("30d");

  const renderChart = () => {
    if (type === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ department, documents, percent }) => 
                `${department}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="documents"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="department"
            className="text-xs fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-xs fill-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Legend />
          <Bar 
            dataKey="documents" 
            fill="hsl(var(--primary))" 
            radius={[2, 2, 0, 0]}
            name="Total Documents"
          />
          <Bar 
            dataKey="processed" 
            fill="hsl(var(--accent))" 
            radius={[2, 2, 0, 0]}
            name="Processed"
          />
          <Bar 
            dataKey="pending" 
            fill="hsl(var(--warning))" 
            radius={[2, 2, 0, 0]}
            name="Pending"
          />
          <Bar 
            dataKey="compliance" 
            fill="hsl(220, 70%, 50%)" 
            radius={[2, 2, 0, 0]}
            name="Compliance"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ChartCard
      title="Department Activity Overview"
      description="Document processing activity by department"
      className={className}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      onRefresh={() => console.log("Refresh department activity data")}
      onExport={() => console.log("Export department activity chart")}
    >
      {renderChart()}
    </ChartCard>
  );
};

// Department Legend Component
export const DepartmentLegend = ({ data }: { data: Array<{ department: string; color?: string }> }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {data.map((dept, index) => (
        <Badge
          key={dept.department}
          variant="outline"
          className="flex items-center gap-1"
        >
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ 
              backgroundColor: dept.color || COLORS[index % COLORS.length] 
            }} 
          />
          {dept.department}
        </Badge>
      ))}
    </div>
  );
};
