import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ChartCard } from "@/components/analytics/ChartCard";
import { DocumentProcessingChart } from "@/components/analytics/DocumentProcessingChart";
import { DepartmentActivityChart } from "@/components/analytics/DepartmentActivityChart";
import { ComplianceStatusChart, ComplianceStatusList } from "@/components/analytics/ComplianceStatusChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Users, 
  CheckCircle,
  Download,
  Calendar,
  Filter
} from "lucide-react";

// Mock data for analytics
const mockDocumentProcessingData = [
  { date: "2024-01-01", processed: 45, pending: 12, errors: 2, accuracy: 95.6 },
  { date: "2024-01-02", processed: 52, pending: 8, errors: 1, accuracy: 96.2 },
  { date: "2024-01-03", processed: 38, pending: 15, errors: 3, accuracy: 94.8 },
  { date: "2024-01-04", processed: 67, pending: 6, errors: 1, accuracy: 97.1 },
  { date: "2024-01-05", processed: 43, pending: 11, errors: 2, accuracy: 95.4 },
  { date: "2024-01-06", processed: 59, pending: 9, errors: 1, accuracy: 96.8 },
  { date: "2024-01-07", processed: 41, pending: 13, errors: 2, accuracy: 95.1 },
];

const mockDepartmentData = [
  {
    department: "Operations",
    documents: 324,
    processed: 298,
    pending: 26,
    compliance: 92,
    color: "hsl(220, 70%, 50%)"
  },
  {
    department: "Engineering", 
    documents: 287,
    processed: 245,
    pending: 42,
    compliance: 85,
    color: "hsl(160, 70%, 50%)"
  },
  {
    department: "Finance",
    documents: 198,
    processed: 189,
    pending: 9,
    compliance: 96,
    color: "hsl(320, 70%, 50%)"
  },
  {
    department: "HR",
    documents: 156,
    processed: 148,
    pending: 8,
    compliance: 95,
    color: "hsl(40, 70%, 50%)"
  },
  {
    department: "Legal",
    documents: 134,
    processed: 126,
    pending: 8,
    compliance: 94,
    color: "hsl(280, 70%, 50%)"
  },
  {
    department: "Executive",
    documents: 89,
    processed: 85,
    pending: 4,
    compliance: 96,
    color: "hsl(0, 70%, 50%)"
  },
];

const mockComplianceData = [
  {
    category: "Safety Compliance",
    completed: 45,
    pending: 8,
    overdue: 2,
    total: 55,
    percentage: 81.8
  },
  {
    category: "Financial Reports",
    completed: 38,
    pending: 5,
    overdue: 1,
    total: 44,
    percentage: 86.4
  },
  {
    category: "Regulatory Updates",
    completed: 52,
    pending: 12,
    overdue: 3,
    total: 67,
    percentage: 77.6
  },
  {
    category: "Audit Requirements",
    completed: 29,
    pending: 4,
    overdue: 0,
    total: 33,
    percentage: 87.9
  },
  {
    category: "Environmental Standards",
    completed: 41,
    pending: 6,
    overdue: 1,
    total: 48,
    percentage: 85.4
  },
];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleExportReport = () => {
    console.log("Export analytics report");
    // Implement export functionality
  };

  const handleRefreshData = () => {
    console.log("Refresh analytics data");
    // Implement data refresh
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-6 w-6 animate-spin" />
            <span>Loading analytics...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into document processing and system performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={handleRefreshData} variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Documents"
            value={1247}
            description="All time processed"
            icon={FileText}
            variant="primary"
            trend={{
              value: 12,
              isPositive: true,
              period: "vs last month"
            }}
          />
          <StatsCard
            title="Processing Accuracy"
            value={96.2}
            description="Average accuracy rate"
            icon={CheckCircle}
            variant="accent"
            trend={{
              value: 2.1,
              isPositive: true,
              period: "vs last month"
            }}
          />
          <StatsCard
            title="Active Users"
            value={156}
            description="Currently active"
            icon={Users}
            variant="default"
            trend={{
              value: 8,
              isPositive: true,
              period: "vs last week"
            }}
          />
          <StatsCard
            title="Avg Processing Time"
            value={2.4}
            description="Hours per document"
            icon={TrendingUp}
            variant="warning"
            trend={{
              value: 15,
              isPositive: true,
              period: "faster vs last month"
            }}
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocumentProcessingChart
                data={mockDocumentProcessingData}
                type="area"
              />
              <DepartmentActivityChart
                data={mockDepartmentData}
                type="bar"
              />
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentActivityChart
                data={mockDepartmentData}
                type="pie"
              />
              <ChartCard
                title="Department Performance Metrics"
                description="Key performance indicators by department"
                onRefresh={handleRefreshData}
                onExport={handleExportReport}
              >
                <div className="space-y-4">
                  {mockDepartmentData.map((dept) => (
                    <div key={dept.department} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{dept.department}</span>
                        <span className="text-sm text-muted-foreground">
                          {dept.compliance}% compliance
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${dept.compliance}%`,
                            backgroundColor: dept.color 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{dept.processed} processed</span>
                        <span>{dept.pending} pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComplianceStatusChart
                data={mockComplianceData}
                type="bar"
              />
              <ChartCard
                title="Compliance Status Details"
                description="Detailed breakdown of compliance categories"
              >
                <ComplianceStatusList data={mockComplianceData} />
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocumentProcessingChart
                data={mockDocumentProcessingData}
                type="line"
              />
              <DocumentProcessingChart
                data={mockDocumentProcessingData}
                type="bar"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard
                title="Processing Accuracy Trends"
                description="Accuracy improvements over time"
              >
                <div className="space-y-4">
                  {mockDocumentProcessingData.slice(-5).map((item, index) => (
                    <div key={item.date} className="flex items-center justify-between">
                      <span className="text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      <span className="font-medium">{item.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
              <ChartCard
                title="Error Analysis"
                description="Common processing errors"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">OCR Issues</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Format Errors</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Language Detection</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                </div>
              </ChartCard>
              <ChartCard
                title="Peak Usage Hours"
                description="System usage patterns"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">9:00 AM - 11:00 AM</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">2:00 PM - 4:00 PM</span>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">6:00 PM - 8:00 PM</span>
                    <span className="text-sm font-medium">Low</span>
                  </div>
                </div>
              </ChartCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
