/**
 * API client for making HTTP requests
 */

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
  next?: { revalidate?: number };
};

/**
 * Base API client for making HTTP requests
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns The response data
 */
export async function fetchApi<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    ...restOptions
  } = options;

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Error ${response.status}: ${response.statusText}`);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * GET request helper
 */
export function get<T>(url: string, options: Omit<FetchOptions, 'method'> = {}): Promise<T> {
  return fetchApi<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export function post<T>(url: string, data: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T> {
  return fetchApi<T>(url, { ...options, method: 'POST', body: data });
}

/**
 * PUT request helper
 */
export function put<T>(url: string, data: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T> {
  return fetchApi<T>(url, { ...options, method: 'PUT', body: data });
}

/**
 * DELETE request helper
 */
export function del<T>(url: string, options: Omit<FetchOptions, 'method'> = {}): Promise<T> {
  return fetchApi<T>(url, { ...options, method: 'DELETE' });
}

/**
 * PATCH request helper
 */
export function patch<T>(url: string, data: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T> {
  return fetchApi<T>(url, { ...options, method: 'PATCH', body: data });
}
