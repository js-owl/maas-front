import { ElMessage } from "element-plus";
import { useAuthStore } from "./stores/auth.store";
import router from "./router";

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

export async function req_urlencoded(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response | null> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = data ? toUrlEncoded(data) : undefined;

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    });
    console.log("req_urlencoded", res.status);

    if (res.status >= 500 && res.status < 600) {
      console.log("req_urlencoded", res.status);
      ElMessage.error("Ошибка сервера 500");
      throw new Error("Server error");
    }
    if (!res.ok) {
      throw new Error("http error");
    }
    return res;
  } catch (error) {
    console.error("fetchData", { error });
    return null;
  }
}

export async function req_urlencoded_auth(
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

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
  console.log("req_urlencoded_auth", { res });
  if (res.status === 401) {
    authStore.clearToken();
    router.push("/");
    throw new Error("Authentification failed");
  }
  if (res.status >= 500 && res.status < 600) {
    console.log("req_urlencoded", res.status);
    ElMessage.error("Ошибка сервера 500");
    throw new Error("Server error");
  }
  if (!res.ok) {
    throw new Error("http error");
  }
  return res;
}

export async function req_json_auth(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response | null> {
  try {
    const authStore = useAuthStore();
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const body = data ? JSON.stringify(data) : undefined;

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    });
    console.log("req_json_auth", { res });
    if (res.status === 401) {
      authStore.clearToken();
      router.push("/");
      throw new Error("Authentification failed");
    }
    if (res.status >= 500 && res.status < 600) {
      console.log("req_urlencoded", res.status);
      ElMessage.error("Ошибка сервера 500");
      throw new Error("Server error");
    }
    if (!res.ok) {
      throw new Error("http error");
    }
    return res;
  } catch (error) {
    console.error("fetchData", { error });
    return null;
  }
}
