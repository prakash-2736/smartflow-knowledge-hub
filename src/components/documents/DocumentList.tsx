import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DocumentCard } from "./DocumentCard";
import { DocumentSearch } from "./DocumentSearch";
import { 
  Trash2, 
  Move, 
  Tag, 
  Download,
  Plus,
  FileText,
  Grid,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  type: string;
  size: number;
  department: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_review" | "approved" | "rejected" | "processing" | "completed";
  uploadedBy: string;
  uploadedAt: Date;
  assignedTo?: string;
  commentsCount: number;
  tags: string[];
  thumbnail?: string;
  version: number;
  lastModified: Date;
}

interface DocumentListProps {
  documents: Document[];
  onViewDocument?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
  onShareDocument?: (document: Document) => void;
  onAssignDocument?: (document: Document) => void;
  onUploadDocument?: () => void;
  onExportDocuments?: () => void;
  className?: string;
}

export const DocumentList = ({
  documents,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onDownloadDocument,
  onShareDocument,
  onAssignDocument,
  onUploadDocument,
  onExportDocuments,
  className
}: DocumentListProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchFilters, setSearchFilters] = useState<any>({});

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) {
        newSet.delete(documentId);
      } else {
        newSet.add(documentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === documents.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.id));
    console.log(`Bulk action: ${action}`, selectedDocs);
    // Implement bulk actions
  };

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    console.log("Search filters:", filters);
    // Implement search logic
  };

  const handleClearSearch = () => {
    setSearchFilters({});
    console.log("Clear search");
    // Implement clear search logic
  };

  const filteredDocuments = documents; // In real app, filter based on searchFilters

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <DocumentSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onExport={onExportDocuments}
      />

      {/* Bulk Actions Toolbar */}
      {selectedDocuments.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedDocuments.size === documents.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedDocuments.size} document{selectedDocuments.size !== 1 ? "s" : ""} selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("download")}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("move")}>
              <Move className="h-4 w-4 mr-2" />
              Move
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("tag")}>
              <Tag className="h-4 w-4 mr-2" />
              Tag
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction("delete")}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Documents ({filteredDocuments.length})
          </h2>
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={onUploadDocument} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {Object.keys(searchFilters).length > 0 
              ? "Try adjusting your search filters or clear them to see all documents."
              : "Get started by uploading your first document."
            }
          </p>
          <Button onClick={onUploadDocument}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredDocuments.map((document) => (
            <div key={document.id} className="relative">
              {selectedDocuments.has(document.id) && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox checked onCheckedChange={() => handleSelectDocument(document.id)} />
                </div>
              )}
              <DocumentCard
                document={document}
                viewMode={viewMode}
                onView={onViewDocument}
                onEdit={onEditDocument}
                onDelete={onDeleteDocument}
                onDownload={onDownloadDocument}
                onShare={onShareDocument}
                onAssign={onAssignDocument}
                className={selectedDocuments.has(document.id) ? "ring-2 ring-primary" : ""}
              />
              {!selectedDocuments.has(document.id) && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Checkbox onCheckedChange={() => handleSelectDocument(document.id)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredDocuments.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of {documents.length} documents
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


