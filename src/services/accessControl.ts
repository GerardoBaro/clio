export class AccessControlService {
  async assertReaderAccess(): Promise<void> {
    throw new Error('Access control checks are not implemented yet.');
  }

  async assertWriterAccess(): Promise<void> {
    throw new Error('Access control checks are not implemented yet.');
  }
}
