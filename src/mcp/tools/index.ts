import { createToolRegistry } from '../router.js';
import { collectionsTools } from './collections.js';
import { entriesTools } from './entries.js';
import { introspectionTools } from './introspection.js';

export const registry = createToolRegistry([
  ...collectionsTools,
  ...entriesTools,
  ...introspectionTools
]);
