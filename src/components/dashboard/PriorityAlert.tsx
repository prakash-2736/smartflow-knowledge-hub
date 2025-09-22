import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info";
  timestamp: Date;
  department?: string;
  actionRequired?: boolean;
}

interface PriorityAlertProps {
  alerts: AlertItem[];
  onDismiss?: (alertId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

const alertIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Clock,
};

const alertStyles = {
  critical: "border-error/50 bg-error/5",
  warning: "border-warning/50 bg-warning/5",
  info: "border-blue-500/50 bg-blue-500/5",
};

const badgeVariants = {
  critical: "destructive",
  warning: "default",
  info: "secondary",
};

export const PriorityAlert = ({ 
  alerts, 
  onDismiss, 
  onViewAll, 
  className 
}: PriorityAlertProps) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismiss?.(alertId);
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));
  const criticalAlerts = visibleAlerts.filter(alert => alert.type === "critical");

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className={cn("border-error bg-error/10 mb-4")}>
          <AlertCircle className="h-4 w-4 text-error" />
          <AlertDescription className="flex items-center justify-between">
            <span className="font-medium">
              {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? "s" : ""} requiring immediate attention
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewAll?.()}
              className="ml-4"
            >
              View All
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Alert List */}
      <div className="space-y-3">
        {visibleAlerts.slice(0, 5).map((alert) => {
          const Icon = alertIcons[alert.type];
          return (
            <Alert 
              key={alert.id} 
              className={cn("relative", alertStyles[alert.type])}
            >
              <Icon className="h-4 w-4" />
              <AlertDescription className="pr-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.title}</span>
                      <Badge variant={badgeVariants[alert.type] as any} className="text-xs">
                        {alert.type}
                      </Badge>
                      {alert.actionRequired && (
                        <Badge variant="outline" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{alert.timestamp.toLocaleDateString()}</span>
                      {alert.department && (
                        <>
                          <span>•</span>
                          <span>{alert.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(alert.id)}
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
      </div>

      {/* View All Button */}
      {visibleAlerts.length > 5 && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => onViewAll?.()}>
            View All {visibleAlerts.length} Alerts
          </Button>
        </div>
      )}
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
