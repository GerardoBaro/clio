import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env.js';

let client: SupabaseClient<any, 'clio'> | undefined;

export function getSupabaseClient(): SupabaseClient<any, 'clio'> {
  if (!client) {
    const { url, serviceRoleKey } = getSupabaseConfig();
    client = createClient<any, 'clio'>(url, serviceRoleKey, {
      auth: {
        persistSession: false
      },
      db: {
        schema: 'clio'
      }
    });
  }

  return client;
}
