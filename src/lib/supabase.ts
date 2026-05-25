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
