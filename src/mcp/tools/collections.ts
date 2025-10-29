import { loadEnv } from '../../config/env.js';
import type { ToolHandler } from '../router.js';
import { CollectionsService } from '../../services/collectionsService.js';
import type { Collection } from '../../types/index.js';
import { z } from 'zod';

loadEnv();

interface ListCollectionsInput {
  userId: string;
}

interface ListCollectionsResult {
  collections: Collection[];
}

interface CreateCollectionInput {
  ownerId: string;
  name: string;
  description?: string | null;
  structureProxy?: Record<string, unknown>;
  visibility?: Collection['visibility'];
}

interface CreateCollectionResult {
  collection: Collection;
}

const collectionsService = new CollectionsService();

export const collectionsTools: ToolHandler[] = [
  {
    name: 'collections.list',
    description: 'List collections accessible to the current user.',
    schema: z.object({
      userId: z.string().min(1, 'userId must be a non-empty string.')
    }),
    async invoke(input: ListCollectionsInput): Promise<ListCollectionsResult> {
      if (!input || typeof input.userId !== 'string' || input.userId.trim().length === 0) {
        throw new Error('collections.list requires a non-empty userId string.');
      }

      const collections = await collectionsService.listCollections(input.userId.trim());

      return { collections };
    }
  },
  {
    name: 'collections.create',
    description: 'Create a new collection.',
    schema: z.object({
      ownerId: z.string().min(1, 'ownerId must be a non-empty string.'),
      name: z.string().min(1, 'name must be a non-empty string.'),
      description: z.string().optional().nullable(),
      structureProxy: z.record(z.unknown()).optional(),
      visibility: z.enum(['private', 'shared']).optional()
    }),
    async invoke(input: CreateCollectionInput): Promise<CreateCollectionResult> {
      if (!input || typeof input !== 'object') {
        throw new Error('collections.create requires an input object.');
      }

      const { ownerId, name, description, structureProxy, visibility } = input;

      if (typeof ownerId !== 'string' || ownerId.trim().length === 0) {
        throw new Error('collections.create requires a non-empty ownerId string.');
      }

      if (typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('collections.create requires a non-empty name string.');
      }

      if (visibility && visibility !== 'private' && visibility !== 'shared') {
        throw new Error('collections.create visibility must be "private" or "shared" when provided.');
      }

      const collection = await collectionsService.createCollection({
        ownerId: ownerId.trim(),
        name,
        description: description ?? null,
        structureProxy,
        visibility
      });

      return { collection };
    }
  }
];
