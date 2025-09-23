import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUploadComplete = (documents: any[]) => {
    if (documents && documents.length > 0) {
      const firstDoc = documents[0];
      toast({
        title: "Upload Complete",
        description: `${documents.length} document(s) uploaded successfully and are being processed.`,
      });
      
      // Navigate to the first document's detail page to show the summary
      if (firstDoc.id) {
        navigate(`/documents/${firstDoc.id}`);
      } else {
        navigate('/documents');
      }
    }
  };

  const handleCancel = () => {
    navigate('/documents');
  };

  return (
    <Layout>
      <DocumentUpload
        onUploadComplete={handleUploadComplete}
        onCancel={handleCancel}
      />
    </Layout>
  );
};

export default Upload;
