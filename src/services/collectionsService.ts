import { getSupabaseClient } from '../config/supabaseClient.js';
import { CollectionsRepository } from '../repositories/collectionsRepository.js';
import type { Collection, Visibility } from '../types/index.js';

export class CollectionsService {
  constructor(
    private readonly collectionsRepository = new CollectionsRepository(getSupabaseClient())
  ) {}

  async listCollections(userId: string): Promise<Collection[]> {
    if (!userId) {
      throw new Error('A userId is required to list collections.');
    }

    return this.collectionsRepository.listByUser(userId);
  }

  async createCollection(input: {
    ownerId: string;
    name: string;
    description?: string | null;
    structureProxy?: Record<string, unknown>;
    visibility?: Visibility;
  }): Promise<Collection> {
    const { ownerId, name } = input;

    if (!ownerId || typeof ownerId !== 'string') {
      throw new Error('ownerId is required to create a collection.');
    }

    if (!name || typeof name !== 'string') {
      throw new Error('name is required to create a collection.');
    }

    const structureProxy = input.structureProxy ?? {};
    const visibility: Visibility = input.visibility ?? 'private';

    if (visibility !== 'private' && visibility !== 'shared') {
      throw new Error('visibility must be either "private" or "shared".');
    }

    return this.collectionsRepository.insert({
      ownerId,
      name: name.trim(),
      description: input.description ?? null,
      structureProxy,
      visibility
    });
  }
}
