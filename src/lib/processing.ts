import { uploadDocumentFile, createDocument, updateDocument, type DocumentRow } from '@/integrations/supabase/documents';
import { ocrImage } from '@/integrations/ocr/tesseract';
import { summarizeDocumentText, classifyDocument } from '@/integrations/openai/service';
import { applyRoutingRules } from '@/lib/workflow';
import { addProcessingEvent } from '@/integrations/supabase/processing';

export interface ProcessedResult {
  document: DocumentRow;
  summary?: string;
  keyInsights?: string[];
}

export async function processAndStoreDocument(args: {
  file: File;
  title: string;
  department: string;
  priority?: string;
  description?: string;
  tags?: string[];
  userId?: string;
}) {
  const { file, title, department, priority, description, tags, userId } = args;

  const ext = file.name.split('.').pop() || 'bin';
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const path = `${userId || 'anonymous'}/${timestamp}-${safeName}`;

  // Upload file to storage
  const { error: uploadErr } = await uploadDocumentFile(file, path);
  if (uploadErr) throw uploadErr;

  // Create initial document row
  const { data: doc, error: insertErr } = await createDocument({
    title,
    description: description || null,
    source: 'upload',
    file_path: path,
    file_type: file.type || ext,
    language: null,
    department,
    category: null,
    tags: tags || [],
    priority: priority || 'medium',
    status: 'processing',
    created_by: userId || null,
    assigned_to: null,
  });
  if (insertErr || !doc) throw insertErr;
  await addProcessingEvent({ document_id: doc.id, stage: 'uploaded', status: 'completed', message: 'File uploaded to storage' });

  let extractedText = '';
  try {
    if (file.type.startsWith('image/')) {
      await addProcessingEvent({ document_id: doc.id, stage: 'ocr', status: 'in_progress', message: 'OCR started' });
      const { text } = await ocrImage(file, 'eng');
      extractedText = text;
      await addProcessingEvent({ document_id: doc.id, stage: 'ocr', status: 'completed', message: 'OCR completed' });
    }
  } catch {
    // continue without OCR
    await addProcessingEvent({ document_id: doc.id, stage: 'ocr', status: 'error', message: 'OCR failed' });
  }

  let summary: string | undefined;
  let keyInsights: string[] | undefined;
  let category: string | undefined;
  let tagsOut: string[] | undefined;
  try {
    const baseText = extractedText || `${title}\n${description || ''}`.slice(0, 4000);
    if (baseText.trim().length) {
      await addProcessingEvent({ document_id: doc.id, stage: 'ai_categorized', status: 'in_progress', message: 'AI analysis started' });
      const sum = await summarizeDocumentText(baseText, 'en');
      summary = sum.summary;
      keyInsights = sum.keyInsights;
      const cls = await classifyDocument(baseText);
      category = cls.category;
      tagsOut = cls.tags;
      await addProcessingEvent({ document_id: doc.id, stage: 'ai_categorized', status: 'completed', message: 'AI analysis completed' });
    }
  } catch {
    // ignore AI failures
    await addProcessingEvent({ document_id: doc.id, stage: 'ai_categorized', status: 'error', message: 'AI analysis failed' });
  }

  const routed = applyRoutingRules({ ...doc, category: category || doc.category } as DocumentRow);

  const { data: updated } = await updateDocument(doc.id, {
    category: category || doc.category,
    tags: tagsOut && tagsOut.length ? (doc.tags || []).concat(tagsOut).slice(0, 20) : doc.tags,
    department: routed.department,
    priority: routed.priority || doc.priority,
    status: 'ready',
    description: doc.description,
    ai_summary: summary || null,
    ai_key_insights: keyInsights && keyInsights.length ? keyInsights.slice(0, 20) : null,
  });
  await addProcessingEvent({ document_id: doc.id, stage: 'routed', status: 'completed', message: `Routed to ${routed.department}` });

  return { document: updated || doc, summary, keyInsights } as ProcessedResult;
}


