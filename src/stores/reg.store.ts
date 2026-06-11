import { defineStore } from "pinia";
import { API_BASE } from "../api";
import { normalizeEmail } from "../helpers/email-verification";

export type RegisterResult = {
  email: string;
};

export const useRegStore = defineStore("reg", () => {
  async function register(formData: any): Promise<RegisterResult> {
    console.log("reg.store: register", { formData });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const email = normalizeEmail(formData.value.email || "");
    const phoneNumber =
      formData.value.phone_number && formData.value.phone_number !== "7"
        ? formData.value.phone_number
        : "";

    const payload = {
      full_name: formData.value.full_name || "",
      personal_email: email,
      personal_phone_number: phoneNumber,
      password: formData.value.password,
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
        if (
          res.status === 400 ||
          res.status === 409 ||
          /exist|already|уже существует|already registered/i.test(detailStr)
        ) {
          throw new Error("Такой пользователь уже существует");
        }
        if (detailStr) {
          errorMessage = detailStr;
        }
      } catch (e) {
        if (e instanceof Error && e.message === "Такой пользователь уже существует") {
          throw e;
        }
      }
      throw new Error(errorMessage);
    }

    await res.json();
    console.log("reg.store: registration complete");

    return { email };
  }

  return { register };
});
