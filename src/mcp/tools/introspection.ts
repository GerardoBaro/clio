import type { ToolHandler } from '../router.js';

export const introspectionTools: ToolHandler[] = [
  {
    name: 'introspection.structure',
    description: 'Return the structure_proxy for a given collection.',
    async invoke() {
      throw new Error('introspection.structure is not implemented yet.');
    }
  }
];
