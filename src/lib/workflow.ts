import type { DocumentRow } from '@/integrations/supabase/documents';

export interface RoutingRule {
  match: (doc: Pick<DocumentRow, 'title' | 'category' | 'department' | 'tags'>) => boolean;
  routeToDepartment?: string;
  routeToRole?: string;
  priority?: string;
}

export const defaultRules: RoutingRule[] = [
  {
    match: (d) => /invoice|payment|bill/i.test(d.title) || d.category === 'finance',
    routeToDepartment: 'Finance',
    priority: 'High',
  },
  {
    match: (d) => /maintenance|equipment|spares|work order/i.test(d.title) || d.category === 'engineering',
    routeToDepartment: 'Engineering',
  },
  {
    match: (d) => /circular|regulation|compliance/i.test(d.title),
    routeToDepartment: 'Legal',
    priority: 'Urgent',
  },
];

export function applyRoutingRules(doc: DocumentRow, rules: RoutingRule[] = defaultRules) {
  for (const rule of rules) {
    if (rule.match(doc)) {
      return {
        department: rule.routeToDepartment ?? doc.department,
        role: rule.routeToRole,
        priority: rule.priority ?? doc.priority,
      };
    }
  }
  return { department: doc.department, role: undefined, priority: doc.priority };
}


