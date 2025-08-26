import { defineStore } from "pinia";
import { ref } from "vue";
import { req_json_auth } from "../api";

export interface IProfile {
  username: string;
}

export const useProfileStore = defineStore("user", () => {
  const profile = ref<IProfile>();

  async function getProfile() {
    const r = await req_json_auth(`/profile/`, "GET");
    profile.value = (await r?.json()) as IProfile;
  }

  return { profile, getProfile };
});
