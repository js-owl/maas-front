import { defineStore } from "pinia";
import { ref } from "vue";
import { API_BASE } from "../api";

interface RegResponse {
  access_token: string;
}

export const useRegStore = defineStore("reg", () => {
  const token = ref<string>();

  async function register(formData: any) {
    console.log("reg.store: register", { formData });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const payload = {
      username: formData.value.username,
      password: formData.value.password,
      user_type: formData.value.user_type,
    };

    console.log("reg.store: register", { payload });

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorMessage = `Registration failed: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        const detail =
          (errorData && (errorData.detail || errorData.message)) || "";
        const detailStr =
          typeof detail === "string" ? detail : JSON.stringify(detail);
        // Определяем кейс "пользователь уже существует"
        if (
          res.status === 409 ||
          /exist|already|уже существует/i.test(detailStr)
        ) {
          throw new Error("Такой пользователь уже существует");
        }
        if (detailStr) {
          errorMessage = detailStr;
        }
      } catch (e) {
        // Если не удалось распарсить json, оставляем дефолтное сообщение
      }
      throw new Error(errorMessage);
    }

    const data = (await res.json()) as RegResponse;
    console.log("reg.store", { data });
    token.value = data.access_token;
  }

  return { token, register };
});
