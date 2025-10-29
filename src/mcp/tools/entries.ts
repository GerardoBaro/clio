import type { ToolHandler } from '../router.js';

export const entriesTools: ToolHandler[] = [
  {
    name: 'entries.insert',
    description: 'Insert a new entry into a collection.',
    async invoke() {
      throw new Error('entries.insert is not implemented yet.');
    }
  },
  {
    name: 'entries.query',
    description: 'Query entries from a collection.',
    async invoke() {
      throw new Error('entries.query is not implemented yet.');
    }
  }
];
