import { defineStore } from "pinia";
import { ref } from "vue";
import { req_json_auth } from "../api";
import { ElMessage } from "element-plus";

export type IProfile = {
  username: string;
  email: string;
  phone_number?: string;
  full_name: string;
  last_name?: string;
  first_name?: string;
  patronymic?: string;
  user_type: string; // "individual" | "legal"
  city: string;
  postal: string;
  region: string;
  city_name: string;
  street: string;
  building: string;
  office: string;
  payment_bank_name: string;
  payment_inn: string;
  payment_kpp: string;
  payment_bik: string;
  payment_cor_account: string;
  payment_account: string;
  payment_company_name: string;
  personal_phone_number?: string;
};

const PROFILE_STORE_KEY = "profile-store";

export const useProfileStore = defineStore("user", () => {
  const profile = ref<IProfile>();

  // Load profile from localStorage on initialization
  const savedProfile = localStorage.getItem(PROFILE_STORE_KEY);
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile) as IProfile & { apartment?: string };
      const { apartment: _omitStorage, ...parsedProfile } = parsed;

      // Парсим адрес из поля city и заполняем отдельные поля
      const addressFields = parseAddressString(parsedProfile.city);
      const nameFields = nameFieldsFromFullName(
        parsedProfile.full_name || "",
        parsedProfile.user_type
      );
      profile.value = {
        ...parsedProfile,
        office: parsedProfile.office ?? parsed.apartment ?? "",
        ...addressFields,
        ...nameFields,
      };
    } catch (error) {
      console.error("Failed to parse saved profile:", error);
      localStorage.removeItem(PROFILE_STORE_KEY);
    }
  }

  // Функция для разбора адреса из поля city на отдельные поля
  function parseAddressString(cityString: string): Partial<IProfile> {
    if (!cityString || typeof cityString !== "string") {
      return {};
    }

    const parts = cityString
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part);

    if (parts.length === 0) {
      return {};
    }

    // Устаревший: индекс, регион, город, улица, строение, помещение
    if (parts.length >= 6) {
      return {
        postal: parts[0],
        region: parts[1],
        city_name: parts[2],
        street: parts[3],
        building: parts[4],
        office: parts[5],
      };
    }

    // Промежуточный: индекс, город, улица, строение, помещение
    if (parts.length === 5) {
      return {
        postal: parts[0],
        city_name: parts[1],
        street: parts[2],
        building: parts[3],
        office: parts[4],
      };
    }

    // Промежуточный: город, улица, строение, помещение
    if (parts.length === 4) {
      return {
        city_name: parts[0],
        street: parts[1],
        building: parts[2],
        office: parts[3],
      };
    }

    if (parts.length === 3) {
      return {
        city_name: parts[0],
        street: parts[1],
        building: parts[2],
      };
    }

    if (parts.length === 2) {
      return {
        city_name: parts[0],
        street: parts[1],
      };
    }

    // Текущий: в city только город; остальное — отдельные поля API
    return { city_name: parts[0] };
  }

  function saveProfileToStorage(profileData: IProfile) {
    try {
      localStorage.setItem(PROFILE_STORE_KEY, JSON.stringify(profileData));
    } catch (error) {
      console.error("Failed to save profile to localStorage:", error);
    }
  }

  function clearProfileFromStorage() {
    try {
      localStorage.removeItem(PROFILE_STORE_KEY);
    } catch (error) {
      console.error("Failed to clear profile from localStorage:", error);
    }
  }

  // Функция для разбора full_name на отдельные поля
  function parseFullName(fullName: string): Partial<IProfile> {
    if (!fullName || typeof fullName !== "string") {
      return {
        last_name: "",
        first_name: "",
        patronymic: "",
      };
    }

    // Разбиваем строку по пробелам и убираем лишние пробелы
    const parts = fullName
      .split(/\s+/)
      .map((part) => part.trim())
      .filter((part) => part);

    return {
      last_name: parts[0] || "",
      first_name: parts[1] || "",
      patronymic: parts[2] || "",
    };
  }

  /** Юр. лицо: контактное лицо хранится как одна строка в full_name — не дробим по пробелам. */
  function nameFieldsFromFullName(
    fullName: string,
    userType: string | undefined
  ): Partial<IProfile> {
    if (userType === "legal") {
      return {
        last_name: typeof fullName === "string" ? fullName : "",
        first_name: "",
        patronymic: "",
      };
    }
    return parseFullName(fullName || "");
  }

  // Функция для объединения отдельных полей в full_name
  function buildFullName(profile: Partial<IProfile>): string {
    const parts = [
      profile.last_name,
      profile.first_name,
      profile.patronymic,
    ].filter((part) => part && part.trim());

    return parts.join(" ");
  }

  function enrichProfile(profileData: IProfile & { apartment?: string }): IProfile {
    const { apartment: _omit, ...rest } = profileData;
    const addressFields = parseAddressString(rest.city);
    const nameFields = nameFieldsFromFullName(rest.full_name || "", rest.user_type);

    return {
      ...rest,
      office: rest.office ?? profileData.apartment ?? "",
      ...addressFields,
      ...nameFields,
    };
  }

  async function getProfile() {
    const r = await req_json_auth(`/profile`, "GET");
    if (r) {
      const profileData = (await r.json()) as IProfile;
      const enrichedProfileData = enrichProfile(profileData);

      profile.value = enrichedProfileData;
      saveProfileToStorage(enrichedProfileData);
    }
  }

  async function updateProfile(updated: IProfile) {
    // Объединяем отдельные поля имени обратно в full_name для API
    const fullName = buildFullName(updated);
    const { apartment: _omitApartment, ...rest } = updated as IProfile & {
      apartment?: string;
    };
    const profileForApi = {
      ...rest,
      // Не использовать fullName || updated.full_name: пустая строка должна очищать full_name в API
      full_name: fullName,
    };

    const r = await req_json_auth(`/profile`, "PUT", profileForApi, [422]);
    if (!r) return false;
    if (r.status === 422) {
      ElMessage({
        type: "warning",
        message: "Необходимо заполнить поля",
      });
      return false;
    }

    let profileData = profileForApi as IProfile;

    if (r.status !== 204) {
      const responseText = await r.text();

      if (responseText.trim()) {
        profileData = JSON.parse(responseText) as IProfile;
      }
    }

    // Ответ API может вернуть устаревший full_name при очистке поля — берём фактически отправленные ФИО
    const mergedAfterPut: IProfile & { apartment?: string } = {
      ...profileData,
      full_name: fullName,
      last_name: updated.last_name ?? "",
      first_name: updated.first_name ?? "",
      patronymic: updated.patronymic ?? "",
      user_type: updated.user_type,
    };

    const enrichedProfileData = enrichProfile(mergedAfterPut);

    profile.value = enrichedProfileData;
    saveProfileToStorage(enrichedProfileData);
    ElMessage({
      type: "success",
      message: "Профиль успешно обновлен!",
    });

    return true;
  }

  function clearProfile() {
    profile.value = undefined;
    clearProfileFromStorage();
  }

  return { profile, getProfile, updateProfile, clearProfile };
});
