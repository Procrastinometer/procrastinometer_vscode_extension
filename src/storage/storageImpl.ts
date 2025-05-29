import { Storage } from './interfaces/storage.interface';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import { TimeLogFactory } from '../utils/factories/interfaces/time-log.factory.interface';
import { TimeLog } from '../models/time-log';

export class StorageImpl implements Storage {
  private readonly filePath: string;
  private readonly timeLogFactory: TimeLogFactory;

  constructor(filePath: string, timeLogFactory: TimeLogFactory) {
    this.filePath = path.join(filePath, 'activity-log.json');
    this.timeLogFactory = timeLogFactory;
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
  }

  async saveTimeLog(
    startTime: number,
    duration: number,
    endTime: number
  ): Promise<void> {
    const timeLogItem = this.timeLogFactory.createTimeLog(startTime, duration, endTime);
    await fs.appendFile(
      this.filePath,
      JSON.stringify(timeLogItem) + '\n',
      'utf8'
    );
  }

  async getTimeLogs(): Promise<TimeLog[]> {
    const timeLogsData = await fs.readFile(this.filePath, 'utf8');
    return timeLogsData
      .split('\n')
      .filter((item) => !!item)
      .map((item) => JSON.parse(item));
  }

  async clearFile(): Promise<void> {
    return fs.truncate(this.filePath);
  }
}
