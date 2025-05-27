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
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min} m ${sec} s`;
  }
}
