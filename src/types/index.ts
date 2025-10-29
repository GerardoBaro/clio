export type Visibility = 'private' | 'shared';

export interface Collection {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  structureProxy: Record<string, unknown>;
  visibility: Visibility;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionMember {
  collectionId: string;
  userId: string;
  role: 'owner' | 'writer' | 'reader';
  addedAt: string;
}

export interface Entry {
  id: string;
  collectionId: string;
  entryData: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
