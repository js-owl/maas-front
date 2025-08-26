<script lang="ts" setup>
import { API_BASE, req_json_auth } from "../api";
import { useAuthStore } from "../stores/auth.store";
import type { FormInstance, FormRules } from "element-plus";
import { onMounted, ref } from "vue";

interface IProfile {
  username: string;
}

const authStore = useAuthStore();
const profile = ref<IProfile>();

onMounted(async () => {
  const r = await req_json_auth(`/profile/`, "GET");
  profile.value = (await r?.json()) as IProfile;
});

// interface FormResponse {
//   id: number;
//   user_id: number;
//   service_id: number;
//   file_id: number;
//   quantity: number;
//   dimensions: string;
//   material_preference: string;
//   special_instructions: string;
//   status: string;
//   total_price: number;
//   created_at: string;
//   updated_at: string;
// }

const formRef = ref<FormInstance>();

// let file_id = ref(0);
// const formData = reactive({
//   service_id: 1,
//   file_id,
//   quantity: 1,
//   dimensions: '{"length":100,"width":50,"height":25}',
//   material_preference: "Алюминий",
//   special_instructions: "aaa",
// });

const rules = ref<FormRules<IProfile>>({
  username: [{ required: true, message: "Введите имя", trigger: "blur" }],
});

// const onSubmit = async () => {
//   if (!formRef.value) return;
//   try {
//     await formRef.value.validate();
//     const headers = new Headers();
//     headers.append("Content-Type", "application/x-www-form-urlencoded");
//     if (authStore.getToken) {
//       headers.append("Authorization", `Bearer ${authStore.getToken}`);
//     }
//     const toUrlEncoded = (o: any) => {
//       return Object.keys(o)
//         .map(
//           (key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`
//         )
//         .join("&");
//     };
//     console.log("toUrlEncoded", { formData }, toUrlEncoded(formData));
//     const res = await fetch(`${API_BASE}/orders`, {
//       method: "POST",
//       headers: headers,
//       body: toUrlEncoded(formData),
//     });
//     const data = (await res.json()) as FormResponse;
//     console.log({ data });
//     router.push({ name: "order-list" });
//   } catch (error) {
//     console.error("Form validation failed:", error);
//   }
// };
</script>

<template>
  <el-row
    :gutter="20"
    style="
      background-color: #fff;
      padding-top: 30px;
      min-height: 100px;
      padding-left: 20px;
    "
  >
    <el-col :offset="2" :span="20">
      <h1>Профиль</h1>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="
      background-color: #fff;
      padding-top: 30px;
      min-height: 500px;
      padding-left: 20px;
    "
  >
    <el-col :offset="2" :span="6">
      <div style="font-size: 24px; padding-bottom: 30px">Общая информация</div>
      <el-form
        :model="profile"
        :rules="rules"
        label-width="0"
        label-position="top"
      >
        <el-form-item v-if="profile" label="Имя пользователя" prop="username">
          <el-input v-model="profile.username" placeholder="username" />
        </el-form-item>
        <el-form-item v-if="profile" label="Имя пользователя" prop="username">
          <el-input v-model="profile.username" placeholder="username" />
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :offset="1" :span="6">
      <div style="font-size: 24px; padding-bottom: 30px">Адрес доставки</div>
      <el-form
        :model="profile"
        :rules="rules"
        label-width="0"
        label-position="top"
      >
        <el-form-item v-if="profile" label="Имя пользователя" prop="username">
          <el-input v-model="profile.username" placeholder="username" />
        </el-form-item>
        <el-form-item v-if="profile" label="Имя пользователя" prop="username">
          <el-input v-model="profile.username" placeholder="username" />
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :offset="1" :span="6">
      <div style="font-size: 24px; padding-bottom: 30px">
        Информация о платеже
      </div>
      <el-form
        :model="profile"
        :rules="rules"
        label-width="0"
        label-position="top"
      >
        <el-form-item v-if="profile" label="Имя пользователя" prop="username">
          <el-input v-model="profile.username" placeholder="username" />
        </el-form-item>
        <el-form-item v-if="profile" label="Имя пользователя" prop="username">
          <el-input v-model="profile.username" placeholder="username" />
        </el-form-item>
      </el-form>
    </el-col>
    <!-- 
    <el-col :offset="1" :span="6"> c </el-col> -->
  </el-row>
</template>

<style scoped></style>
