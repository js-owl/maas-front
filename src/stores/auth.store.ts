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
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const toUrlEncoded = (o: any) => {
      return Object.keys(o)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`
        )
        .join("&");
    };

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: headers,
      body: toUrlEncoded(formData),
    });
    const data = (await res.json()) as LoginResponse;
    setToken(data.access_token);

    const profileStore = useProfileStore();
    await profileStore.getProfile();
  }

  return { getToken, setToken, clearToken, login };
});
