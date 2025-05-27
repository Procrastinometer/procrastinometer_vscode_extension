import { UIManager } from './interfaces/ui-manager.interface';
import * as vscode from 'vscode';

export class VSCodeUiManager implements UIManager {
  private readonly window: typeof vscode.window;

  constructor(vscodeWindowAPI: typeof vscode.window) {
    this.window = vscodeWindowAPI;
  }

  setStatusBarMessage(message: string): void {
    this.window.setStatusBarMessage(message);
  }

  setTrackingTime(time: number): void {
    this.setStatusBarMessage(`⏱ Active time: ${this.formatTime(time)}`);
  }

  private formatTime(ms: number): string {
    const millisecondsInSecond = 1000;
    const secondsInMinute = 60;
    const totalSec = Math.floor(ms / millisecondsInSecond);
    const min = Math.floor(totalSec / secondsInMinute);
    const sec = totalSec % secondsInMinute;
    return `${min} m ${sec} s`;
  }
}
