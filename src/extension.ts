import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import * as vscode from 'vscode';
import {
  OPEN_DASHBOARD,
  SET_API_KEY,
  START_TRACKING,
  STOP_TRACKING,
} from './constance/command-constance';
import { AppFacade } from './facade/interfaces/app-facade.interfaces';
import { AppFacadeImpl } from './facade/app-facadeImpl';

let facade: AppFacade;

export async function activate(context: vscode.ExtensionContext) {
  facade = new AppFacadeImpl(vscode, context);
  await facade.activate();

  context.subscriptions.push(
    vscode.commands.registerCommand(SET_API_KEY, () => {
      facade.handleSetApiKey();
    }),
    vscode.commands.registerCommand(START_TRACKING, () => {
      facade.startTracking();
    }),
    vscode.commands.registerCommand(STOP_TRACKING, () => {
      facade.stopTracking();
    }),
    vscode.commands.registerCommand(OPEN_DASHBOARD, () => {
      facade.openDashboard();
    }),
  );
}

export async function deactivate() {
  await facade.deactivate();
}
