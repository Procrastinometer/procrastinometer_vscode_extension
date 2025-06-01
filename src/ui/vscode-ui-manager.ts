import { UIManager } from './interfaces/ui-manager.interface';
import * as vscode from 'vscode';
import { API_KEY_LENGTH_ERROR } from '../constance/error-constance';

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

  promptApiKey(): Thenable<string | undefined> {
    return this.window.showInputBox({
      prompt: 'Your API key',
      placeHolder: 'Enter API key',
      validateInput: (value: string) =>
        value.length !== 36 ? API_KEY_LENGTH_ERROR : null,
    });
  }

  showMessage(message: string): void {
    this.window.showInformationMessage(message);
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
