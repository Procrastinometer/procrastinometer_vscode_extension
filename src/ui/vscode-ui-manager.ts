import { UIManager } from './interfaces/ui-manager.interface';
import * as vscode from 'vscode';
import { API_KEY_LENGTH_ERROR } from '../constance/error-constance';
import { OPEN_DASHBOARD } from '../constance/command-constance';
import { STATUS_BAR_INFO } from '../constance/info.constance';

export class VSCodeUiManager implements UIManager {
  private readonly vscode: typeof vscode;
  private readonly statusBarItem: vscode.StatusBarItem;

  constructor(vscodeAPI: typeof vscode) {
    this.vscode = vscodeAPI;
    this.statusBarItem = this.vscode.window.createStatusBarItem();
    this.setupStatusBarItem();
  }

  setStatusBarMessage(message: string): void {
    this.statusBarItem.text = message;
  }

  setTrackingTime(time: number): void {
    this.setStatusBarMessage(`⏱ Active time: ${this.formatTime(time)}`);
  }

  setPauseBarMessage(): void {
    this.setStatusBarMessage('⏱ Extension is paused');
  }

  setStartBarMessage(): void {
    this.setStatusBarMessage('⏱ Extension is ready');
  }

  promptApiKey(): Thenable<string | undefined> {
    return this.vscode.window.showInputBox({
      prompt: 'Your API key',
      placeHolder: 'Enter API key',
      validateInput: (value: string) =>
        value.length !== 36 ? API_KEY_LENGTH_ERROR : null,
    });
  }

  showMessage(message: string): void {
    this.vscode.window.showInformationMessage(message);
  }

  openUrl(url: string): void {
    this.vscode.env.openExternal(vscode.Uri.parse(url));
  }

  private setupStatusBarItem(): void {
    this.statusBarItem.command = OPEN_DASHBOARD;
    this.statusBarItem.tooltip = STATUS_BAR_INFO;
    this.statusBarItem.show();
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
