import { supabase } from './client';
import type { TablesInsert } from './types';

export type ProcessingRow = TablesInsert<'document_processing_status'>;

export const addProcessingEvent = async (event: Omit<ProcessingRow, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('document_processing_status')
    .insert(event)
    .select()
    .single();
  return { data, error };
};

export const listProcessingEvents = async (documentId: string) => {
  const { data, error } = await supabase
    .from('document_processing_status')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
};


