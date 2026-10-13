import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";

let client: SupabaseClient | null = null;

/** Service-role client for server code only. Returns null until the keys are configured. */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!config.supabaseUrl || !key) return null;
  client ??= createClient(config.supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
