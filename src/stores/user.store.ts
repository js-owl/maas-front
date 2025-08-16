import { defineStore } from "pinia";
import { ref } from "vue";
import { API_BASE } from "../api";
import type { User } from "../interfaces/user.interface";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>({ name: "alex" });

  async function fetchUser() {
    const res = await fetch(`${API_BASE}/login/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({
        email: "user@example.com",
        password: "string",
      }),
    });
    const data = (await res.json()) as User;
    user.value = data;
  }

  return { user, fetchUser };
});
