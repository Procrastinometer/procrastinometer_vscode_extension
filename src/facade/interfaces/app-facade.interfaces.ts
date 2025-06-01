export interface AppFacade {
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  startTracking(): void;
  stopTracking(): void;
  handleSetApiKey(): Promise<void>;
  openDashboard(): void;
  openSettings(): Promise<void>;
}
