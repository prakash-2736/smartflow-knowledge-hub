import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: Date;
  completedDate?: Date;
  assignedTo: string;
  documents: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  progress: number;
  createdDate: Date;
}

interface ComplianceTrackingProps {
  className?: string;
}

const complianceCategories = [
  "Safety Compliance",
  "Financial Reports", 
  "Regulatory Updates",
  "Audit Requirements",
  "Environmental Standards",
  "Legal Compliance",
  "HR Policies",
  "Technical Standards"
];

const departments = [
  "Operations",
  "Engineering",
  "Finance", 
  "HR",
  "Legal",
  "Executive"
];

const statuses = [
  "All Statuses",
  "Pending",
  "In Progress",
  "Completed", 
  "Overdue"
];

const priorities = [
  "All Priorities",
  "Low",
  "Medium",
  "High",
  "Urgent"
];

// Mock data
const mockComplianceItems: ComplianceItem[] = [
  {
    id: "1",
    title: "Monthly Safety Inspection Report",
    description: "Comprehensive safety inspection covering all metro stations and facilities",
    category: "Safety Compliance",
    department: "Operations",
    status: "in_progress",
    priority: "high",
    dueDate: addDays(new Date(), 5),
    assignedTo: "John Smith",
    documents: [
      { id: "1", title: "Station A Inspection", status: "completed" },
      { id: "2", title: "Station B Inspection", status: "pending" }
    ],
    progress: 60,
    createdDate: addDays(new Date(), -15)
  },
  {
    id: "2", 
    title: "Q1 Financial Audit",
    description: "Quarterly financial audit and compliance verification",
    category: "Financial Reports",
    department: "Finance",
    status: "pending",
    priority: "urgent",
    dueDate: addDays(new Date(), 2),
    assignedTo: "Jennifer Lee",
    documents: [
      { id: "3", title: "Balance Sheet Q1", status: "completed" },
      { id: "4", title: "Income Statement Q1", status: "in_review" }
    ],
    progress: 30,
    createdDate: addDays(new Date(), -20)
  },
  {
    id: "3",
    title: "Environmental Impact Assessment",
    description: "Annual environmental impact assessment for metro operations",
    category: "Environmental Standards", 
    department: "Engineering",
    status: "completed",
    priority: "medium",
    dueDate: addDays(new Date(), -5),
    completedDate: addDays(new Date(), -3),
    assignedTo: "David Chen",
    documents: [
      { id: "5", title: "Environmental Report 2024", status: "completed" }
    ],
    progress: 100,
    createdDate: addDays(new Date(), -45)
  }
];

export const ComplianceTracking = ({ className }: ComplianceTrackingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent/10 text-accent border-accent/20";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "overdue":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredItems = mockComplianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesDepartment = selectedDepartment === "All Departments" || item.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All Statuses" || item.status === selectedStatus;
    const matchesPriority = selectedPriority === "All Priorities" || item.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus && matchesPriority;
  });

  const overdueItems = mockComplianceItems.filter(item => 
    item.status !== "completed" && isAfter(new Date(), item.dueDate)
  );

  const upcomingItems = mockComplianceItems.filter(item => 
    item.status !== "completed" && 
    isBefore(item.dueDate, addDays(new Date(), 7)) && 
    !isAfter(new Date(), item.dueDate)
  );

  const getCalendarEvents = () => {
    const events = mockComplianceItems.map(item => ({
      date: item.dueDate,
      item,
      type: item.status === "completed" ? "completed" : 
            item.status === "overdue" ? "overdue" :
            isBefore(item.dueDate, addDays(new Date(), 3)) ? "urgent" : "normal"
    }));
    return events;
  };

  const calendarEvents = getCalendarEvents();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance Tracking</h1>
          <p className="text-muted-foreground">
            Monitor compliance deadlines and regulatory requirements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Compliance Item
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      {(overdueItems.length > 0 || upcomingItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overdueItems.length > 0 && (
            <Card className="border-error/20 bg-error/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-error" />
                  <div>
                    <h3 className="font-medium text-error">Overdue Items</h3>
                    <p className="text-sm text-muted-foreground">
                      {overdueItems.length} compliance items are overdue
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {upcomingItems.length > 0 && (
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-warning" />
                  <div>
                    <h3 className="font-medium text-warning">Due Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      {upcomingItems.length} compliance items due within 7 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Compliance Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                overdue: calendarEvents.filter(e => e.type === "overdue").map(e => e.date),
                urgent: calendarEvents.filter(e => e.type === "urgent").map(e => e.date),
                completed: calendarEvents.filter(e => e.type === "completed").map(e => e.date)
              }}
              modifiersStyles={{
                overdue: { backgroundColor: "hsl(var(--error))", color: "white" },
                urgent: { backgroundColor: "hsl(var(--warning))", color: "white" },
                completed: { backgroundColor: "hsl(var(--accent))", color: "white" }
              }}
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>Due Soon</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search compliance items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">All Categories</SelectItem>
                    {complianceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Departments">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getStatusColor(item.status))}
                        >
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status.replace("_", " ")}</span>
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(item.priority))}
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Category: {item.category}</span>
                        <span>Department: {item.department}</span>
                        <span>Assigned to: {item.assignedTo}</span>
                        <span>Due: {format(item.dueDate, "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {item.documents.length} document{item.documents.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {item.documents.map((doc) => (
                          <Badge 
                            key={doc.id} 
                            variant={doc.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {doc.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

