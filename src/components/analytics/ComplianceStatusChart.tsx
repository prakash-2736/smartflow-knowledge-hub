import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import { ChartCard } from "./ChartCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";

interface ComplianceStatusChartProps {
  data: Array<{
    category: string;
    completed: number;
    pending: number;
    overdue: number;
    total: number;
    percentage: number;
  }>;
  type?: "radial" | "bar";
  className?: string;
}

const formatTooltipValue = (value: number, name: string) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  return [`${value.toLocaleString()}`, formattedName];
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-accent" />;
    case "pending":
      return <Clock className="h-4 w-4 text-warning" />;
    case "overdue":
      return <XCircle className="h-4 w-4 text-error" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "hsl(var(--accent))";
    case "pending":
      return "hsl(var(--warning))";
    case "overdue":
      return "hsl(var(--error))";
    default:
      return "hsl(var(--muted-foreground))";
  }
};

export const ComplianceStatusChart = ({
  data,
  type = "bar",
  className
}: ComplianceStatusChartProps) => {
  const [timeRange, setTimeRange] = useState("30d");

  const renderRadialChart = () => {
    const radialData = data.map((item, index) => ({
      name: item.category,
      value: item.percentage,
      fill: getStatusColor("completed")
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData}>
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff" }}
            background
            clockWise
            dataKey="value"
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Completion"]}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    const barData = data.map(item => ({
      category: item.category,
      completed: item.completed,
      pending: item.pending,
      overdue: item.overdue,
      total: item.total
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={barData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="category"
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
          <Bar dataKey="completed" stackId="a" fill="hsl(var(--accent))" name="Completed" />
          <Bar dataKey="pending" stackId="a" fill="hsl(var(--warning))" name="Pending" />
          <Bar dataKey="overdue" stackId="a" fill="hsl(var(--error))" name="Overdue" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    return type === "radial" ? renderRadialChart() : renderBarChart();
  };

  return (
    <ChartCard
      title="Compliance Status Overview"
      description="Track compliance completion across different categories"
      className={className}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      onRefresh={() => console.log("Refresh compliance data")}
      onExport={() => console.log("Export compliance chart")}
    >
      {renderChart()}
    </ChartCard>
  );
};

// Compliance Status List Component
export const ComplianceStatusList = ({ 
  data 
}: { 
  data: Array<{
    category: string;
    completed: number;
    pending: number;
    overdue: number;
    total: number;
    percentage: number;
  }> 
}) => {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.category} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">{item.category}</h4>
              <Badge variant="outline" className="text-xs">
                {item.total} total
              </Badge>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
          
          <Progress value={item.percentage} className="h-2" />
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-accent" />
              <span>{item.completed} completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-warning" />
              <span>{item.pending} pending</span>
            </div>
            {item.overdue > 0 && (
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-error" />
                <span>{item.overdue} overdue</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
