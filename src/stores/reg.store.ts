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
      username: formData.value.email,
      password: formData.value.password,
    };

    console.log("reg.store: register", { payload });

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Registration failed:", errorData);
      throw new Error(`Registration failed: ${res.status} ${res.statusText}`);
    }
    
    const data = (await res.json()) as RegResponse;
    console.log("reg.store", { data });
    token.value = data.access_token;
  }

  return { token, register };
});
