export interface UIManager {
  setStatusBarMessage(message: string): void;
  setTrackingTime(time: number): void;
  setPauseBarMessage(): void;
  setStartBarMessage(): void;
  promptApiKey(): Thenable<string | undefined>;
  showMessage(message: string): void;
}