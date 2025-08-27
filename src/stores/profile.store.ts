import { defineStore } from "pinia";
import { ref } from "vue";
import { req_json_auth } from "../api";

export interface IProfile {
  username: string;
}

const PROFILE_STORE_KEY = "profile-store";

export const useProfileStore = defineStore("user", () => {
  const profile = ref<IProfile>();

  // Load profile from localStorage on initialization
  const savedProfile = localStorage.getItem(PROFILE_STORE_KEY);
  if (savedProfile) {
    try {
      profile.value = JSON.parse(savedProfile) as IProfile;
    } catch (error) {
      console.error("Failed to parse saved profile:", error);
      localStorage.removeItem(PROFILE_STORE_KEY);
    }
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
      profile.value = profileData;
      saveProfileToStorage(profileData);
    }
  }

  async function updateProfile(updated: IProfile) {
    const r = await req_json_auth(`/profile/`, "PUT", updated);
    if (r) {
      const profileData = (await r.json()) as IProfile;
      profile.value = profileData;
      saveProfileToStorage(profileData);
    }
  }

  function clearProfile() {
    profile.value = undefined;
    clearProfileFromStorage();
  }

  return { profile, getProfile, updateProfile, clearProfile };
});
