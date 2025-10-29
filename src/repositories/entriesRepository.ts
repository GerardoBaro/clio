import type { SupabaseClient } from '@supabase/supabase-js';
import type { Entry } from '../types/index.js';

export class EntriesRepository {
  constructor(private readonly client: SupabaseClient) {}

  async insert(): Promise<Entry> {
    throw new Error('EntriesRepository.insert is not implemented yet.');
  }

  async query(): Promise<Entry[]> {
    throw new Error('EntriesRepository.query is not implemented yet.');
  }
}
