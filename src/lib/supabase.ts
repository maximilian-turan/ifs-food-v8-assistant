import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const mapAudit = (row: any) => ({
  id: row.id,
  companyName: row.company_name,
  auditorName: row.auditor_name,
  date: row.date,
  status: row.status,
  ownerId: row.owner_id,
});

export const mapWalkthrough = (row: any) => ({
  id: row.id,
  area: row.area,
  date: row.date,
  shift: row.shift,
  auditor: row.auditor,
  topics: row.topics || [],
  findings: row.findings || '',
  actionRequired: row.action_required,
  actionDetails: row.action_details || '',
  responsible: row.responsible || '',
  deadline: row.deadline || undefined,
  photoPaths: row.photo_paths || [],
});
