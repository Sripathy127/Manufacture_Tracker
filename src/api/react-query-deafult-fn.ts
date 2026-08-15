import { type QueryFunctionContext } from "@tanstack/react-query";

export async function defaultQueryFn<T>(
  context: QueryFunctionContext
): Promise<T> {
  const [, endpoint, body] = context.queryKey;

  return await makeRequest<T>(endpoint as string, body);
}

async function makeRequest<T>(
  endpoint: string,
  body?: unknown
  // retryCount: number = 0
): Promise<T> {
  const method = body ? "POST" : "GET";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
  };
  if (method == "POST" && body) {
    fetchOptions.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(endpoint, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}
