import { TimeLog } from '../../models/time-log';

export interface Storage {
  saveTimeLog(startTime: number, duration: number, endTime: number): Promise<void>;
  saveApiKey(apiKey: string): Promise<void>;
  getTimeLogs(): Promise<TimeLog[]>;
  getApiKey(): Promise<string | null>;
  clearLogs(): Promise<void>;
  init(): Promise<void>;
}