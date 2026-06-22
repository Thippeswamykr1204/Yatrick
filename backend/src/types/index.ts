export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: Record<string, any>;
}