import type { SupabaseClient } from '@supabase/supabase-js';
import type { Collection } from '../types/index.js';

interface CollectionRow {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  structure_proxy: Record<string, unknown>;
  visibility: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

function mapCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    structureProxy: row.structure_proxy,
    visibility: row.visibility === 'shared' ? 'shared' : 'private',
    isDeleted: row.is_deleted,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class CollectionsRepository {
  constructor(private readonly client: SupabaseClient<any, 'clio'>) {}

  async insert(
    input: Pick<
      Collection,
      'ownerId' | 'name' | 'description' | 'structureProxy' | 'visibility'
    >
  ): Promise<Collection> {
    const now = new Date().toISOString();

    const payload = {
      owner_id: input.ownerId,
      name: input.name,
      description: input.description ?? null,
      structure_proxy: input.structureProxy,
      visibility: input.visibility,
      is_deleted: false,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await this.client
      .from('collections')
      .insert(payload)
      .select(
        'id, owner_id, name, description, structure_proxy, visibility, is_deleted, created_at, updated_at'
      )
      .single();

    if (error) {
      throw new Error(`Failed to insert collection: ${error.message}`);
    }

    if (!data) {
      throw new Error('Failed to insert collection: no data returned.');
    }

    return mapCollection(data as CollectionRow);
  }

  async listByUser(userId: string): Promise<Collection[]> {
    const db = this.client.schema('clio');

    const selectColumns =
      'id, owner_id, name, description, structure_proxy, visibility, is_deleted, created_at, updated_at';

    const { data: ownedData, error: ownedError } = await db
      .from('collections')
      .select(selectColumns)
      .eq('is_deleted', false)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (ownedError) {
      throw new Error(`Failed to list collections for owner: ${ownedError.message}`);
    }

    const ownedRows = (ownedData ?? []) as CollectionRow[];

    const { data: membershipRows, error: membershipError } = await db
      .from('collection_members')
      .select('collection_id')
      .eq('user_id', userId);

    if (membershipError) {
      throw new Error(`Failed to fetch collection memberships: ${membershipError.message}`);
    }

    const memberCollectionIds = (membershipRows ?? []).map(
      (row: { collection_id: string }) => row.collection_id
    );

    let sharedRows: CollectionRow[] = [];

    if (memberCollectionIds.length > 0) {
      const { data: sharedData, error: sharedError } = await db
        .from('collections')
        .select(selectColumns)
        .eq('is_deleted', false)
        .in('id', memberCollectionIds)
        .order('created_at', { ascending: false });

      if (sharedError) {
        throw new Error(`Failed to list shared collections: ${sharedError.message}`);
      }

      sharedRows = (sharedData ?? []) as CollectionRow[];
    }

    const uniqueCollections = new Map<string, Collection>();
    for (const row of [...ownedRows, ...sharedRows]) {
      uniqueCollections.set(row.id, mapCollection(row));
    }

    return Array.from(uniqueCollections.values());
  }
}
