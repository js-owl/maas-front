import { defineStore } from "pinia";
import { ref } from "vue";
import { req_json_auth } from "../api";
import { ElMessage } from "element-plus";

export interface IProfile {
  username: string;
  email: string;
  full_name: string;
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
      profile.value = {
        ...parsedProfile,
        ...addressFields,
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

  async function getProfile() {
    const r = await req_json_auth(`/profile/`, "GET");
    if (r) {
      const profileData = (await r.json()) as IProfile;

      // Парсим адрес из поля city и заполняем отдельные поля
      const addressFields = parseAddressString(profileData.city);
      const enrichedProfileData = {
        ...profileData,
        ...addressFields,
      };

      profile.value = enrichedProfileData;
      saveProfileToStorage(enrichedProfileData);
    }
  }

  async function updateProfile(updated: IProfile) {
    const r = await req_json_auth(`/profile/`, "PUT", updated);
    if (r) {
      const profileData = (await r.json()) as IProfile;

      // Парсим адрес из поля city и заполняем отдельные поля
      const addressFields = parseAddressString(profileData.city);
      const enrichedProfileData = {
        ...profileData,
        ...addressFields,
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
