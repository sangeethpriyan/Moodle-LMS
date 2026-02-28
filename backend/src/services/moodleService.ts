import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config';
import { logger } from '../logger';

export interface MoodleResponse<T = any> {
  data?: T;
  exception?: string;
  errorcode?: string;
  message?: string;
  warnings?: Array<{
    item?: string;
    itemid?: number;
    warningcode: string;
    message: string;
  }>;
}

export class MoodleService {
  private client: AxiosInstance;
  private wsToken: string;
  private baseUrl: string;

  constructor() {
    this.wsToken = config.moodle.wsToken;
    this.baseUrl = config.moodle.baseUrl;

    this.client = axios.create({
      baseURL: `${this.baseUrl}/webservice/rest/server.php`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Moodle API Request: ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Moodle API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => this.handleError(error)
    );
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    const data = response.data;

    // Check for Moodle errors
    if (data.exception || data.errorcode) {
      throw new Error(data.message || 'Moodle API error');
    }

    // Log warnings if present
    if (data.warnings && data.warnings.length > 0) {
      data.warnings.forEach((warning: any) => {
        logger.warn(`Moodle Warning: ${warning.message}`);
      });
    }

    return response;
  }

  private handleError(error: any): Promise<never> {
    if (error.response) {
      logger.error('Moodle API Error Response:', {
        status: error.response.status,
        data: error.response.data,
      });
      throw new Error(error.response.data.message || 'Moodle API request failed');
    } else if (error.request) {
      logger.error('Moodle API No Response:', error.request);
      throw new Error('No response from Moodle server');
    } else {
      logger.error('Moodle API Error:', error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Generic method to call Moodle web service functions
   */
  public async callFunction<T = any>(
    wsfunction: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const response = await this.client.post('', null, {
        params: {
          wstoken: this.wsToken,
          wsfunction,
          moodlewsrestformat: config.moodle.restFormat,
          ...params,
        },
      });

      return response.data;
    } catch (error: any) {
      logger.error(`Failed to call Moodle function ${wsfunction}:`, error);
      throw error;
    }
  }

  /**
   * Get Moodle site info
   */
  public async getSiteInfo(): Promise<any> {
    return this.callFunction('core_webservice_get_site_info');
  }

  /**
   * Test connection to Moodle
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.getSiteInfo();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const moodleService = new MoodleService();
