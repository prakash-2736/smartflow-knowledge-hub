import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar
} from "recharts";
import { ChartCard } from "./ChartCard";
import { useState } from "react";

interface DocumentProcessingChartProps {
  data: Array<{
    date: string;
    processed: number;
    pending: number;
    errors: number;
    accuracy: number;
  }>;
  type?: "area" | "line" | "bar";
  className?: string;
}

const formatTooltipValue = (value: number, name: string) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  return [`${value.toLocaleString()}`, formattedName];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const DocumentProcessingChart = ({
  data,
  type = "area",
  className
}: DocumentProcessingChartProps) => {
  const [timeRange, setTimeRange] = useState("30d");

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
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
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="processed" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--warning))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="errors" 
                stroke="hsl(var(--error))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--error))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
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
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Bar 
                dataKey="processed" 
                fill="hsl(var(--primary))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="pending" 
                fill="hsl(var(--warning))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="errors" 
                fill="hsl(var(--error))" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default: // area
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="processedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="errorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--error))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--error))" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
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
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="processed" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#processedGradient)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="pending" 
                stroke="hsl(var(--warning))" 
                fillOpacity={1} 
                fill="url(#pendingGradient)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="errors" 
                stroke="hsl(var(--error))" 
                fillOpacity={1} 
                fill="url(#errorsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <ChartCard
      title="Document Processing Trends"
      description="Track document processing performance over time"
      className={className}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      onRefresh={() => console.log("Refresh document processing data")}
      onExport={() => console.log("Export document processing chart")}
    >
      {renderChart()}
    </ChartCard>
  );
};
