import type { SupabaseClient } from '@supabase/supabase-js';
import type { Collection } from '../types/index.js';

export class CollectionsRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listByUser(): Promise<Collection[]> {
    throw new Error('CollectionsRepository.listByUser is not implemented yet.');
  }

  async insert(): Promise<Collection> {
    throw new Error('CollectionsRepository.insert is not implemented yet.');
  }
}
