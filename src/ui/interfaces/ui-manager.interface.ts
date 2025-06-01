export interface UIManager {
  setStatusBarMessage(message: string): void;
  setTrackingTime(time: number): void;
  promptApiKey(): Thenable<string | undefined>;
  showMessage(message: string): void;
}