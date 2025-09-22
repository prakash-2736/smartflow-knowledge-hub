import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  File,
  Link,
  Mail,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { processAndStoreDocument } from "@/lib/processing";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UploadFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  error?: string;
  preview?: string;
}

interface UploadMetadata {
  title: string;
  department: string;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  description: string;
  assignedTo?: string;
}

interface DocumentUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void;
  onCancel?: () => void;
  className?: string;
}

const departments = [
  "Operations",
  "Engineering", 
  "Finance",
  "HR",
  "Legal",
  "Executive"
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" }
];

const uploadMethods = [
  { id: "local", label: "Local Files", icon: FileText },
  { id: "email", label: "Email Import", icon: Mail },
  { id: "sharepoint", label: "SharePoint", icon: Cloud },
  { id: "url", label: "URL Import", icon: Link }
];

export const DocumentUpload = ({
  onUploadComplete,
  onCancel,
  className
}: DocumentUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("local");
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    title: "",
    department: "",
    priority: "medium",
    tags: [],
    description: "",
    assignedTo: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "pending",
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const updateFileStatus = (fileId: string, status: UploadFile['status'], progress?: number, error?: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status, progress: progress ?? file.progress, error }
        : file
    ));
  };

  const realUpload = async (fileEntry: UploadFile) => {
    try {
      updateFileStatus(fileEntry.id, "uploading", 10);
      const { document } = await processAndStoreDocument({
        file: fileEntry.file,
        title: metadata.title || fileEntry.file.name,
        department: metadata.department,
        priority: metadata.priority,
        description: metadata.description,
        tags: metadata.tags,
        userId: user?.id,
      }, { asyncProcess: true });
      updateFileStatus(fileEntry.id, "processing", 80);
      updateFileStatus(fileEntry.id, "completed", 100);
      toast({ title: "Uploaded", description: `${document.title} is processing. Results will appear shortly.` });
      return document;
    } catch (e: any) {
      updateFileStatus(fileEntry.id, "error", undefined, e?.message || 'Upload failed');
      toast({ title: "Upload failed", description: e?.message || 'Unknown error', variant: 'destructive' });
      throw e;
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      if (!metadata.department) {
        throw new Error('Please select a department before uploading');
      }
      const results = await Promise.all(
        uploadFiles.filter(f => f.status === 'pending').map(f => realUpload(f))
      );
      // Return processed documents to caller
      // @ts-expect-error broadened payload for convenience
      onUploadComplete?.(results);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !metadata.tags.includes(tag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (file.type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (file.type.includes('word')) return <FileText className="h-8 w-8 text-blue-600" />;
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return <FileText className="h-8 w-8 text-green-600" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-error" />;
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upload Documents</h1>
          <p className="text-muted-foreground">
            Add new documents to the SmartDocFlow system
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {uploadMethods.map((method) => (
            <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
              <method.icon className="h-4 w-4" />
              {method.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="local" className="space-y-6">
          {/* Drag and Drop Zone */}
          <Card>
            <CardContent className="p-8">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                  uploadFiles.length > 0 && "border-primary bg-primary/5"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {dragActive ? "Drop files here" : "Drag and drop files here"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse your computer
                </p>
                <Button asChild>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileInput}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                    />
                    Browse Files
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports PDF, Word, Excel, Images, and Text files (Max 50MB each)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Files ({uploadFiles.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadFiles.map((uploadFile) => (
                  <div key={uploadFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {uploadFile.preview ? (
                        <img
                          src={uploadFile.preview}
                          alt={uploadFile.file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(uploadFile.file)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{uploadFile.file.name}</h4>
                        {getStatusIcon(uploadFile.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      {uploadFile.status === "uploading" && (
                        <Progress value={uploadFile.progress} className="mt-2" />
                      )}
                      {uploadFile.error && (
                        <p className="text-sm text-error mt-1">{uploadFile.error}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {uploadFile.preview && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                        disabled={uploadFile.status === "uploading"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Email Import</h3>
                <p className="text-muted-foreground mb-4">
                  Import documents from email attachments
                </p>
                <Button disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharepoint" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">SharePoint Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Import documents from SharePoint libraries
                </p>
                <Button disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import from URL</CardTitle>
              <CardDescription>
                Import documents from web URLs or cloud links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Document URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/document.pdf"
                  type="url"
                />
              </div>
              <Button disabled>
                Import Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metadata Form */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Document Metadata</CardTitle>
            <CardDescription>
              Add information about the documents being uploaded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter document title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={metadata.department} onValueChange={(value) => setMetadata(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={metadata.priority} onValueChange={(value: any) => setMetadata(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Input
                  id="assignedTo"
                  value={metadata.assignedTo}
                  onChange={(e) => setMetadata(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Enter user name or email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter document description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button variant="outline" onClick={() => {
                  const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement;
                  if (input) {
                    addTag(input.value);
                    input.value = "";
                  }
                }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Actions */}
      {uploadFiles.length > 0 && (
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || uploadFiles.some(f => f.status === "uploading")}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};


