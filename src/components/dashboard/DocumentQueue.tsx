import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Clock, 
  User, 
  ArrowRight,
  MoreHorizontal,
  Eye,
  Download,
  MessageSquare
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  type: string;
  department: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_review" | "approved" | "rejected";
  uploadedBy: string;
  uploadedAt: Date;
  assignedTo?: string;
  commentsCount: number;
  thumbnail?: string;
}

interface DocumentQueueProps {
  documents: Document[];
  department?: string;
  maxItems?: number;
  onViewDocument?: (documentId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800", 
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export const DocumentQueue = ({
  documents,
  department,
  maxItems = 5,
  onViewDocument,
  onViewAll,
  className
}: DocumentQueueProps) => {
  const filteredDocuments = department 
    ? documents.filter(doc => (doc.department || "").toLowerCase() === (department || "").toLowerCase())
    : documents;

  const displayDocuments = filteredDocuments.slice(0, maxItems);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDepartmentColor = (dept?: string) => {
    const colors = {
      operations: "text-blue-600",
      engineering: "text-green-600", 
      finance: "text-purple-600",
      hr: "text-pink-600",
      legal: "text-orange-600",
      executive: "text-red-600",
    };
    return colors[(dept || "").toLowerCase() as keyof typeof colors] || "text-gray-600";
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {department ? `${department} Documents` : "Document Queue"}
            </CardTitle>
            <CardDescription>
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} 
              {department && ` in ${department}`}
            </CardDescription>
          </div>
          {onViewAll && filteredDocuments.length > maxItems && (
            <Button variant="outline" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents available</p>
            {department && (
              <p className="text-sm">No documents in {department} department</p>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {displayDocuments.map((document) => (
                <div
                  key={document.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => onViewDocument?.(document.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Document Icon/Thumbnail */}
                    <div className="flex-shrink-0">
                      {document.thumbnail ? (
                        <img
                          src={document.thumbnail}
                          alt={document.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {document.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle quick actions
                            }}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", priorityColors[document.priority])}
                        >
                          {document.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", statusColors[document.status])}
                        >
                          {document.status.replace("_", " ")}
                        </Badge>
                        <span className={cn("text-xs font-medium", getDepartmentColor(document.department))}>
                          {document.department}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{document.uploadedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(document.uploadedAt, { addSuffix: true })}</span>
                          </div>
                          {document.commentsCount > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{document.commentsCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDocument?.(document.id);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle download
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {document.assignedTo && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getInitials(document.assignedTo)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            Assigned to {document.assignedTo}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
