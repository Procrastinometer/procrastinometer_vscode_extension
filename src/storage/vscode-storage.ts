import { Storage } from './interfaces/storage.interface';
import { TimeLog } from './timeLog';
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  BLANK_FILE_NAME,
  BLANK_PROGRAMMING_LANGUAGE,
  BLANK_PROJECT_NAME,
} from '../constance/constance';

export class VSCodeStorage implements Storage {
  private readonly vscode: typeof vscode;
  private readonly filePath: string;

  constructor(vscodeWindowAPI: typeof vscode, filePath: string) {
    this.vscode = vscodeWindowAPI;
    this.filePath = path.join(filePath, 'activity-log.json');
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
  }

  async saveTimeLog(
    startTime: number,
    duration: number,
    endTime: number
  ): Promise<void> {
    const timeLogItem = TimeLog.create({
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      codeEditor: this.vscode.env.appName,
      osName: os.type(),
      projectName: this.vscode.workspace.name || BLANK_PROJECT_NAME,
      fileName:
        this.vscode.window.activeTextEditor?.document.uri.fsPath ||
        BLANK_FILE_NAME,
      programmingLanguage:
        this.vscode.window.activeTextEditor?.document.languageId ||
        BLANK_PROGRAMMING_LANGUAGE,
    });
    await fs.appendFile(
      this.filePath,
      JSON.stringify(timeLogItem) + '\n',
      'utf8'
    );
  }

  async getTimeLogs(): Promise<TimeLog[]> {
    const timeLogsData = await fs.readFile(this.filePath, 'utf8');
    return timeLogsData.split('\n').map((item) => JSON.parse(item));
  }

  async clearFile(): Promise<void> {
    await fs.truncate(this.filePath);
  }
}
