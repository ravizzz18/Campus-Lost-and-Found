
/**
 * Campus Lost & Found — API Service Layer
 * Connects the React frontend to the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiService {
  public static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token =
      localStorage.getItem('clf_auth_token') ||
      sessionStorage.getItem('clf_auth_token');

    const headers = new Headers(options.headers);

    // Do not set Content-Type for FormData.
    if (
      !(options.body instanceof FormData) &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }

    // Attach only real backend JWT tokens.
    // Demo tokens must never be sent to FastAPI.
    if (
      token &&
      !token.startsWith('clf_mock_jwt_') &&
      !headers.has('Authorization')
    ) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle empty responses.
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse response.
    const contentType = response.headers.get('content-type');

    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    // Handle backend errors.
    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null
          ? data.detail || data.message || 'Request failed'
          : data || response.statusText;

      throw new Error(
        typeof message === 'string'
          ? message
          : JSON.stringify(message)
      );
    }

    return data as T;
  }

  // Check FastAPI backend health.
  public static async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}
