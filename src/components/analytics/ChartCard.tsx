import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showControls?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  loading?: boolean;
  error?: string;
}

const timeRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
];

export const ChartCard = ({
  title,
  description,
  children,
  className,
  showControls = true,
  onRefresh,
  onExport,
  timeRange = "30d",
  onTimeRangeChange,
  loading = false,
  error
}: ChartCardProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          )}
        </div>
        
        {showControls && (
          <div className="flex items-center gap-2">
            {onTimeRangeChange && (
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onExport}
            >
              <Download className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {error ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="text-muted-foreground">
              <p className="text-sm font-medium">Failed to load chart</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading chart...</span>
            </div>
          </div>
        ) : (
          <div className="h-64 w-full">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
