import { TimeLog } from '../models/time-log';
import { ApiClient } from './interfaces/api-client.interface';
import { BACK_BASE_URL } from '../config/config';
import { FAILED_GET_TOTAL_TIME, FAILED_SEND_LOGS, NO_API_KEY_PROVIDED } from '../constance/error-constance';
import { TotalTimeDto } from './dto/total-time.dto';

export class ApiClientImpl implements ApiClient {
  private apiKey: string | null = null;

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async getTotalTime(): Promise<number> {
    const url = `${BACK_BASE_URL}/user/total-time`; // TODO change to <- real url
    const method = 'GET';
    const response = await this.doRequest(url, method, true);
    if (!response.ok) {
      throw new Error(FAILED_GET_TOTAL_TIME);
    }
    const data = await response.json() as unknown as TotalTimeDto;
    return data.totalTime;
  }

  async sendLogsToServer(timeLogs: TimeLog[]): Promise<void> {
    const url = `${BACK_BASE_URL}/time-log/save-logs`;
    const method = 'POST';
    const response = await this.doRequest(url, method, true, timeLogs);
    if (!response.ok) {
      throw new Error(FAILED_SEND_LOGS);
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    const url = `${BACK_BASE_URL}/user/check-api-key/${apiKey}`;
    const method = 'GET';
    const response = await this.doRequest(url, method, false);
    return response.ok;
  }

  private doRequest(
    url: string,
    method: string,
    isApiKeyRequired: boolean,
    body?: Record<string, any>
  ): Promise<Response> {
    if (this.apiKey === null && isApiKeyRequired) {
      throw new Error(NO_API_KEY_PROVIDED);
    }
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': this.apiKey!,
      },
      body: body ? JSON.stringify(body) : null,
    });
  }
}