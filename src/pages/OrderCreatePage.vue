<script lang="ts" setup>
import { API_BASE } from "../api";
import { useAuthStore } from "../stores/auth.store";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import IconDrawing from "../icons/IconDrawing.vue";
import router from "../router";

const authStore = useAuthStore();

interface FormData {
  service_id: number;
  file_id: number;
  quantity: number;
  dimensions: string;
  material_preference: string;
  special_instructions: string;
}

interface FormResponse {
  id: number;
  user_id: number;
  service_id: number;
  file_id: number;
  quantity: number;
  dimensions: string;
  material_preference: string;
  special_instructions: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

const formRef = ref<FormInstance>();

let file_id = ref(0);
const formData = reactive({
  service_id: 1,
  file_id,
  quantity: 1,
  dimensions: '{"length":100,"width":50,"height":25}',
  material_preference: "Алюминий",
  special_instructions: "aaa",
});

const rules = ref<FormRules<FormData>>({
  service_id: [
    { required: true, message: "Введите service_id", trigger: "blur" },
  ],
  file_id: [{ required: true, message: "Введите file_id", trigger: "blur" }],
  dimensions: [
    { required: true, message: "Введите service_id", trigger: "blur" },
  ],
});

const onSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const toUrlEncoded = (o: any) => {
      return Object.keys(o)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`
        )
        .join("&");
    };
    console.log("toUrlEncoded", { formData }, toUrlEncoded(formData));

    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: headers,
      body: toUrlEncoded(formData),
    });
    const data = (await res.json()) as FormResponse;
    console.log({ data });
    router.push({ name: "order-list" });
  } catch (error) {
    console.error("Form validation failed:", error);
  }
};

const volume = ref(0);
const handleSuccess = (response: any) => {
  volume.value = response.volume_cm3;
  console.log({ response });
};
</script>

<template>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 30px; min-height: 100px"
  >
    <el-col :offset="2" :span="20">
      <h1>Создать заказ</h1>
    </el-col>
  </el-row>
  <el-row
    :gutter="20"
    style="background-color: #fff; padding-top: 30px; min-height: 500px"
  >
    <el-col :offset="2" :span="9">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        label-position="top"
      >
        <el-form-item label="service_id" prop="service_id">
          <el-input v-model="formData.service_id" placeholder="service_id" />
        </el-form-item>

        <el-form-item label="file_id" prop="file_id">
          <el-input v-model="formData.file_id" placeholder="file_id" />
        </el-form-item>

        <el-form-item label="Размеры" prop="dimensions">
          <el-input
            v-model="formData.dimensions"
            placeholder="Введите размеры"
          />
        </el-form-item>

        <el-form-item label="Количество" prop="quantity">
          <el-input
            v-model="formData.quantity"
            placeholder="Введите количество"
          />
        </el-form-item>

        <el-form-item label="Материал" prop="material_preference">
          <el-input
            v-model="formData.material_preference"
            placeholder="Введите материал"
          />
        </el-form-item>

        <el-form-item label="Инструкции" prop="special_instructions">
          <el-input
            v-model="formData.special_instructions"
            placeholder="Введите инструкции"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="width: 100%">
            Отправить заказ
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :offset="2" :span="4">
      <UploadModel v-model="file_id" color="#283d5b" />
    </el-col>

    <el-col :offset="1" :span="4">
      <el-upload
        class="upload-demo"
        drag
        action="http://mdgkd-vlabal.int.kronshtadt.ru:7000/calculate-volume/"
        multiple
        :on-success="handleSuccess"
      >
        <div class="custom">
          <IconDrawing
            color="#283d5b"
            style="display: block; width: 100px; height: 100px"
          />
          <div style="font-size: 22px; color: #283d5b">
            Чертежи, документация
          </div>
        </div>
      </el-upload>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  border: 1px solid #283d5b;
}
.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
