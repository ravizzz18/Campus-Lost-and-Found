/**
 * Campus Lost & Found — API Service Layer
 * 
 * Future FastAPI backend integration contract:
 * Base URL defaults to VITE_API_URL or '/api/v1'
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export class ApiService {
  public static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  public static async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}
