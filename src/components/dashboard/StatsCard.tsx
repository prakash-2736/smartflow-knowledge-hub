import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  variant?: "default" | "primary" | "accent" | "warning" | "error";
  className?: string;
}

const variantStyles = {
  default: "bg-background border-border",
  primary: "bg-primary/5 border-primary/20",
  accent: "bg-accent/5 border-accent/20",
  warning: "bg-warning/5 border-warning/20",
  error: "bg-error/5 border-error/20",
};

const iconStyles = {
  default: "text-muted-foreground",
  primary: "text-primary",
  accent: "text-accent",
  warning: "text-warning",
  error: "text-error",
};

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <CountUp
            end={value}
            duration={2}
            decimals={value % 1 !== 0 ? 1 : 0}
            suffix={title.includes("%") ? "%" : ""}
            separator=","
          />
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-accent mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-error mr-1" />
            )}
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"}
              className="text-xs"
            >
              {trend.value}%
            </Badge>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
