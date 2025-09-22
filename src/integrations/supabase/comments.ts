import { supabase } from './client';
import type { Tables, TablesInsert } from './types';

export type CommentRow = Tables<'comments'>;
export type CommentInsert = TablesInsert<'comments'>;

export const listComments = async (documentId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false });
  return { data: (data as CommentRow[]) || [], error };
};

export const addComment = async (comment: CommentInsert) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();
  return { data: data as CommentRow | null, error };
};

export const subscribeComments = (documentId: string, onInsert: (row: CommentRow) => void) => {
  const channel = supabase
    .channel(`comments:${documentId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `document_id=eq.${documentId}` }, (payload) => {
      onInsert(payload.new as CommentRow);
    })
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
};


