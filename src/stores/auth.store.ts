import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { API_BASE } from "../api";
import { useProfileStore } from "../stores/profile.store";

interface LoginResponse {
  access_token: string;
}

const TOKEN_STORE_KEY = "token-store";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string>();

  // присваиваем значение из localStorage
  const initialValue = localStorage.getItem(TOKEN_STORE_KEY);
  if (initialValue) {
    token.value = initialValue;
  }

  const getToken = computed(() => token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem(TOKEN_STORE_KEY, newToken);
  }

  function clearToken() {
    token.value = undefined;
    localStorage.removeItem(TOKEN_STORE_KEY);

    // Clear profile when logging out
    const profileStore = useProfileStore();
    profileStore.clearProfile();
  }

  async function login(formData: any) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      let message = `Login failed: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        const detail = (errorData && (errorData.detail || errorData.message)) || "";
        const detailStr = typeof detail === "string" ? detail : JSON.stringify(detail);
        // Наиболее частый кейс — неправильные логин/пароль
        if (res.status === 401 || /invalid|unauthorized|неверн/i.test(detailStr)) {
          throw new Error("Неверное имя пользователя или пароль");
        }
        if (detailStr) message = detailStr;
      } catch (_) {
        // ignore parse error and keep default message
      }
      throw new Error(message);
    }

    const data = (await res.json()) as LoginResponse;
    setToken(data.access_token);

    const profileStore = useProfileStore();
    await profileStore.getProfile();
  }

  return { getToken, setToken, clearToken, login };
});
