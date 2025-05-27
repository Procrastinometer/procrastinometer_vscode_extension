import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
import * as vscode from 'vscode';
import { VSCodeUiManager } from './ui/vscode-ui-manager';
import { Tracker } from './tracker/tracker';
import { INACTIVITY_LIMIT_MS } from './config/config';
import { VSCodeStorage } from './storage/vscode-storage';

export async function activate(context: vscode.ExtensionContext) {
  const uiManager = new VSCodeUiManager(vscode.window);
  const storage = new VSCodeStorage(vscode, context.globalStorageUri.fsPath);
  await storage.init();
  const tracker = new Tracker(INACTIVITY_LIMIT_MS, uiManager, storage);

  console.log('Started');

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(tracker.startTracking, tracker),
    vscode.window.onDidChangeTextEditorSelection(tracker.startTracking, tracker),
    vscode.window.onDidChangeActiveTextEditor(tracker.startTracking, tracker),
    vscode.workspace.onDidSaveTextDocument(tracker.startTracking, tracker),
    vscode.tasks.onDidStartTask(tracker.startTracking, tracker),
    vscode.tasks.onDidEndTask(tracker.startTracking, tracker),
    vscode.debug.onDidChangeActiveDebugSession(tracker.startTracking, tracker),
    vscode.debug.onDidChangeBreakpoints(tracker.startTracking, tracker),
    vscode.debug.onDidStartDebugSession(tracker.startTracking, tracker),
    vscode.debug.onDidTerminateDebugSession(tracker.startTracking, tracker)
  );

  const disposable = vscode.commands.registerCommand(
    'procrastinometer.startTracking',
    () => {
      vscode.window.showInformationMessage(`Extension is started!`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // TODO add stop tracking and sync with server
}
