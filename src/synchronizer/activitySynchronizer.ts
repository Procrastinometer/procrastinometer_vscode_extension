import { Storage } from '../storage/interfaces/storage.interface';
import { clearInterval } from 'node:timers';
import { ApiClient } from '../apiClient/interfaces/api-client.interface';

export class ActivitySynchronizer {
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly storage: Storage;
  private readonly apiClient: ApiClient;

  constructor(storage: Storage, apiClient: ApiClient) {
    this.storage = storage;
    this.apiClient = apiClient;
  }

  init(syncInterval: number) {
    this.syncInterval = setInterval(this.syncActivity.bind(this), syncInterval);
  }

  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.syncInterval = null;
  }

  async syncActivity(): Promise<void> {
    try {
      const timeLogs = await this.storage.getTimeLogs();
      if (timeLogs.length === 0) {
        return;
      }
      await this.apiClient.sendLogsToServer(timeLogs);
      await this.storage.clearFile();
    } catch (err) {
      console.log(err);
      // TODO add logger
    }
  }
}
