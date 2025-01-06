export interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  version?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}
