import { TimeLog } from '../../models/time-log';

export interface Storage {
  saveTimeLog(startTime: number, duration: number, endTime: number): void;
  getTimeLogs(): Promise<TimeLog[]>;
  clearFile(): Promise<void>;
}