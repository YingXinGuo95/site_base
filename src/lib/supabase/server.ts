import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// service_role key bypasses RLS — keep it server-side only
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server Supabase client with service_role privileges.
 * Bypasses RLS — use only in server components / API routes / server actions.
 */
export function createServiceSupabaseClient() {
  return createClient(supabaseUrl, serviceRoleKey);
}
