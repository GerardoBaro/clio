import dotenv from 'dotenv';

let envLoaded = false;

export function loadEnv(): void {
  if (envLoaded) return;
  dotenv.config();
  envLoaded = true;
}

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !serviceRoleKey || !anonKey) {
    throw new Error('Supabase environment variables are not fully configured.');
  }

  return { url, serviceRoleKey, anonKey };
}

export function getServerPort(): number {
  const portValue = process.env.MCP_SERVER_PORT ?? '8080';
  const port = Number.parseInt(portValue, 10);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid MCP_SERVER_PORT value: ${portValue}`);
  }
  return port;
}
