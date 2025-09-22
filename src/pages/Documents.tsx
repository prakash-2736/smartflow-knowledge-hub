import { useEffect, useState } from "react";
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
  Plus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type DocRow = Tables<'documents'>;

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
  const [docs, setDocs] = useState<DocRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchDocs = async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (mounted) setDocs(data || []);
    };
    fetchDocs();
    const channel = supabase
      .channel('realtime-docs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => fetchDocs())
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

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

  const handleUploadComplete = async (results: any[]) => {
    setShowUpload(false);
    if (results && results.length > 0) {
      const latest = results[0];
      const mapped = {
        id: latest.id,
        title: latest.title,
        type: (latest.file_type || 'File').toUpperCase(),
        size: 0,
        department: latest.department,
        priority: (latest.priority || 'medium') as any,
        status: (latest.status === 'ready' ? 'completed' : 'processing') as any,
        uploadedBy: 'You',
        uploadedAt: new Date(latest.created_at),
        commentsCount: 0,
        tags: latest.tags || [],
        version: 1,
        lastModified: new Date(latest.updated_at),
        description: latest.description || '',
        aiSummary: '',
      };
      setSelectedDocument(mapped);
      setShowDocumentDetail(true);
    }
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
              documents={docs.map(d => ({
                id: d.id,
                title: d.title,
                type: (d.file_type || 'File').toString(),
                size: 0,
                department: d.department,
                priority: (d.priority || 'medium') as any,
                status: (d.status === 'ready' ? 'completed' : d.status === 'processing' ? 'processing' : 'pending') as any,
                uploadedBy: 'System',
                uploadedAt: new Date(d.created_at),
                commentsCount: 0,
                tags: d.tags || [],
                version: 1,
                lastModified: new Date(d.updated_at),
                aiSummary: d.ai_summary || undefined,
                keyInsights: (d.ai_key_insights as any) || undefined,
              }))}
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
