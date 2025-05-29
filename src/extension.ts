import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
import * as vscode from 'vscode';
import { VSCodeUiManager } from './ui/vscode-ui-manager';
import { Tracker } from './tracker/tracker';
import { DATA_SYNCHRONISATION_INTERVAL, INACTIVITY_LIMIT_MS } from './config/config';
import { StorageImpl } from './storage/storageImpl';
import { VSCodeTimeLogFactory } from './utils/factories/vscode-time-log.factory';
import { TEST_COMMAND } from './constance/command-constance';
import { ActivitySynchronizer } from './synchronizer/activitySynchronizer';

let tracker: Tracker;
let activitySynchronizer: ActivitySynchronizer;

export async function activate(context: vscode.ExtensionContext) {
  const uiManager = new VSCodeUiManager(vscode.window);
  const timeLogFactory = new VSCodeTimeLogFactory(vscode);
  const storage = new StorageImpl(
    context.globalStorageUri.fsPath,
    timeLogFactory
  );
  await storage.init();
  tracker = new Tracker(INACTIVITY_LIMIT_MS, uiManager, storage);
  activitySynchronizer = new ActivitySynchronizer('abc123', storage);
  activitySynchronizer.init(DATA_SYNCHRONISATION_INTERVAL);

  subscribeOnAllActivityEvents(context, tracker);

  context.subscriptions.push(
    vscode.commands.registerCommand(TEST_COMMAND, () => {
      vscode.window.showInformationMessage(`Extension is alive!`);
    })
  );
}

export async function deactivate() {
  await tracker.stopTracking();
  activitySynchronizer.stop();
  await activitySynchronizer.syncActivity();
}

const subscribeOnAllActivityEvents = (context: vscode.ExtensionContext, tracker: Tracker) => {
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
};
