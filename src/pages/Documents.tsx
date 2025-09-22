import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentDetail } from "@/components/documents/DocumentDetail";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { ComplianceTracking } from "@/components/documents/ComplianceTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Upload, 
  Shield, 
  ArrowLeft,
  Plus
} from "lucide-react";

// Mock data for documents
const mockDocuments = [
  {
    id: "1",
    title: "Metro Station Safety Inspection Report - Terminal 1",
    type: "PDF",
    size: 2048576, // 2MB
    department: "Operations",
    priority: "high" as const,
    status: "in_review" as const,
    uploadedBy: "John Smith",
    uploadedAt: new Date("2024-01-15T14:30:00"),
    assignedTo: "Sarah Johnson",
    commentsCount: 3,
    tags: ["safety", "inspection", "compliance"],
    thumbnail: undefined,
    version: 1,
    lastModified: new Date("2024-01-15T14:30:00"),
    description: "Comprehensive safety inspection report for Terminal 1 station covering all safety systems and protocols.",
    aiSummary: "This document contains a detailed safety inspection report for Terminal 1 of the metro system. Key findings include proper functioning of emergency systems, compliance with safety protocols, and recommendations for minor improvements in signage and lighting.",
    keyInsights: [
      {
        type: "deadline" as const,
        content: "Follow-up inspection required within 30 days",
        importance: "high" as const
      },
      {
        type: "risk" as const,
        content: "Minor lighting issues identified in platform area",
        importance: "medium" as const
      },
      {
        type: "action" as const,
        content: "Schedule maintenance for emergency exit signs",
        importance: "medium" as const
      }
    ],
    relatedDocuments: [
      { id: "2", title: "Emergency Procedures Manual", type: "PDF" },
      { id: "3", title: "Safety Equipment Checklist", type: "Excel" }
    ],
    processingHistory: [
      {
        action: "Document uploaded",
        user: "John Smith",
        timestamp: new Date("2024-01-15T14:30:00"),
        details: "Initial upload of safety inspection report"
      },
      {
        action: "AI processing started",
        user: "System",
        timestamp: new Date("2024-01-15T14:31:00"),
        details: "Document sent for AI analysis and summarization"
      },
      {
        action: "Assigned for review",
        user: "Sarah Johnson",
        timestamp: new Date("2024-01-15T15:00:00"),
        details: "Document assigned to safety team for review"
      }
    ]
  },
  {
    id: "2",
    title: "Monthly Financial Statement - January 2024",
    type: "Excel",
    size: 1024000, // 1MB
    department: "Finance",
    priority: "medium" as const,
    status: "approved" as const,
    uploadedBy: "Jennifer Lee",
    uploadedAt: new Date("2024-01-14T10:15:00"),
    commentsCount: 1,
    tags: ["financial", "monthly", "report"],
    thumbnail: undefined,
    version: 2,
    lastModified: new Date("2024-01-14T10:15:00"),
    description: "Monthly financial statement covering all revenue, expenses, and operational costs for January 2024.",
    aiSummary: "Financial statement shows strong revenue growth of 12% compared to previous month, with operational costs remaining stable. Key highlights include increased ridership revenue and successful cost optimization initiatives.",
    keyInsights: [
      {
        type: "action" as const,
        content: "Review budget allocation for Q2",
        importance: "high" as const
      }
    ],
    relatedDocuments: [],
    processingHistory: []
  },
  {
    id: "3",
    title: "HR Policy Update - Remote Work Guidelines",
    type: "Word",
    size: 512000, // 512KB
    department: "HR",
    priority: "urgent" as const,
    status: "pending" as const,
    uploadedBy: "Lisa Wang",
    uploadedAt: new Date("2024-01-13T16:45:00"),
    commentsCount: 7,
    tags: ["hr", "policy", "remote-work"],
    thumbnail: undefined,
    version: 1,
    lastModified: new Date("2024-01-13T16:45:00"),
    description: "Updated HR policy document outlining remote work guidelines and procedures for all employees.",
    aiSummary: "This document outlines comprehensive remote work guidelines including eligibility criteria, equipment requirements, communication protocols, and performance evaluation standards for remote employees.",
    keyInsights: [
      {
        type: "deadline" as const,
        content: "Policy implementation deadline: February 1, 2024",
        importance: "high" as const
      },
      {
        type: "action" as const,
        content: "Schedule training sessions for managers",
        importance: "medium" as const
      }
    ],
    relatedDocuments: [
      { id: "4", title: "Employee Handbook", type: "PDF" },
      { id: "5", title: "Remote Work Agreement Template", type: "Word" }
    ],
    processingHistory: []
  },
  {
    id: "4",
    title: "Engineering Specifications - Signal System Upgrade",
    type: "PDF",
    size: 5242880, // 5MB
    department: "Engineering",
    priority: "high" as const,
    status: "processing" as const,
    uploadedBy: "David Chen",
    uploadedAt: new Date("2024-01-12T09:20:00"),
    assignedTo: "Robert Kim",
    commentsCount: 2,
    tags: ["engineering", "signals", "upgrade", "technical"],
    thumbnail: undefined,
    version: 1,
    lastModified: new Date("2024-01-12T09:20:00"),
    description: "Detailed engineering specifications for the upcoming signal system upgrade across all metro lines.",
    aiSummary: "Technical specifications document outlining the complete signal system upgrade including new hardware requirements, software integration, testing procedures, and implementation timeline spanning 18 months.",
    keyInsights: [
      {
        type: "deadline" as const,
        content: "Phase 1 completion target: March 2024",
        importance: "high" as const
      },
      {
        type: "risk" as const,
        content: "Potential service disruption during implementation",
        importance: "high" as const
      }
    ],
    relatedDocuments: [
      { id: "6", title: "Signal System Maintenance Log", type: "Excel" },
      { id: "7", title: "Upgrade Project Timeline", type: "PDF" }
    ],
    processingHistory: []
  },
  {
    id: "5",
    title: "Legal Compliance Checklist - Q1 2024",
    type: "PDF",
    size: 768000, // 768KB
    department: "Legal",
    priority: "urgent" as const,
    status: "pending" as const,
    uploadedBy: "Michael Brown",
    uploadedAt: new Date("2024-01-11T14:10:00"),
    commentsCount: 0,
    tags: ["legal", "compliance", "quarterly"],
    thumbnail: undefined,
    version: 1,
    lastModified: new Date("2024-01-11T14:10:00"),
    description: "Comprehensive legal compliance checklist covering all regulatory requirements for Q1 2024.",
    aiSummary: "Legal compliance document detailing all regulatory requirements, deadlines, and action items for Q1 2024. Includes environmental regulations, safety standards, labor laws, and financial reporting requirements.",
    keyInsights: [
      {
        type: "deadline" as const,
        content: "Environmental impact report due: January 31, 2024",
        importance: "urgent" as const
      },
      {
        type: "action" as const,
        content: "Schedule compliance training for all departments",
        importance: "high" as const
      }
    ],
    relatedDocuments: [],
    processingHistory: []
  }
];

const mockComments = [
  {
    id: "1",
    user: "Sarah Johnson",
    content: "The safety inspection looks comprehensive. I recommend scheduling the follow-up inspection within the next 2 weeks to address the lighting issues mentioned.",
    timestamp: new Date("2024-01-15T16:00:00")
  },
  {
    id: "2",
    user: "Mike Davis",
    content: "I agree with Sarah's assessment. The emergency exit sign maintenance should be prioritized given the high foot traffic in that area.",
    timestamp: new Date("2024-01-15T17:30:00")
  },
  {
    id: "3",
    user: "John Smith",
    content: "I'll coordinate with the maintenance team to schedule the repairs. Should be completed by end of week.",
    timestamp: new Date("2024-01-16T09:15:00")
  }
];

const Documents = () => {
  const [activeTab, setActiveTab] = useState("repository");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showDocumentDetail, setShowDocumentDetail] = useState(false);

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document);
    setShowDocumentDetail(true);
  };

  const handleEditDocument = (document: any) => {
    console.log("Edit document:", document);
    // Navigate to edit mode or open edit modal
  };

  const handleDeleteDocument = (document: any) => {
    console.log("Delete document:", document);
    // Show confirmation dialog and delete
  };

  const handleDownloadDocument = (document: any) => {
    console.log("Download document:", document);
    // Trigger download
  };

  const handleShareDocument = (document: any) => {
    console.log("Share document:", document);
    // Open share modal
  };

  const handleAssignDocument = (document: any) => {
    console.log("Assign document:", document);
    // Open assignment modal
  };

  const handleUploadComplete = (files: any[]) => {
    console.log("Upload complete:", files);
    setShowUpload(false);
    // Refresh document list
  };

  const handleAddComment = (comment: string) => {
    console.log("Add comment:", comment);
    // Add comment to document
  };

  const handleReply = (parentId: string, reply: string) => {
    console.log("Reply to comment:", parentId, reply);
    // Add reply to comment
  };

  const handleBackToRepository = () => {
    setShowDocumentDetail(false);
    setSelectedDocument(null);
  };

  if (showDocumentDetail && selectedDocument) {
    return (
      <Layout>
        <DocumentDetail
          document={selectedDocument}
          comments={mockComments}
          onBack={handleBackToRepository}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          onDownload={handleDownloadDocument}
          onShare={handleShareDocument}
          onAssign={handleAssignDocument}
          onAddComment={handleAddComment}
          onReply={handleReply}
        />
      </Layout>
    );
  }

  if (showUpload) {
    return (
      <Layout>
        <DocumentUpload
          onUploadComplete={handleUploadComplete}
          onCancel={() => setShowUpload(false)}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage, search, and collaborate on all your documents
            </p>
          </div>
          <Button onClick={() => setShowUpload(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="repository" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document Repository
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="repository" className="space-y-6">
            <DocumentList
              documents={mockDocuments}
              onViewDocument={handleViewDocument}
              onEditDocument={handleEditDocument}
              onDeleteDocument={handleDeleteDocument}
              onDownloadDocument={handleDownloadDocument}
              onShareDocument={handleShareDocument}
              onAssignDocument={handleAssignDocument}
              onUploadDocument={() => setShowUpload(true)}
              onExportDocuments={() => console.log("Export documents")}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <DocumentUpload
              onUploadComplete={handleUploadComplete}
              onCancel={() => setActiveTab("repository")}
            />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <ComplianceTracking />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Documents;
