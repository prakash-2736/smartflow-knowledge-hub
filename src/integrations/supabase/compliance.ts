import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type ComplianceRow = Tables<'compliance_tracking'>;
export type ComplianceInsert = TablesInsert<'compliance_tracking'>;
export type ComplianceUpdate = TablesUpdate<'compliance_tracking'>;

export const createCompliance = async (row: ComplianceInsert) => {
  const { data, error } = await supabase
    .from('compliance_tracking')
    .insert(row)
    .select()
    .single();
  return { data: data as ComplianceRow | null, error };
};

export const updateCompliance = async (id: string, updates: ComplianceUpdate) => {
  const { data, error } = await supabase
    .from('compliance_tracking')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data: data as ComplianceRow | null, error };
};

export const listCompliance = async (department?: string) => {
  let q = supabase.from('compliance_tracking').select('*').order('due_date');
  if (department) q = q.eq('department', department);
  const { data, error } = await q;
  return { data: (data as ComplianceRow[]) || [], error };
};


