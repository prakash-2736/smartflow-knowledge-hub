import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PriorityAlert } from "@/components/dashboard/PriorityAlert";
import { DocumentQueue } from "@/components/dashboard/DocumentQueue";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Activity
} from "lucide-react";

// Mock data - in real app, this would come from API
const mockStats = {
  totalDocuments: 1247,
  processedToday: 89,
  pendingDocuments: 23,
  complianceRate: 98.5,
  activeDepartments: 6,
  avgProcessingTime: 2.4,
};

const mockAlerts = [
  {
    id: "1",
    title: "Compliance Deadline Approaching",
    description: "3 documents require immediate attention for regulatory compliance",
    type: "critical" as const,
    timestamp: new Date("2024-01-15T10:30:00"),
    department: "Legal",
    actionRequired: true,
  },
  {
    id: "2", 
    title: "Processing Queue Backlog",
    description: "Engineering department has 15 pending documents",
    type: "warning" as const,
    timestamp: new Date("2024-01-15T09:15:00"),
    department: "Engineering",
    actionRequired: false,
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    description: "Scheduled maintenance on Sunday 2 AM - 4 AM",
    type: "info" as const,
    timestamp: new Date("2024-01-15T08:00:00"),
    actionRequired: false,
  },
];

const mockDocuments = [
  {
    id: "1",
    title: "Metro Station Safety Inspection Report",
    type: "PDF",
    department: "Operations",
    priority: "high" as const,
    status: "in_review" as const,
    uploadedBy: "John Smith",
    uploadedAt: new Date("2024-01-15T14:30:00"),
    assignedTo: "Sarah Johnson",
    commentsCount: 3,
  },
  {
    id: "2",
    title: "Monthly Financial Statement - January 2024",
    type: "Excel",
    department: "Finance",
    priority: "medium" as const,
    status: "pending" as const,
    uploadedBy: "Mike Davis",
    uploadedAt: new Date("2024-01-15T13:45:00"),
    commentsCount: 0,
  },
  {
    id: "3",
    title: "HR Policy Update - Remote Work Guidelines",
    type: "Word",
    department: "HR",
    priority: "urgent" as const,
    status: "approved" as const,
    uploadedBy: "Lisa Wang",
    uploadedAt: new Date("2024-01-15T12:20:00"),
    commentsCount: 7,
  },
  {
    id: "4",
    title: "Engineering Specifications - Signal System",
    type: "PDF",
    department: "Engineering",
    priority: "high" as const,
    status: "in_review" as const,
    uploadedBy: "David Chen",
    uploadedAt: new Date("2024-01-15T11:15:00"),
    assignedTo: "Robert Kim",
    commentsCount: 2,
  },
  {
    id: "5",
    title: "Legal Compliance Checklist",
    type: "PDF",
    department: "Legal",
    priority: "urgent" as const,
    status: "pending" as const,
    uploadedBy: "Jennifer Lee",
    uploadedAt: new Date("2024-01-15T10:30:00"),
    commentsCount: 1,
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Implement navigation logic here
  };

  const handleViewDocument = (documentId: string) => {
    console.log(`View document: ${documentId}`);
    // Navigate to document detail
  };

  const handleViewAllDocuments = () => {
    console.log("View all documents");
    // Navigate to documents page
  };

  const handleDismissAlert = (alertId: string) => {
    console.log(`Dismiss alert: ${alertId}`);
    // Remove alert from state
  };

  const handleViewAllAlerts = () => {
    console.log("View all alerts");
    // Navigate to alerts page
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your documents today.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Priority Alerts */}
        <PriorityAlert
          alerts={mockAlerts}
          onDismiss={handleDismissAlert}
          onViewAll={handleViewAllAlerts}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Documents"
            value={mockStats.totalDocuments}
            description="All time"
            icon={FileText}
            variant="primary"
            trend={{
              value: 8,
              isPositive: true,
              period: "vs last month"
            }}
          />
          <StatsCard
            title="Processed Today"
            value={mockStats.processedToday}
            description="Last 24 hours"
            icon={CheckCircle}
            variant="accent"
            trend={{
              value: 15,
              isPositive: true,
              period: "vs yesterday"
            }}
          />
          <StatsCard
            title="Pending Documents"
            value={mockStats.pendingDocuments}
            description="Awaiting review"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Compliance Rate"
            value={mockStats.complianceRate}
            description="This month"
            icon={TrendingUp}
            variant="default"
            trend={{
              value: 2.5,
              isPositive: true,
              period: "vs last month"
            }}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions
          onUploadDocument={() => handleQuickAction("upload")}
          onViewDocuments={() => handleQuickAction("documents")}
          onViewAnalytics={() => handleQuickAction("analytics")}
          onViewDepartments={() => handleQuickAction("departments")}
          onCreateReport={() => handleQuickAction("create-report")}
          onEmailImport={() => handleQuickAction("email-import")}
          onShareDocument={() => handleQuickAction("share")}
          onExportData={() => handleQuickAction("export")}
          onSearchDocuments={() => handleQuickAction("search")}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Documents */}
          <div className="lg:col-span-2">
            <DocumentQueue
              documents={mockDocuments}
              maxItems={6}
              onViewDocument={handleViewDocument}
              onViewAll={handleViewAllDocuments}
            />
          </div>

          {/* System Overview */}
          <div className="space-y-6">
            <StatsCard
              title="Active Departments"
              value={mockStats.activeDepartments}
              description="Currently using system"
              icon={Users}
              variant="default"
            />
            <StatsCard
              title="Avg Processing Time"
              value={mockStats.avgProcessingTime}
              description="Hours per document"
              icon={Clock}
              variant="default"
              trend={{
                value: 10,
                isPositive: true,
                period: "faster vs last week"
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
