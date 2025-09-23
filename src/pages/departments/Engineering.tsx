import { DepartmentView } from "@/components/dashboard/DepartmentView";

const EngineeringDepartment = () => {
  const departmentData = {
    name: "engineering",
    displayName: "Engineering",
    color: "#059669", // Accent green
    teamMembers: [
      {
        id: "1",
        name: "David Chen",
        role: "Senior Engineer",
        avatar: "",
        status: "online" as const,
      },
      {
        id: "2", 
        name: "Robert Kim",
        role: "Project Manager",
        avatar: "",
        status: "online" as const,
      },
      {
        id: "3",
        name: "Maria Rodriguez",
        role: "Systems Engineer",
        avatar: "",
        status: "away" as const,
      },
      {
        id: "4",
        name: "James Wilson",
        role: "Technical Lead",
        avatar: "",
        status: "offline" as const,
      },
    ],
    metrics: {
      totalDocuments: 287,
      processedToday: 38,
      pendingDocuments: 42,
      complianceRate: 85.2,
      avgProcessingTime: 3.2,
      teamProductivity: 82,
    },
    recentActivity: [
      {
        id: "1",
        type: "document_uploaded" as const,
        user: "David Chen",
        description: "uploaded Signal System Specifications",
        timestamp: new Date("2024-01-15T15:20:00"),
      },
      {
        id: "2",
        type: "document_processed" as const,
        user: "Robert Kim",
        description: "reviewed Project Timeline Document",
        timestamp: new Date("2024-01-15T14:10:00"),
      },
      {
        id: "3",
        type: "compliance_updated" as const,
        user: "Maria Rodriguez",
        description: "updated Technical Standards Compliance",
        timestamp: new Date("2024-01-15T13:30:00"),
      },
      {
        id: "4",
        type: "comment_added" as const,
        user: "James Wilson",
        description: "added technical review to Design Document",
        timestamp: new Date("2024-01-15T12:45:00"),
      },
    ],
    documents: [
      {
        id: "1",
        title: "Signal System Engineering Specifications",
        type: "PDF",
        department: "Engineering",
        priority: "urgent" as const,
        status: "in_review" as const,
        uploadedBy: "David Chen",
        uploadedAt: new Date("2024-01-15T15:20:00"),
        assignedTo: "Robert Kim",
        commentsCount: 4,
      },
      {
        id: "2",
        title: "Project Timeline - Q1 2024",
        type: "Excel",
        department: "Engineering",
        priority: "high" as const,
        status: "approved" as const,
        uploadedBy: "Robert Kim",
        uploadedAt: new Date("2024-01-15T14:10:00"),
        commentsCount: 2,
      },
      {
        id: "3",
        title: "Technical Standards Compliance Report",
        type: "PDF",
        department: "Engineering",
        priority: "medium" as const,
        status: "pending" as const,
        uploadedBy: "Maria Rodriguez",
        uploadedAt: new Date("2024-01-15T13:30:00"),
        commentsCount: 1,
      },
    ],
  };

  const handleViewDocument = (documentId: string) => {
    console.log(`View document: ${documentId}`);
    // Navigate to document detail
  };

  const handleViewAllDocuments = () => {
    console.log("View all engineering documents");
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

export default EngineeringDepartment;
