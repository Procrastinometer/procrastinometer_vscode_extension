import { UIManager } from '../ui/interfaces/ui-manager.interface';
import { Storage } from '../storage/interfaces/storage.interface';
import { Logger } from '../logger/interfaces/logger.interface';
import { Tracker } from './interfaces/tracker.interface';

export class TrackerImpl implements Tracker {
  private readonly inactivityLimit: number;
  private totalTime: number = 0;
  private activationStartTime: number = 0;
  private inactivityTimeout: NodeJS.Timeout | null = null; // mb implement own timeout class

  private readonly uiManager: UIManager;
  private readonly storage: Storage;
  private readonly logger: Logger;

  constructor(
    inactivityLimit: number,
    uiManager: UIManager,
    storage: Storage,
    logger: Logger
  ) {
    this.inactivityLimit = inactivityLimit;
    this.uiManager = uiManager;
    this.storage = storage;
    this.logger = logger;
  }

  setTotalTime(totalTime: number): void {
    this.totalTime = totalTime;
  }

  startTracking(): void {
    if (!this.activationStartTime) {
      this.activationStartTime = Date.now();
    }
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = setTimeout(
      this.onTimeout.bind(this),
      this.inactivityLimit
    );
  }

  async stopTracking(): Promise<void> {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = null;
    await this.onTimeout();
  }

  private async onTimeout(): Promise<void> {
    try {
      if (!this.activationStartTime) {
        return;
      }
      const endTime = Date.now();
      const duration = this.calculateDuration(endTime);
      await this.storage.saveTimeLog(
        this.activationStartTime,
        duration,
        endTime
      );
      this.updateTotalTime(duration);
      this.resetActivationStartTime();
      this.uiManager.setTrackingTime(this.totalTime);
    } catch (err) {
      this.logger.logError(err as any);
    }
  }

  private calculateDuration(endTime: number): number {
    return endTime - this.activationStartTime;
  }

  private updateTotalTime(duration: number): void {
    this.totalTime += duration;
  }

  private resetActivationStartTime(): void {
    this.activationStartTime = 0;
  }
}
