import { DepartmentView } from "@/components/dashboard/DepartmentView";

const LegalDepartment = () => {
  const departmentData = {
    name: "legal",
    displayName: "Legal",
    color: "#1E40AF",
    teamMembers: [
      { id: "1", name: "Priya S", role: "Legal Officer", avatar: "", status: "online" as const },
      { id: "2", name: "Arun V", role: "Compliance Analyst", avatar: "", status: "offline" as const },
    ],
    metrics: {
      totalDocuments: 210,
      processedToday: 18,
      pendingDocuments: 9,
      complianceRate: 93.4,
      avgProcessingTime: 2.1,
      teamProductivity: 79,
    },
    recentActivity: [
      { id: "1", type: "document_processed" as const, user: "Priya S", description: "approved Regulatory Circular", timestamp: new Date() },
    ],
    documents: [
      { id: "1", title: "Regulatory Circular - Safety Standards", type: "PDF", department: "Legal", priority: "urgent" as const, status: "in_review" as const, uploadedBy: "Priya S", uploadedAt: new Date(), commentsCount: 3 },
    ],
  };

  return (
    <DepartmentView
      department={departmentData}
      onViewDocument={(id) => console.log("View document", id)}
      onViewAllDocuments={() => console.log("View all Legal documents")}
      onViewTeamMember={(id) => console.log("View team member", id)}
    />
  );
};

export default LegalDepartment;


