import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env.js';

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const { url, serviceRoleKey } = getSupabaseConfig();
    client = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false
      }
    });
  }

  return client;
}
