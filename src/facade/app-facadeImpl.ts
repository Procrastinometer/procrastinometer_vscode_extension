import { Tracker } from '../tracker/tracker';
import { Storage } from '../storage/interfaces/storage.interface';
import { UIManager } from '../ui/interfaces/ui-manager.interface';
import { ApiClient } from '../apiClient/interfaces/api-client.interface';
import * as vscode from 'vscode';
import { VSCodeUiManager } from '../ui/vscode-ui-manager';
import { VSCodeTimeLogFactory } from '../utils/factories/vscode-time-log.factory';
import { ApiClientImpl } from '../apiClient/api-clientImpl';
import { StorageImpl } from '../storage/storageImpl';
import {
  DATA_SYNCHRONISATION_INTERVAL,
  FRONT_BASE_URL,
  INACTIVITY_LIMIT_MS,
} from '../config/config';
import { AppFacade } from './interfaces/app-facade.interfaces';
import { ALREADY_STARTED, INTERNAL_ERROR, INVALID_API_KEY, NO_API_KEY_PROVIDED } from '../constance/error-constance';
import { ActivitySynchronizer } from '../synchronizer/interfaces/activity-synchronizer.interface';
import { ActivitySynchronizerImpl } from '../synchronizer/activitySynchronizerImpl';
import { API_KEY_ADDED } from '../constance/success-constance';
import { join } from 'node:path';
import { SETTINGS_FIE_NAME } from '../constance/file-names-constance';

export class AppFacadeImpl implements AppFacade {
  private readonly tracker: Tracker;
  private readonly storage: Storage;
  private readonly uiManager: UIManager;
  private readonly apiClient: ApiClient;
  private readonly activitySynchronizer: ActivitySynchronizer;
  private readonly vscode: typeof vscode;
  private readonly vscodeContext: vscode.ExtensionContext;

  private isInitialized: boolean = false;
  private disposables: vscode.Disposable[] = [];

  constructor(vscodeAPI: typeof vscode, context: vscode.ExtensionContext) {
    const timeLogFactory = new VSCodeTimeLogFactory(vscode);

    this.uiManager = new VSCodeUiManager(vscode);
    this.apiClient = new ApiClientImpl();
    this.storage = new StorageImpl(context.globalStorageUri.fsPath, timeLogFactory);
    this.tracker = new Tracker(INACTIVITY_LIMIT_MS, this.uiManager, this.storage);
    this.activitySynchronizer = new ActivitySynchronizerImpl(this.storage, this.apiClient);
    this.vscode = vscodeAPI;
    this.vscodeContext = context;
  }

  async activate(): Promise<void> {
    try {
      const apiKey = await this.storage.getApiKey();
      if (!await this.checkApiKey(apiKey)) {
        this.uiManager.showMessage(NO_API_KEY_PROVIDED);
        return;
      }
      this.apiClient.setApiKey(apiKey!);
      await this.setupAndStartTracking();
    } catch (err) {
      this.uiManager.showMessage(INTERNAL_ERROR);
      // TODO logger
    }
  }

  async deactivate(): Promise<void> {
    try {
      this.stopTracking();
      await this.tracker.stopTracking();
      this.activitySynchronizer.stop();
      await this.activitySynchronizer.syncActivity();
      this.isInitialized = false;
    } catch (err) {
      this.uiManager.showMessage(INTERNAL_ERROR);
      // TODO logger
    }
  }

  startTracking(): void {
    try {
      if (!this.isInitialized) {
        this.uiManager.showMessage(NO_API_KEY_PROVIDED);
        return;
      }
      if (this.disposables.length !== 0) {
        this.uiManager.showMessage(ALREADY_STARTED);
        return;
      }
      this.subscribeOnChangeEvents();
      this.uiManager.setStartBarMessage();
    } catch (err) {
      this.uiManager.showMessage(INTERNAL_ERROR);
      // TODO logger
    }
  }

  stopTracking(): void {
    try {
      if (!this.isInitialized) {
        this.uiManager.showMessage(NO_API_KEY_PROVIDED);
        return;
      }
      for (const disposable of this.disposables) {
        disposable.dispose();
      }
      this.disposables = [];
      this.uiManager.setPauseBarMessage();
    } catch (err) {
      this.uiManager.showMessage(INTERNAL_ERROR);
      // TODO logger
    }

  }

  async handleSetApiKey(): Promise<void> {
    try {
      const apiKey = await this.uiManager.promptApiKey();
      if (!await this.checkApiKey(apiKey)) {
        this.uiManager.showMessage(INVALID_API_KEY);
        return;
      }
      this.apiClient.setApiKey(apiKey!);
      await this.storage.saveApiKey(apiKey!);
      this.uiManager.showMessage(API_KEY_ADDED);

      await this.setupAndStartTracking();
    } catch (err) {
      this.uiManager.showMessage(INTERNAL_ERROR);
      // TODO logger
    }
  }

  openDashboard(): void {
    this.uiManager.openUrl(`${FRONT_BASE_URL}/dashboard`); // TODO <- change this url
  }

  async openSettings(): Promise<void> {
    await this.uiManager.openFile(join(this.vscodeContext.globalStorageUri.fsPath, SETTINGS_FIE_NAME));
  }

  private subscribeOnChangeEvents(): void {
    this.disposables = [
      this.vscode.workspace.onDidChangeTextDocument(this.tracker.startTracking, this.tracker),
      this.vscode.window.onDidChangeTextEditorSelection(this.tracker.startTracking, this.tracker),
      this.vscode.window.onDidChangeActiveTextEditor(this.tracker.startTracking, this.tracker),
      this.vscode.workspace.onDidSaveTextDocument(this.tracker.startTracking, this.tracker),
      this.vscode.tasks.onDidStartTask(this.tracker.startTracking, this.tracker),
      this.vscode.tasks.onDidEndTask(this.tracker.startTracking, this.tracker),
      this.vscode.debug.onDidChangeActiveDebugSession(this.tracker.startTracking, this.tracker),
      this.vscode.debug.onDidChangeBreakpoints(this.tracker.startTracking, this.tracker),
      this.vscode.debug.onDidStartDebugSession(this.tracker.startTracking, this.tracker),
      this.vscode.debug.onDidTerminateDebugSession(this.tracker.startTracking, this.tracker)
    ];
    this.vscodeContext.subscriptions.push(...this.disposables);
  }

  private async setupAndStartTracking(): Promise<void> {
    await this.setupComponents();
    this.startTracking();
  }

  private async checkApiKey(apiKey: string | null | undefined): Promise<boolean> {
    return apiKey !== null && apiKey !== undefined && await this.apiClient.validateApiKey(apiKey)
  }

  private async setupComponents(): Promise<void> {
    await this.storage.init();
    this.activitySynchronizer.init(DATA_SYNCHRONISATION_INTERVAL);
    this.isInitialized = true;
  }
}
