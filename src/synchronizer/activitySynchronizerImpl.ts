import { Storage } from '../storage/interfaces/storage.interface';
import { clearInterval } from 'node:timers';
import { ApiClient } from '../apiClient/interfaces/api-client.interface';
import { ActivitySynchronizer } from './interfaces/activity-synchronizer.interface';
import { Logger } from '../logger/interfaces/logger.interface';

export class ActivitySynchronizerImpl implements ActivitySynchronizer {
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly storage: Storage;
  private readonly apiClient: ApiClient;
  private readonly logger: Logger;

  constructor(storage: Storage, apiClient: ApiClient, logger: Logger) {
    this.storage = storage;
    this.apiClient = apiClient;
    this.logger = logger;
  }

  init(syncInterval: number, callback: Function): void {
    this.syncInterval = setInterval(async () => {
      await this.syncActivity();
      if (callback) {
        callback();
      }
    }, syncInterval);
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
      await this.storage.clearLogs();
    } catch (err) {
      this.logger.logError(err as any);
    }
  }
}
