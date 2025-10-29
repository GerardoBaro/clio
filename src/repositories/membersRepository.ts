import type { SupabaseClient } from '@supabase/supabase-js';
import type { CollectionMember } from '../types/index.js';

export class MembersRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listMembers(): Promise<CollectionMember[]> {
    throw new Error('MembersRepository.listMembers is not implemented yet.');
  }

  async upsertMember(): Promise<CollectionMember> {
    throw new Error('MembersRepository.upsertMember is not implemented yet.');
  }
}
