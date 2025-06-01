import { Storage } from './interfaces/storage.interface';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import { TimeLogFactory } from '../utils/factories/interfaces/time-log.factory.interface';
import { TimeLog } from '../models/time-log';
import {
  SETTINGS_FIE_NAME,
  TIME_LOG_FIE_NAME,
} from '../constance/file-names-constance';

export class StorageImpl implements Storage {
  private readonly logsFilePath: string;
  private readonly settingsFilePath: string;
  private readonly timeLogFactory: TimeLogFactory;

  constructor(dirPath: string, timeLogFactory: TimeLogFactory) {
    this.logsFilePath = path.join(dirPath, TIME_LOG_FIE_NAME);
    this.settingsFilePath = path.join(dirPath, SETTINGS_FIE_NAME);
    this.timeLogFactory = timeLogFactory;
  }

  async init() {
    await fs.mkdir(path.dirname(this.logsFilePath), { recursive: true });
  }

  async saveTimeLog(
    startTime: number,
    duration: number,
    endTime: number
  ): Promise<void> {
    const timeLogItem = this.timeLogFactory.createTimeLog(startTime, duration, endTime);
    await fs.appendFile(
      this.logsFilePath,
      JSON.stringify(timeLogItem) + '\n',
      'utf8'
    );
  }

  async saveApiKey(apiKey: string): Promise<void> {
    let settings: Record<string, string> = {};
    if (await this.fileExists(this.settingsFilePath)) {
      const settingsRaw = await fs.readFile(this.settingsFilePath, 'utf8');
      settings = JSON.parse(settingsRaw);
    }
    settings['apiKey'] = apiKey;
    return fs.writeFile(this.settingsFilePath, JSON.stringify(settings), 'utf8');
  }

  async getTimeLogs(): Promise<TimeLog[]> {
    const timeLogsData = await fs.readFile(this.logsFilePath, 'utf8');
    return timeLogsData
      .split('\n')
      .filter((item) => !!item)
      .map((item) => JSON.parse(item));
  }

  async getApiKey(): Promise<string | null> {
    if (!await this.fileExists(this.settingsFilePath)) {
      return null;
    }
    const settingsRaw = await fs.readFile(this.settingsFilePath, 'utf8');
    const settings = JSON.parse(settingsRaw);
    return settings['apiKey'] || null;
  }

  async clearLogs(): Promise<void> {
    return fs.truncate(this.logsFilePath);
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
