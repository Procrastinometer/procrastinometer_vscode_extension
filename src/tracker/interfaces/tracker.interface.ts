export interface Tracker {
  setTotalTime(totalTime: number): void;
  startTracking(): void;
  stopTracking(): Promise<void>;
}
