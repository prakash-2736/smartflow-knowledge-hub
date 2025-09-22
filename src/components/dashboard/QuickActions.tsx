import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Users, 
  Plus,
  Mail,
  Share2,
  Download,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  variant?: "default" | "primary" | "outline";
  color?: string;
}

interface QuickActionsProps {
  onUploadDocument?: () => void;
  onViewDocuments?: () => void;
  onViewAnalytics?: () => void;
  onViewDepartments?: () => void;
  onCreateReport?: () => void;
  onEmailImport?: () => void;
  onShareDocument?: () => void;
  onExportData?: () => void;
  onSearchDocuments?: () => void;
  className?: string;
}

export const QuickActions = ({
  onUploadDocument,
  onViewDocuments,
  onViewAnalytics,
  onViewDepartments,
  onCreateReport,
  onEmailImport,
  onShareDocument,
  onExportData,
  onSearchDocuments,
  className
}: QuickActionsProps) => {
  const primaryActions: QuickAction[] = [
    {
      id: "upload",
      title: "Upload Document",
      description: "Add new documents to the system",
      icon: Upload,
      action: () => onUploadDocument?.(),
      variant: "primary",
      color: "bg-primary hover:bg-primary/90"
    },
    {
      id: "documents",
      title: "Browse Documents",
      description: "View document repository",
      icon: FileText,
      action: () => onViewDocuments?.(),
      variant: "default"
    },
    {
      id: "analytics",
      title: "View Analytics",
      description: "System analytics and reports",
      icon: BarChart3,
      action: () => onViewAnalytics?.(),
      variant: "default"
    },
    {
      id: "departments",
      title: "Department View",
      description: "Access department content",
      icon: Users,
      action: () => onViewDepartments?.(),
      variant: "default"
    }
  ];

  const secondaryActions: QuickAction[] = [
    {
      id: "report",
      title: "Create Report",
      description: "Generate compliance reports",
      icon: Plus,
      action: () => onCreateReport?.(),
      variant: "outline"
    },
    {
      id: "email",
      title: "Email Import",
      description: "Import from email attachments",
      icon: Mail,
      action: () => onEmailImport?.(),
      variant: "outline"
    },
    {
      id: "share",
      title: "Share Document",
      description: "Share with team members",
      icon: Share2,
      action: () => onShareDocument?.(),
      variant: "outline"
    },
    {
      id: "export",
      title: "Export Data",
      description: "Export reports and data",
      icon: Download,
      action: () => onExportData?.(),
      variant: "outline"
    },
    {
      id: "search",
      title: "Advanced Search",
      description: "Search across all documents",
      icon: Search,
      action: () => onSearchDocuments?.(),
      variant: "outline"
    }
  ];

  const renderActionButton = (action: QuickAction) => (
    <Button
      key={action.id}
      variant={action.variant}
      className={cn(
        "h-auto p-4 flex flex-col items-center gap-2 min-h-[100px] transition-all duration-200",
        action.variant === "primary" && "bg-primary hover:bg-primary/90 text-primary-foreground",
        action.variant === "outline" && "hover:bg-muted"
      )}
      onClick={action.action}
    >
      <action.icon className={cn(
        "h-6 w-6",
        action.variant === "primary" ? "text-primary-foreground" : "text-primary"
      )} />
      <div className="text-center">
        <div className="font-medium text-sm">{action.title}</div>
        <div className={cn(
          "text-xs opacity-70 mt-1",
          action.variant === "primary" ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {action.description}
        </div>
      </div>
    </Button>
  );

  return (
    <div className={className}>
      {/* Primary Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {primaryActions.map(renderActionButton)}
          </div>

          {/* Secondary Actions */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Additional Tools</h4>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {secondaryActions.map(renderActionButton)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
