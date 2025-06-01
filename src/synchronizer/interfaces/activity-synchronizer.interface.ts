export interface ActivitySynchronizer {
  init(syncInterval: number): void;
  stop(): void;
  syncActivity(): Promise<void>;
}