// API Error Handling Utility

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  retryable?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export class ApiErrorHandler {
  private static retryDelays = [1000, 2000, 4000]; // Retry delays in milliseconds
  private static maxRetries = 3;

  // Standardize error responses
  static createErrorResponse(error: any, status?: number): ApiResponse {
    let apiError: ApiError = {
      message: 'An unexpected error occurred',
      retryable: false
    };

    if (error instanceof Error) {
      apiError.message = error.message;
      apiError.details = error.stack;
    } else if (typeof error === 'string') {
      apiError.message = error;
    } else if (error && typeof error === 'object') {
      apiError = {
        message: error.message || 'An error occurred',
        status: error.status || status,
        code: error.code,
        details: error.details,
        retryable: error.retryable || false
      };
    }

    if (status) {
      apiError.status = status;
    }

    return {
      success: false,
      error: apiError
    };
  }

  // Create success response
  static createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data
    };
  }

  // Retry mechanism for failed requests
  static async withRetry<T>(
    apiCall: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      const isRetryable = this.isRetryableError(error);
      
      if (isRetryable && retryCount < this.maxRetries) {
        const delay = this.retryDelays[retryCount] || this.retryDelays[this.retryDelays.length - 1];
        
        console.log(`Retrying API call (attempt ${retryCount + 1}/${this.maxRetries}) after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(apiCall, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Check if error is retryable
  private static isRetryableError(error: any): boolean {
    // Network errors are usually retryable
    if (error.name === 'NetworkError' || error.message?.includes('network')) {
      return true;
    }

    // 5xx server errors are retryable
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // Rate limiting (429) is retryable
    if (error.status === 429) {
      return true;
    }

    // Timeout errors are retryable
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return true;
    }

    return false;
  }

  // Handle fetch errors
  static async handleFetchError(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails = null;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData;
    } catch {
      // If we can't parse JSON, use the default error message
    }

    const error: ApiError = {
      message: errorMessage,
      status: response.status,
      details: errorDetails,
      retryable: response.status >= 500 || response.status === 429
    };

    throw error;
  }

  // Enhanced fetch with error handling
  static async fetchWithErrorHandling(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        await this.handleFetchError(response);
      }

      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error - please check your connection',
          retryable: true
        };
      }
      throw error;
    }
  }

  // API call wrapper with full error handling
  static async apiCall<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.withRetry(() => 
        this.fetchWithErrorHandling(url, options)
      );
      
      const data = await response.json();
      return this.createSuccessResponse(data);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }
}

// React hook for API calls with error handling
export const useApiCall = () => {
  const callApi = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    return ApiErrorHandler.apiCall<T>(url, options);
  };

  const callApiWithRetry = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const response = await ApiErrorHandler.withRetry(() =>
      ApiErrorHandler.fetchWithErrorHandling(url, options)
    );
    return response.json();
  };

  return {
    callApi,
    callApiWithRetry,
    createErrorResponse: ApiErrorHandler.createErrorResponse,
    createSuccessResponse: ApiErrorHandler.createSuccessResponse
  };
};

export default ApiErrorHandler; 