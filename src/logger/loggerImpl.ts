import { Logger } from './interfaces/logger.interface';

export class LoggerImpl implements Logger {
  async logError(message: string): Promise<void> {
    console.error(message);
  }

  async logInfo(message: string): Promise<void> {
    console.log(message);
  }
}
