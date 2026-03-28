import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

// Client-side (anon)
export const supabase = createClient(url, anonKey);

// Server-side only (service role — bypasses RLS)
export function createServiceClient() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
