-- Create documents table for storing uploaded files
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'upload',
  file_path TEXT,
  file_type TEXT,
  file_size BIGINT,
  language TEXT,
  department TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  ai_summary TEXT,
  ai_key_insights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Users can view documents in their department or assigned to them" 
ON public.documents 
FOR SELECT 
USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND profiles.department = documents.department
  )
);

CREATE POLICY "Users can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own documents or documents in their department" 
ON public.documents 
FOR UPDATE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND profiles.department = documents.department
  )
);

CREATE POLICY "Users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (created_by = auth.uid());

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies
CREATE POLICY "Users can view documents in their department" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.documents d
      JOIN public.profiles p ON p.user_id = auth.uid()
      WHERE d.file_path = name AND d.department = p.department
    )
  )
);

CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create document processing status table
CREATE TABLE public.document_processing_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for processing status
ALTER TABLE public.document_processing_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view processing status for accessible documents" 
ON public.document_processing_status 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_id AND (
      d.created_by = auth.uid() OR 
      d.assigned_to = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid() 
        AND p.department = d.department
      )
    )
  )
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();