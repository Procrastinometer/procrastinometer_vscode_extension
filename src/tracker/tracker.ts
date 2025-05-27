import { UIManager } from '../ui/interfaces/ui-manager.interface';

export class Tracker {
  private readonly inactivityLimit: number;
  private totalTime: number = 0;
  private activationStartTime: number = 0;
  private inactivityTimeout: NodeJS.Timeout | null = null; // mb implement own timeout class
  private uiManager: UIManager;

  constructor(inactivityLimit: number, uiManager: UIManager) {
    this.inactivityLimit = inactivityLimit;
    this.uiManager = uiManager;
  }

  startTracking(): void {
    if (!this.activationStartTime) {
      this.activationStartTime = Date.now();
    }
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
    this.inactivityTimeout = setTimeout(
      this.onInterval.bind(this),
      this.inactivityLimit
    );
  }

  private onInterval(): void {
    this.countTotalTime();
    this.resetActivationStartTime();
    this.uiManager.setTrackingTime(this.totalTime);
  }

  private countTotalTime(): void {
    const duration = Date.now() - this.activationStartTime;
    this.totalTime += duration;
  }

  private resetActivationStartTime(): void {
    this.activationStartTime = 0;
  }
}
