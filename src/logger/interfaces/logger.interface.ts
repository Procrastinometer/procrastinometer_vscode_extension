export interface Logger {
  logError(message: string): Promise<void>;
  logInfo(message: string): Promise<void>;
}
