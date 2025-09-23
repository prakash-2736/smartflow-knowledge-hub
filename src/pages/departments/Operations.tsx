import { DepartmentView } from "@/components/dashboard/DepartmentView";

const OperationsDepartment = () => {
  const departmentData = {
    name: "operations",
    displayName: "Operations",
    color: "#1E40AF", // Primary blue
    teamMembers: [
      {
        id: "1",
        name: "John Smith",
        role: "Station Controller",
        avatar: "",
        status: "online" as const,
      },
      {
        id: "2", 
        name: "Sarah Johnson",
        role: "Operations Manager",
        avatar: "",
        status: "online" as const,
      },
      {
        id: "3",
        name: "Mike Davis",
        role: "Safety Officer",
        avatar: "",
        status: "away" as const,
      },
      {
        id: "4",
        name: "Lisa Wang",
        role: "Maintenance Supervisor",
        avatar: "",
        status: "offline" as const,
      },
    ],
    metrics: {
      totalDocuments: 324,
      processedToday: 45,
      pendingDocuments: 26,
      complianceRate: 92.5,
      avgProcessingTime: 1.8,
      teamProductivity: 88,
    },
    recentActivity: [
      {
        id: "1",
        type: "document_uploaded" as const,
        user: "John Smith",
        description: "uploaded Station Safety Inspection Report",
        timestamp: new Date("2024-01-15T14:30:00"),
      },
      {
        id: "2",
        type: "document_processed" as const,
        user: "Sarah Johnson",
        description: "approved Daily Operations Summary",
        timestamp: new Date("2024-01-15T13:45:00"),
      },
      {
        id: "3",
        type: "compliance_updated" as const,
        user: "Mike Davis",
        description: "updated Safety Compliance Checklist",
        timestamp: new Date("2024-01-15T12:20:00"),
      },
      {
        id: "4",
        type: "comment_added" as const,
        user: "Lisa Wang",
        description: "added comment to Maintenance Schedule",
        timestamp: new Date("2024-01-15T11:15:00"),
      },
    ],
    documents: [
      {
        id: "1",
        title: "Station Safety Inspection Report - Terminal 1",
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
        title: "Daily Operations Summary - January 15",
        type: "Excel",
        department: "Operations",
        priority: "medium" as const,
        status: "approved" as const,
        uploadedBy: "Sarah Johnson",
        uploadedAt: new Date("2024-01-15T13:45:00"),
        commentsCount: 1,
      },
      {
        id: "3",
        title: "Maintenance Schedule - Week 3",
        type: "PDF",
        department: "Operations",
        priority: "high" as const,
        status: "pending" as const,
        uploadedBy: "Lisa Wang",
        uploadedAt: new Date("2024-01-15T11:15:00"),
        commentsCount: 5,
      },
    ],
  };

  const handleViewDocument = (documentId: string) => {
    console.log(`View document: ${documentId}`);
    // Navigate to document detail
  };

  const handleViewAllDocuments = () => {
    console.log("View all operations documents");
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

export default OperationsDepartment;
