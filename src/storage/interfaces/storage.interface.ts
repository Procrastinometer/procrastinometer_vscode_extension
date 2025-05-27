import { TimeLog } from '../timeLog';

export interface Storage {
  saveTimeLog(startTime: number, duration: number, endTime: number): void;
  getTimeLogs(): Promise<TimeLog[]>;
  clearFile(): Promise<void>;
}