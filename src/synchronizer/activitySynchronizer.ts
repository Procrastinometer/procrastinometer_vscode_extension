import { Storage } from '../storage/interfaces/storage.interface';
import { BACK_BASE_URL } from '../config/config';
import { TimeLog } from '../models/time-log';
import { clearInterval } from 'node:timers';

export class ActivitySynchronizer {
  private apiKey: string;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly storage: Storage;

  constructor(apiKey: string, storage: Storage) {
    this.apiKey = apiKey;
    this.storage = storage;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
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
      const response = await this.sendLogsToServer(timeLogs);
      if (!response.ok) {
        const data = await response.json();
        // TODO add logger
        return;
      }
      await this.storage.clearFile();
    } catch (err) {
      // TODO add logger
    }
  }

  private async sendLogsToServer(timeLogs: TimeLog[]): Promise<Response> {
    return fetch(`${BACK_BASE_URL}/saveLogs`, { // TODO change /saveLogs -> to real back url
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey,
      },
      body: JSON.stringify(timeLogs),
    });
  }
}