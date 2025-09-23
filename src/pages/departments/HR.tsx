import { DepartmentView } from "@/components/dashboard/DepartmentView";

const HRDepartment = () => {
  const departmentData = {
    name: "hr",
    displayName: "HR",
    color: "#1E40AF",
    teamMembers: [
      { id: "1", name: "Aisha N", role: "HR Officer", avatar: "", status: "online" as const },
      { id: "2", name: "Rahul K", role: "HR Coordinator", avatar: "", status: "away" as const },
    ],
    metrics: {
      totalDocuments: 120,
      processedToday: 12,
      pendingDocuments: 6,
      complianceRate: 96.2,
      avgProcessingTime: 1.2,
      teamProductivity: 84,
    },
    recentActivity: [
      { id: "1", type: "document_uploaded" as const, user: "Aisha N", description: "uploaded Policy Update", timestamp: new Date() },
    ],
    documents: [
      { id: "1", title: "Policy Update - Remote Work", type: "PDF", department: "HR", priority: "high" as const, status: "in_review" as const, uploadedBy: "Aisha N", uploadedAt: new Date(), commentsCount: 2 },
    ],
  };

  return (
    <DepartmentView
      department={departmentData}
      onViewDocument={(id) => console.log("View document", id)}
      onViewAllDocuments={() => console.log("View all HR documents")}
      onViewTeamMember={(id) => console.log("View team member", id)}
    />
  );
};

export default HRDepartment;


