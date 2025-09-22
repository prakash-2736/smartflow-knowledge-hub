import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  ArrowLeft,
  Upload as UploadIcon
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { DocumentQueue } from "./DocumentQueue";
import { DepartmentActivityChart } from "../analytics/DepartmentActivityChart";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DepartmentData {
  name: string;
  displayName: string;
  color: string;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status: "online" | "away" | "offline";
  }>;
  metrics: {
    totalDocuments: number;
    processedToday: number;
    pendingDocuments: number;
    complianceRate: number;
    avgProcessingTime: number;
    teamProductivity: number;
  };
  recentActivity: Array<{
    id: string;
    type: "document_uploaded" | "document_processed" | "compliance_updated" | "comment_added";
    user: string;
    description: string;
    timestamp: Date;
  }>;
  documents: Array<{
    id: string;
    title: string;
    type: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "in_review" | "approved" | "rejected";
    uploadedBy: string;
    uploadedAt: Date;
    assignedTo?: string;
    commentsCount: number;
  }>;
}

interface DepartmentViewProps {
  department: DepartmentData;
  onViewDocument?: (documentId: string) => void;
  onViewAllDocuments?: () => void;
  onViewTeamMember?: (memberId: string) => void;
  className?: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "document_uploaded":
      return <FileText className="h-4 w-4 text-primary" />;
    case "document_processed":
      return <CheckCircle className="h-4 w-4 text-accent" />;
    case "compliance_updated":
      return <Target className="h-4 w-4 text-warning" />;
    case "comment_added":
      return <Activity className="h-4 w-4 text-blue-500" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-accent";
    case "away":
      return "bg-warning";
    case "offline":
      return "bg-muted";
    default:
      return "bg-muted";
  }
};

export const DepartmentView = ({
  department,
  onViewDocument,
  onViewAllDocuments,
  onViewTeamMember,
  className
}: DepartmentViewProps) => {
  const { name, displayName, color, teamMembers, metrics, recentActivity } = department;
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Department Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              try {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/dashboard');
                }
              } catch {
                navigate('/dashboard');
              }
            }}
            className="mr-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: color }}
          >
            {displayName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName} Department</h1>
            <p className="text-muted-foreground">
              {teamMembers.length} team members • {metrics.totalDocuments} total documents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/upload')} variant="outline" className="gap-2">
            <UploadIcon className="h-4 w-4" /> Upload
          </Button>
          <Badge 
            variant="outline" 
            className="px-3 py-1"
            style={{ borderColor: color, color }}
          >
            {name.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Documents Processed"
          value={metrics.processedToday}
          description="Today"
          icon={FileText}
          variant="primary"
          trend={{
            value: 12,
            isPositive: true,
            period: "vs yesterday"
          }}
        />
        <StatsCard
          title="Pending Documents"
          value={metrics.pendingDocuments}
          description="Awaiting review"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Compliance Rate"
          value={Math.round(metrics.complianceRate)}
          description="This month"
          icon={CheckCircle}
          variant="accent"
          trend={{
            value: 5,
            isPositive: true,
            period: "vs last month"
          }}
        />
        <StatsCard
          title="Avg Processing Time"
          value={metrics.avgProcessingTime}
          description="Hours"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Members
            </CardTitle>
            <CardDescription>
              {teamMembers.length} active team members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onViewTeamMember?.(member.id)}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                    getStatusColor(member.status)
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest team activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp.toLocaleDateString()} at{" "}
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentQueue
          documents={department.documents}
          department={displayName}
          maxItems={8}
          onViewDocument={onViewDocument}
          onViewAll={onViewAllDocuments}
        />
        
        <DepartmentActivityChart
          data={[{
            department: displayName,
            documents: metrics.totalDocuments,
            processed: metrics.processedToday,
            pending: metrics.pendingDocuments,
            compliance: Math.round(metrics.complianceRate),
            color: color
          }]}
          type="bar"
        />
      </div>
    </div>
  );
};
