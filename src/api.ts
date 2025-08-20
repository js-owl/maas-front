import { ElMessage } from "element-plus";
import { useAuthStore } from "./stores/auth.store";

// API Base URLs
export const API_BASE_CAD = "http://mdgkd-vlabal.int.kronshtadt.ru:7000";
export const API_BASE = "http://mdgkd-vlabal.int.kronshtadt.ru:8000";
// export const API_BASE = "http://localhost:8000";

// Helper function to convert object to URL-encoded string
const toUrlEncoded = (o: any): string => {
  return Object.keys(o)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`)
    .join("&");
};

export async function fetchWithoutAuth(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response> {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const body = data ? toUrlEncoded(data) : undefined;
  console.log("fetchWithoutAuth", { body });

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
  if (res.status >= 500 && res.status < 600) {
    console.log("fetchWithoutAuth", res.status);
    ElMessage.error("Ошибка сервера 500");
    const err: any = Error("server error 500");
    throw err;
  }
  return res;
}

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
  console.log("fetchWithAuth", { body });

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
  if (res.status >= 500 && res.status < 600) {
    console.log("fetchWithoutAuth", res.status);
    ElMessage.error("Ошибка сервера 500");
    const err: any = Error("server error 500");
    throw err;
  }
  return res;
}

export async function req_json_auth(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response> {
  const authStore = useAuthStore();
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (authStore.getToken) {
    headers.append("Authorization", `Bearer ${authStore.getToken}`);
  }

  const body = data ? toUrlEncoded(data) : undefined;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
  console.log("req_json_auth", { res });
  if (res.status >= 500 && res.status < 600) {
    console.log("fetchWithoutAuth", res.status);
    ElMessage.error("Ошибка сервера 500");
    const err: any = Error("server error 500");
    throw err;
  }
  return res;
}
