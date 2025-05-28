import { TimeLog } from '../../models/time-log';
import { TimeLogFactory } from './interfaces/time-log.factory.interface';
import * as vscode from 'vscode';
import * as os from 'node:os';
import {
  BLANK_FILE_NAME,
  BLANK_PROGRAMMING_LANGUAGE,
  BLANK_PROJECT_NAME,
} from '../../constance/constance';

export class VSCodeTimeLogFactory implements TimeLogFactory {
  private readonly vscode: typeof vscode;

  constructor(vscodeAPI: typeof vscode) {
    this.vscode = vscodeAPI;
  }

  createTimeLog(startTime: number, duration: number, endTime: number): TimeLog {
    this.validate(startTime, endTime);
    return new TimeLog(
      this.normalizeDate(startTime),
      duration,
      this.normalizeDate(endTime),
      this.vscode.window.activeTextEditor?.document.uri.fsPath ||
        BLANK_FILE_NAME,
      this.vscode.env.appName,
      os.type(),
      this.vscode.workspace.name || BLANK_PROJECT_NAME,
      this.vscode.window.activeTextEditor?.document.languageId ||
        BLANK_PROGRAMMING_LANGUAGE
    );
  }

  private validate(startTime: number, endTime: number): void {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format in startTime or endTime.');
    }
    if (start > end) {
      throw new Error('startTime cannot be later than endTime.');
    }
  }

  private normalizeDate(dateNumber: number): string {
    return new Date(dateNumber).toISOString();
  }
}
