import { DepartmentView } from "@/components/dashboard/DepartmentView";

const FinanceDepartment = () => {
  const departmentData = {
    name: "finance",
    displayName: "Finance",
    color: "#8B5CF6", // Purple
    teamMembers: [
      {
        id: "1",
        name: "Jennifer Lee",
        role: "Finance Manager",
        avatar: "",
        status: "online" as const,
      },
      {
        id: "2", 
        name: "Michael Brown",
        role: "Accountant",
        avatar: "",
        status: "online" as const,
      },
      {
        id: "3",
        name: "Emily Taylor",
        role: "Budget Analyst",
        avatar: "",
        status: "away" as const,
      },
      {
        id: "4",
        name: "Daniel Garcia",
        role: "Financial Controller",
        avatar: "",
        status: "offline" as const,
      },
    ],
    metrics: {
      totalDocuments: 198,
      processedToday: 25,
      pendingDocuments: 9,
      complianceRate: 96.8,
      avgProcessingTime: 1.5,
      teamProductivity: 94,
    },
    recentActivity: [
      {
        id: "1",
        type: "document_uploaded" as const,
        user: "Jennifer Lee",
        description: "uploaded Monthly Financial Statement",
        timestamp: new Date("2024-01-15T16:00:00"),
      },
      {
        id: "2",
        type: "document_processed" as const,
        user: "Michael Brown",
        description: "approved Budget Allocation Report",
        timestamp: new Date("2024-01-15T15:30:00"),
      },
      {
        id: "3",
        type: "compliance_updated" as const,
        user: "Emily Taylor",
        description: "updated Financial Compliance Checklist",
        timestamp: new Date("2024-01-15T14:45:00"),
      },
      {
        id: "4",
        type: "comment_added" as const,
        user: "Daniel Garcia",
        description: "added review comment to Expense Report",
        timestamp: new Date("2024-01-15T14:00:00"),
      },
    ],
    documents: [
      {
        id: "1",
        title: "Monthly Financial Statement - January 2024",
        type: "Excel",
        department: "Finance",
        priority: "high" as const,
        status: "in_review" as const,
        uploadedBy: "Jennifer Lee",
        uploadedAt: new Date("2024-01-15T16:00:00"),
        assignedTo: "Michael Brown",
        commentsCount: 2,
      },
      {
        id: "2",
        title: "Budget Allocation Report - Q1",
        type: "PDF",
        department: "Finance",
        priority: "medium" as const,
        status: "approved" as const,
        uploadedBy: "Michael Brown",
        uploadedAt: new Date("2024-01-15T15:30:00"),
        commentsCount: 1,
      },
      {
        id: "3",
        title: "Expense Report - December 2023",
        type: "Excel",
        department: "Finance",
        priority: "medium" as const,
        status: "pending" as const,
        uploadedBy: "Emily Taylor",
        uploadedAt: new Date("2024-01-15T14:45:00"),
        commentsCount: 3,
      },
    ],
  };

  const handleViewDocument = (documentId: string) => {
    console.log(`View document: ${documentId}`);
    // Navigate to document detail
  };

  const handleViewAllDocuments = () => {
    console.log("View all finance documents");
    // Navigate to filtered documents page
  };

  const handleViewTeamMember = (memberId: string) => {
    console.log(`View team member: ${memberId}`);
    // Navigate to user profile
  };

  return (
    <DepartmentView
      department={departmentData}
      onViewDocument={handleViewDocument}
      onViewAllDocuments={handleViewAllDocuments}
      onViewTeamMember={handleViewTeamMember}
    />
  );
};

export default FinanceDepartment;
