import { useAuthStore } from "./stores/auth.store";

// API Base URLs
export const API_BASE_CAD = "http://mdgkd-vlabal.int.kronshtadt.ru:7000";
// export const API_BASE = "http://mdgkd-vlabal.int.kronshtadt.ru:8000";
export const API_BASE = "http://localhost:8000";

// Helper function to convert object to URL-encoded string
const toUrlEncoded = (o: any): string => {
  return Object.keys(o)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`)
    .join("&");
};

// Fetch function without authorization
export async function fetchWithoutAuth(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response> {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body = data ? toUrlEncoded(data) : undefined;

  return fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
}

// Fetch function with authorization
export async function fetchWithAuth(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response> {
  const authStore = useAuthStore();
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  if (authStore.getToken) {
    headers.append("Authorization", `Bearer ${authStore.getToken}`);
  }

  const body = data ? toUrlEncoded(data) : undefined;

  return fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
}
