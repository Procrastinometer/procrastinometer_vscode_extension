import { TimeLog } from '../../models/time-log';

export interface ApiClient {
  getTotalTime(): Promise<number>;
  sendLogsToServer(timeLogs: TimeLog[]): Promise<void>;
  validateApiKey(apiKey: string): Promise<boolean>;
  setApiKey(apiKey: string): void;
  getApiKey(): string | null;
}