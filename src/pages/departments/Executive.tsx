import { DepartmentView } from "@/components/dashboard/DepartmentView";

const ExecutiveDepartment = () => {
  const departmentData = {
    name: "executive",
    displayName: "Executive",
    color: "#1E40AF",
    teamMembers: [
      { id: "1", name: "Executive Director", role: "Executive", avatar: "", status: "online" as const },
    ],
    metrics: {
      totalDocuments: 80,
      processedToday: 6,
      pendingDocuments: 2,
      complianceRate: 98.1,
      avgProcessingTime: 0.8,
      teamProductivity: 91,
    },
    recentActivity: [
      { id: "1", type: "comment_added" as const, user: "Executive Director", description: "requested summary on Quarterly Report", timestamp: new Date() },
    ],
    documents: [
      { id: "1", title: "Quarterly Executive Summary", type: "PDF", priority: "high" as const, status: "approved" as const, uploadedBy: "Executive Director", uploadedAt: new Date(), commentsCount: 0 },
    ],
  };

  return (
    <DepartmentView
      department={departmentData}
      onViewDocument={(id) => console.log("View document", id)}
      onViewAllDocuments={() => console.log("View all Executive documents")}
      onViewTeamMember={(id) => console.log("View team member", id)}
    />
  );
};

export default ExecutiveDepartment;


