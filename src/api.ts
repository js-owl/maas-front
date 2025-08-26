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

// Enhanced error handling function
const handleApiError = (response: Response, endpoint: string) => {
  const status = response.status;
  
  switch (status) {
    case 400:
      ElMessage.error("Неверный запрос. Проверьте введенные данные.");
      break;
    case 401:
      ElMessage.error("Необходима авторизация. Войдите в систему.");
      break;
    case 403:
      ElMessage.error("Доступ запрещен. Недостаточно прав.");
      break;
    case 404:
      ElMessage.error("Запрашиваемый ресурс не найден.");
      break;
    case 422:
      ElMessage.error("Ошибка валидации данных. Проверьте введенную информацию.");
      break;
    case 500:
      ElMessage.error("Внутренняя ошибка сервера. Попробуйте позже.");
      break;
    case 502:
      ElMessage.error("Ошибка шлюза. Сервер временно недоступен.");
      break;
    case 503:
      ElMessage.error("Сервис временно недоступен. Попробуйте позже.");
      break;
    case 504:
      ElMessage.error("Превышено время ожидания ответа сервера.");
      break;
    default:
      if (status >= 500) {
        ElMessage.error(`Ошибка сервера ${status}. Попробуйте позже.`);
      } else {
        ElMessage.error(`Ошибка ${status}. Попробуйте еще раз.`);
      }
  }
  
  console.error(`API Error ${status} for endpoint: ${endpoint}`);
};

// Retry function for server errors
const retryRequest = async (
  requestFn: () => Promise<Response>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<Response> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await requestFn();
      
      // If it's a server error and we have retries left, wait and retry
      if (response.status >= 500 && response.status < 600 && attempt < maxRetries) {
        console.log(`Server error ${response.status}, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError!;
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

    const requestFn = () => fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    });

    const res = await retryRequest(requestFn);
    console.log("req_urlencoded", res.status);

    if (!res.ok) {
      handleApiError(res, endpoint);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return res;
  } catch (error) {
    console.error("req_urlencoded error:", { error, endpoint });
    return null;
  }
}

export async function req_urlencoded_auth(
  endpoint: string,
  method: string = "POST",
  data?: any
): Promise<Response> {
  try {
    const authStore = useAuthStore();
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const body = data ? toUrlEncoded(data) : undefined;

    const requestFn = () => fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    });

    const res = await retryRequest(requestFn);
    console.log("req_urlencoded_auth", { status: res.status });

    if (res.status === 401) {
      authStore.clearToken();
      router.push("/");
      ElMessage.error("Сессия истекла. Войдите в систему снова.");
      throw new Error("Authentication failed");
    }

    if (!res.ok) {
      handleApiError(res, endpoint);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res;
  } catch (error) {
    console.error("req_urlencoded_auth error:", { error, endpoint });
    throw error;
  }
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

    const requestFn = () => fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body,
    });

    const res = await retryRequest(requestFn);
    console.log("req_json_auth", { status: res.status });

    if (res.status === 401) {
      authStore.clearToken();
      router.push("/");
      ElMessage.error("Сессия истекла. Войдите в систему снова.");
      throw new Error("Authentication failed");
    }

    if (!res.ok) {
      handleApiError(res, endpoint);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res;
  } catch (error) {
    console.error("req_json_auth error:", { error, endpoint });
    return null;
  }
}

// Additional helper functions for common API operations
export async function fetchWithAuth(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<Response> {
  return req_json_auth(endpoint, method, data) as Promise<Response>;
}

export async function fetchWithoutAuth(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<Response | null> {
  return req_urlencoded(endpoint, method, data);
}
