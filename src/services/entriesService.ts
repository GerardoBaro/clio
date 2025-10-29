import type { Entry } from '../types/index.js';

export class EntriesService {
  async insertEntry(): Promise<Entry> {
    throw new Error('EntriesService.insertEntry is not implemented yet.');
  }

  async queryEntries(): Promise<Entry[]> {
    throw new Error('EntriesService.queryEntries is not implemented yet.');
  }
}
