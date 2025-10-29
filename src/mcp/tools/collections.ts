import type { ToolHandler } from '../router.js';

export const collectionsTools: ToolHandler[] = [
  {
    name: 'collections.list',
    description: 'List collections accessible to the current user.',
    async invoke() {
      throw new Error('collections.list is not implemented yet.');
    }
  },
  {
    name: 'collections.create',
    description: 'Create a new collection.',
    async invoke() {
      throw new Error('collections.create is not implemented yet.');
    }
  }
];
