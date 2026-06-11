import { defineStore } from "pinia";
import type { Ref } from "vue";
import { API_BASE } from "../api";
import { normalizeEmail } from "../helpers/email-verification";
import { normalizeRuPhoneDigits } from "../composables/usePhoneValidation";

/** Поля формы регистрации, соответствующие схеме UserCreate на бэкенде. */
export type RegisterFormData = {
  full_name: string;
  personal_email: string;
  personal_phone_number: string;
  password: string;
};

export type RegisterResult = {
  email: string;
};

const DUPLICATE_EMAIL_ERROR = "Такой email уже зарегистрирован";

export const useRegStore = defineStore("reg", () => {
  async function register(formData: Ref<RegisterFormData>): Promise<RegisterResult> {
    console.log("reg.store: register", { formData });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const email = normalizeEmail(formData.value.personal_email);
    const payload: RegisterFormData = {
      full_name: formData.value.full_name.trim(),
      personal_email: email,
      personal_phone_number: normalizeRuPhoneDigits(formData.value.personal_phone_number),
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
          /personal email already registered|exist|already|уже существует|already registered/i.test(
            detailStr,
          )
        ) {
          throw new Error(DUPLICATE_EMAIL_ERROR);
        }
        if (detailStr) {
          errorMessage = detailStr;
        }
      } catch (e) {
        if (e instanceof Error && e.message === DUPLICATE_EMAIL_ERROR) {
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
