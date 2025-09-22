import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type DocumentRow = Tables<'documents'>;
export type DocumentInsert = TablesInsert<'documents'>;
export type DocumentUpdate = TablesUpdate<'documents'>;

export const createDocument = async (doc: DocumentInsert) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(doc)
    .select()
    .single();
  return { data: data as DocumentRow | null, error };
};

export const updateDocument = async (id: string, updates: DocumentUpdate) => {
  const { data, error } = await supabase
    .from('documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data: data as DocumentRow | null, error };
};

export const getDocument = async (id: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();
  return { data: data as DocumentRow | null, error };
};

export interface DocumentSearchParams {
  query?: string;
  department?: string;
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
  orderBy?: { column: keyof DocumentRow; ascending?: boolean };
}

export const searchDocuments = async (params: DocumentSearchParams) => {
  let q = supabase.from('documents').select('*', { count: 'exact' });
  if (params.department) q = q.eq('department', params.department);
  if (params.category) q = q.eq('category', params.category);
  if (params.status) q = q.eq('status', params.status);
  if (params.limit) q = q.limit(params.limit);
  if (params.offset) q = q.range(params.offset, (params.offset || 0) + (params.limit || 20) - 1);
  if (params.orderBy) q = q.order(params.orderBy.column as string, { ascending: params.orderBy.ascending });
  const { data, error, count } = await q;
  return { data: (data as DocumentRow[]) || [], error, count };
};

export const uploadDocumentFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage.from('documents').upload(path, file, {
    upsert: false,
    contentType: file.type,
  });
  return { data, error };
};

export const getDocumentFileUrl = (path: string) => {
  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return data.publicUrl;
};


