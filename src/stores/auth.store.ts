import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { API_BASE } from "../api";
import { useProfileStore } from "../stores/profile.store";
import { useMaterialStore } from "../stores/material.store";

type AuthResponse = {
  access_token: string;
  token_type: string;
  must_change_password: boolean;
};

const TOKEN_STORE_KEY = "token-store";
const TOKEN_PERSISTENCE_KEY = "token-persistence";
const TOKEN_PERSISTENCE = {
  local: "local",
  session: "session",
} as const;

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string>();
  const mustChangePassword = ref(false);

  const initialStorageType =
    localStorage.getItem(TOKEN_PERSISTENCE_KEY) === TOKEN_PERSISTENCE.local
      ? TOKEN_PERSISTENCE.local
      : TOKEN_PERSISTENCE.session;

  const initialValue =
    initialStorageType === TOKEN_PERSISTENCE.local
      ? localStorage.getItem(TOKEN_STORE_KEY)
      : sessionStorage.getItem(TOKEN_STORE_KEY);
  const tokenPersistence = ref(initialStorageType);

  if (initialValue) {
    token.value = initialValue;
  }

  const getToken = computed(() => token.value);
  const getMustChangePassword = computed(() => mustChangePassword.value);

  function setToken(newToken: string, rememberMe = tokenPersistence.value === TOKEN_PERSISTENCE.local) {
    token.value = newToken;

    if (rememberMe) {
      tokenPersistence.value = TOKEN_PERSISTENCE.local;
      localStorage.setItem(TOKEN_STORE_KEY, newToken);
      sessionStorage.removeItem(TOKEN_STORE_KEY);
      localStorage.setItem(TOKEN_PERSISTENCE_KEY, TOKEN_PERSISTENCE.local);
      return;
    }

    tokenPersistence.value = TOKEN_PERSISTENCE.session;
    sessionStorage.setItem(TOKEN_STORE_KEY, newToken);
    localStorage.removeItem(TOKEN_STORE_KEY);
    localStorage.setItem(TOKEN_PERSISTENCE_KEY, TOKEN_PERSISTENCE.session);
  }

  function clearToken() {
    token.value = undefined;
    mustChangePassword.value = false;
    tokenPersistence.value = TOKEN_PERSISTENCE.session;
    localStorage.removeItem(TOKEN_STORE_KEY);
    sessionStorage.removeItem(TOKEN_STORE_KEY);
    localStorage.removeItem(TOKEN_PERSISTENCE_KEY);

    // Clear profile when logging out
    const profileStore = useProfileStore();
    profileStore.clearProfile();

    // Clear materials from localStorage
    const materialStore = useMaterialStore();
    materialStore.allMaterials = [];
    materialStore.materials = [];
  }

  async function login(formData: any, rememberMe = true) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        remember_me: rememberMe,
      }),
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

    const data = (await res.json()) as AuthResponse;
    setToken(data.access_token, rememberMe);
    mustChangePassword.value = data.must_change_password;

    const profileStore = useProfileStore();
    await profileStore.getProfile();
  }

  async function logout() {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      if (token.value) {
        headers.append("Authorization", `Bearer ${token.value}`);
      }

      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers,
        credentials: "include",
      });
    } finally {
      clearToken();
    }
  }

  function setMustChangePassword(value: boolean) {
    mustChangePassword.value = value;
  }

  return {
    getToken,
    getMustChangePassword,
    setToken,
    setMustChangePassword,
    clearToken,
    login,
    logout,
  };
});
