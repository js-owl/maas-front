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

    // const payload = {
    //   firstName: formData.value.firstName,
    //   lastName: formData.value.lastName,
    //   email: formData.value.email,
    //   phone: formData.value.phone,
    //   service: formData.value.service,
    //   company: formData.value.company,
    //   agreement: formData.value.agreement,
    // };

    const payload = {
      username: formData.value.firstName,
      password: formData.value.lastName,
    };

    console.log("reg.store: register", { payload });

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as RegResponse;
    console.log("reg.store", { data });
    // token.value = data.access_token;
  }

  return { token, register };
});
