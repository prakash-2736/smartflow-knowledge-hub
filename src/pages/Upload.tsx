import { Layout } from "@/components/layout/Layout";
import { DocumentUpload } from "@/components/documents/DocumentUpload";

const Upload = () => {
  const handleUploadComplete = (files: any[]) => {
    console.log("Upload complete:", files);
    // Handle upload completion - could redirect to documents page or show success message
  };

  const handleCancel = () => {
    console.log("Upload cancelled");
    // Handle cancel - could redirect back to documents page
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
