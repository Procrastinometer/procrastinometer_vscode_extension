export interface ActivitySynchronizer {
  init(syncInterval: number, callback: Function): void;
  stop(): void;
  syncActivity(): Promise<void>;
}