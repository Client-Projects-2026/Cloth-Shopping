import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

// The publishable key is intentionally browser-visible. Authorization lives in RLS.
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
      })
    : null;

export const GARMENT_BUCKET = 'catalog-garments';

export function garmentUrl(path: string): string {
  if (/^\/garments\/[a-z0-9-]+\.webp$/.test(path)) return path;
  if (!supabase || !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/.test(path)) return '';
  return supabase.storage.from(GARMENT_BUCKET).getPublicUrl(path).data.publicUrl;
}
