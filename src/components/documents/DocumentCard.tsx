import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Share2, 
  Edit, 
  Trash2,
  MessageSquare,
  Clock,
  User,
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

interface DocumentCardProps {
  document: Document;
  viewMode?: "grid" | "list";
  onView?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onAssign?: (document: Document) => void;
  className?: string;
}

const getFileIcon = (type: string) => {
  const iconClass = "h-8 w-8";
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className={cn(iconClass, "text-red-500")} />;
    case "doc":
    case "docx":
      return <FileText className={cn(iconClass, "text-blue-500")} />;
    case "xls":
    case "xlsx":
      return <FileText className={cn(iconClass, "text-green-500")} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileText className={cn(iconClass, "text-purple-500")} />;
    default:
      return <FileText className={cn(iconClass, "text-gray-500")} />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "approved":
      return <CheckCircle className="h-4 w-4 text-accent" />;
    case "in_review":
    case "processing":
      return <Clock className="h-4 w-4 text-warning" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-error" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "approved":
      return "bg-accent/10 text-accent border-accent/20";
    case "in_review":
    case "processing":
      return "bg-warning/10 text-warning border-warning/20";
    case "rejected":
      return "bg-error/10 text-error border-error/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "low":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getDepartmentColor = (department: string) => {
  const colors = {
    operations: "text-blue-600",
    engineering: "text-green-600",
    finance: "text-purple-600", 
    hr: "text-pink-600",
    legal: "text-orange-600",
    executive: "text-red-600",
  };
  return colors[department.toLowerCase() as keyof typeof colors] || "text-gray-600";
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const DocumentCard = ({
  document,
  viewMode = "grid",
  onView,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onAssign,
  className
}: DocumentCardProps) => {
  const handleView = () => onView?.(document);
  const handleEdit = () => onEdit?.(document);
  const handleDelete = () => onDelete?.(document);
  const handleDownload = () => onDownload?.(document);
  const handleShare = () => onShare?.(document);
  const handleAssign = () => onAssign?.(document);

  if (viewMode === "list") {
    return (
      <Card className={cn("hover:shadow-md transition-shadow cursor-pointer", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0">
              {document.thumbnail ? (
                <img
                  src={document.thumbnail}
                  alt={document.title}
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                  {getFileIcon(document.type)}
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 
                  className="font-medium text-sm truncate hover:text-primary transition-colors"
                  onClick={handleView}
                >
                  {document.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleView}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAssign}>
                      <User className="mr-2 h-4 w-4" />
                      Assign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-error">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getStatusColor(document.status))}
                >
                  {getStatusIcon(document.status)}
                  <span className="ml-1">{document.status.replace("_", " ")}</span>
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getPriorityColor(document.priority))}
                >
                  {document.priority}
                </Badge>
                <span className={cn("text-xs font-medium", getDepartmentColor(document.department))}>
                  {document.department}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{document.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDistanceToNow(document.uploadedAt, { addSuffix: true })}</span>
                  </div>
                  {document.commentsCount > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{document.commentsCount}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>{formatFileSize(document.size)}</span>
                  <span>v{document.version}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200 cursor-pointer group", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle 
              className="text-sm font-medium truncate group-hover:text-primary transition-colors"
              onClick={handleView}
            >
              {document.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getStatusColor(document.status))}
              >
                {getStatusIcon(document.status)}
                <span className="ml-1">{document.status.replace("_", " ")}</span>
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getPriorityColor(document.priority))}
              >
                {document.priority}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAssign}>
                <User className="mr-2 h-4 w-4" />
                Assign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-error">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* File Preview */}
        <div className="flex items-center justify-center h-24 bg-muted rounded-lg mb-3">
          {document.thumbnail ? (
            <img
              src={document.thumbnail}
              alt={document.title}
              className="w-full h-full rounded object-cover"
            />
          ) : (
            getFileIcon(document.type)
          )}
        </div>

        {/* Document Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className={cn("font-medium", getDepartmentColor(document.department))}>
              {document.department}
            </span>
            <span>{formatFileSize(document.size)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{document.uploadedBy}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(document.uploadedAt, { addSuffix: true })}</span>
          </div>

          {document.tags.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {document.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {document.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    +{document.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {document.commentsCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span>{document.commentsCount} comment{document.commentsCount !== 1 ? "s" : ""}</span>
            </div>
          )}

          {document.assignedTo && (
            <div className="flex items-center gap-2 text-xs">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {document.assignedTo.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">Assigned to {document.assignedTo}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

