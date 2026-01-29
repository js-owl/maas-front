import { defineStore } from "pinia";
import { ref } from "vue";
import { req_json_auth } from "../api";
import { ElMessage } from "element-plus";

export interface IProfile {
  username: string;
  email: string;
  phone?: string;
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
  apartment: string;
  payment_bank_name: string;
  payment_inn: string;
  payment_kpp: string;
  payment_bik: string;
  payment_cor_account: string;
  payment_account: string;
  payment_company_name: string;
}

const PROFILE_STORE_KEY = "profile-store";

export const useProfileStore = defineStore("user", () => {
  const profile = ref<IProfile>();

  // Load profile from localStorage on initialization
  const savedProfile = localStorage.getItem(PROFILE_STORE_KEY);
  if (savedProfile) {
    try {
      const parsedProfile = JSON.parse(savedProfile) as IProfile;

      // Парсим адрес из поля city и заполняем отдельные поля
      const addressFields = parseAddressString(parsedProfile.city);
      // Парсим full_name на отдельные поля
      const nameFields = parseFullName(parsedProfile.full_name || "");
      profile.value = {
        ...parsedProfile,
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
      return {
        postal: "",
        region: "",
        city_name: "",
        street: "",
        building: "",
        apartment: "",
      };
    }

    // Разбиваем строку по запятой и убираем лишние пробелы
    const parts = cityString
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part);

    // Инициализируем поля пустыми строками
    const addressFields: Partial<IProfile> = {
      postal: "",
      region: "",
      city_name: "",
      street: "",
      building: "",
      apartment: "",
    };

    // Заполняем поля в зависимости от количества частей
    if (parts.length >= 1) addressFields.postal = parts[0];
    if (parts.length >= 2) addressFields.region = parts[1];
    if (parts.length >= 3) addressFields.city_name = parts[2];
    if (parts.length >= 4) addressFields.street = parts[3];
    if (parts.length >= 5) addressFields.building = parts[4];
    if (parts.length >= 6) addressFields.apartment = parts[5];

    return addressFields;
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

  // Функция для объединения отдельных полей в full_name
  function buildFullName(profile: Partial<IProfile>): string {
    const parts = [
      profile.last_name,
      profile.first_name,
      profile.patronymic,
    ].filter((part) => part && part.trim());

    return parts.join(" ");
  }

  async function getProfile() {
    const r = await req_json_auth(`/profile`, "GET");
    if (r) {
      const profileData = (await r.json()) as IProfile;

      // Парсим адрес из поля city и заполняем отдельные поля
      const addressFields = parseAddressString(profileData.city);
      // Парсим full_name на отдельные поля
      const nameFields = parseFullName(profileData.full_name || "");
      const enrichedProfileData = {
        ...profileData,
        ...addressFields,
        ...nameFields,
      };

      profile.value = enrichedProfileData;
      saveProfileToStorage(enrichedProfileData);
    }
  }

  async function updateProfile(updated: IProfile) {
    // Объединяем отдельные поля имени обратно в full_name для API
    const fullName = buildFullName(updated);
    const profileForApi = {
      ...updated,
      full_name: fullName || updated.full_name,
    };

    const r = await req_json_auth(`/profile`, "PUT", profileForApi);
    if (r) {
      const profileData = (await r.json()) as IProfile;

      // Парсим адрес из поля city и заполняем отдельные поля
      const addressFields = parseAddressString(profileData.city);
      // Парсим full_name на отдельные поля
      const nameFields = parseFullName(profileData.full_name || "");
      const enrichedProfileData = {
        ...profileData,
        ...addressFields,
        ...nameFields,
      };

      profile.value = enrichedProfileData;
      saveProfileToStorage(enrichedProfileData);
      ElMessage({
        type: "success",
        message: "Профиль успешно обновлен!",
      });
    }
  }

  function clearProfile() {
    profile.value = undefined;
    clearProfileFromStorage();
  }

  return { profile, getProfile, updateProfile, clearProfile };
});
