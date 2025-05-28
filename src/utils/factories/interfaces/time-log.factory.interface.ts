import { TimeLog } from '../../../models/time-log';

export interface TimeLogFactory {
  createTimeLog(startTime: number, duration: number, endTime: number): TimeLog;
}
