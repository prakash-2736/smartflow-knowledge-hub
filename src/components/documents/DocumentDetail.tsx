import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowLeft,
  Download, 
  Share2, 
  Edit, 
  MoreHorizontal,
  MessageSquare,
  User,
  Calendar,
  Tag,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Copy,
  ExternalLink,
  History,
  Star,
  Flag
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
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
  description?: string;
  aiSummary?: string;
  keyInsights?: Array<{
    type: "deadline" | "risk" | "action" | "person";
    content: string;
    importance: "low" | "medium" | "high";
  }>;
  relatedDocuments?: Array<{
    id: string;
    title: string;
    type: string;
  }>;
  processingHistory?: Array<{
    action: string;
    user: string;
    timestamp: Date;
    details?: string;
  }>;
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
}

interface DocumentDetailProps {
  document: Document;
  comments: Comment[];
  onBack: () => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onAssign?: (document: Document) => void;
  onAddComment?: (comment: string) => void;
  onReply?: (parentId: string, reply: string) => void;
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "approved":
      return <CheckCircle className="h-5 w-5 text-accent" />;
    case "in_review":
    case "processing":
      return <Clock className="h-5 w-5 text-warning" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-error" />;
    default:
      return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
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

const getInsightIcon = (type: string) => {
  switch (type) {
    case "deadline":
      return <Calendar className="h-4 w-4 text-red-500" />;
    case "risk":
      return <Flag className="h-4 w-4 text-orange-500" />;
    case "action":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case "person":
      return <User className="h-4 w-4 text-green-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export const DocumentDetail = ({
  document,
  comments,
  onBack,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onAssign,
  onAddComment,
  onReply,
  className
}: DocumentDetailProps) => {
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment);
      setNewComment("");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className={cn("text-sm", getStatusColor(document.status))}
              >
                {getStatusIcon(document.status)}
                <span className="ml-1">{document.status.replace("_", " ")}</span>
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-sm", getPriorityColor(document.priority))}
              >
                {document.priority}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onDownload?.(document)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={() => onShare?.(document)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(document)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssign?.(document)}>
                <User className="mr-2 h-4 w-4" />
                Assign to User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(document)} className="text-error">
                <XCircle className="mr-2 h-4 w-4" />
                Delete Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Viewer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                {document.thumbnail ? (
                  <img
                    src={document.thumbnail}
                    alt={document.title}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Preview not available</p>
                    <Button variant="outline" className="mt-2" onClick={() => onDownload?.(document)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({comments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {document.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{document.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">File Details</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Type: {document.type}</div>
                        <div>Size: {(document.size / 1024 / 1024).toFixed(2)} MB</div>
                        <div>Version: {document.version}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Timeline</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Uploaded: {format(document.uploadedAt, "MMM dd, yyyy")}</div>
                        <div>Modified: {format(document.lastModified, "MMM dd, yyyy")}</div>
                        <div>Uploaded by: {document.uploadedBy}</div>
                      </div>
                    </div>
                  </div>

                  {document.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {document.aiSummary ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {document.aiSummary}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">No AI summary available yet.</p>
                  )}
                </CardContent>
              </Card>

              {document.keyInsights && document.keyInsights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {document.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0 mt-0.5">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{insight.type}</span>
                              <Badge 
                                variant={insight.importance === "high" ? "destructive" : insight.importance === "medium" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {insight.importance}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {document.relatedDocuments && document.relatedDocuments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {document.relatedDocuments.map((related) => (
                        <div key={related.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{related.title}</span>
                          <Badge variant="outline" className="text-xs ml-auto">
                            {related.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments & Collaboration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Add Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-muted pl-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {comment.user.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.user}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Uploaded by</p>
                    <p className="text-sm text-muted-foreground">{document.uploadedBy}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(document.uploadedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {document.assignedTo && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Assigned to</p>
                      <p className="text-sm text-muted-foreground">{document.assignedTo}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Comments</p>
                    <p className="text-sm text-muted-foreground">{comments.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing History */}
          {document.processingHistory && document.processingHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Processing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {document.processingHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">
                          by {entry.user} • {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                        </p>
                        {entry.details && (
                          <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};


