<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { API_BASE } from "../api";

import Length from "../components/coefficients/Length.vue";
import Width from "../components/coefficients/Width.vue";
import CoefficientQuantity from "../components/coefficients/CoefficientQuantity.vue";

import MaterialPlastic from "../components/materials/MaterialPlastic.vue";
import PlasticPreparation from "../components/coefficients/PlasticPreparation.vue";

import CoefficientTooling from "../components/coefficients/CoefficientTooling.vue";
import CoefficientOtk from "../components/coefficients/CoefficientOtk.vue";
import CoefficientCertificate from "../components/coefficients/CoefficientCertificate.vue";
import router from "../router";
import UploadModel from "../components/UploadModel.vue";
import UploadDrawings from "../components/UploadDrawings.vue";
import { useAuthStore } from "../stores/auth.store";
// @ts-ignore
import CadShowById from "../components/CadShowById.vue";

const authStore = useAuthStore();

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

let file_id = ref(1);
let drawing_id = ref(1);

let length = ref(10);
let width = ref(5);
let quantity = ref(1);

let material = ref("plastic");
let plastic_preparation = ref("a");

const k_complexity = ref(0.75);
let k_tooling = ref("1");
let control_type = ref("1.3");
let sert_type = ref(["a", "f"]);

// TODO: добавить length,  width
const payload = reactive({
  service_id: 2,
  file_id,
  quantity,
  length,
  width,
  height: width,
  material_preference: material,
  plastic_preparation,
  k_complexity,
  k_tooling,
  control_type,
  sert_type,
  special_instructions: "aaa",
});

let result = ref({ total_price: 0, quantity: 1 });

// Отправляем запрос на сервер при любом изменении данных
watch(payload, sendData, { deep: true });

onMounted(() => {
  sendData(payload);
});

type sendType = typeof payload;

async function sendData(payload: sendType) {
  console.log("token", authStore.getToken);
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const toUrlEncoded = (o: any) => {
      return Object.keys(o)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`
        )
        .join("&");
    };

    const res = await fetch(`${API_BASE}/anonymous-calc`, {
      method: "POST",
      headers: headers,
      body: toUrlEncoded(payload),
    });
    const data = (await res.json()) as FormResponse;
    result.value = data;
    console.log({ res });
  } catch (error) {
    console.error({ error });
  }
}

async function submitOrder(payload: sendType) {
  console.log("token", authStore.getToken);
  try {
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

    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: headers,
      body: toUrlEncoded(payload),
    });
    const data = (await res.json()) as FormResponse;
    result.value = data;
    console.log({ res });
    router.push({ name: "order-list" });
  } catch (error) {
    console.error({ error });
  }
}
</script>

<template>
  <el-row :gutter="5" style="min-height: 500px">
    <!-- 1. Левая часть -->
    <el-col
      :span="9"
      style="background-color: #283d5b; padding: 30px 50px 30px 100px"
    >
      <div style="color: white; font-size: 38px; padding-bottom: 40px">
        Производство изделий из композитных материалов
      </div>
      <el-row
        :gutter="20"
        style="background-color: #283d5b; padding-bottom: 30px"
      >
        <el-col
          :span="24"
          style="padding-bottom: 10px; font-size: 30px; color: #577aad"
        >
          Загрузите файлы для расчета
        </el-col>
        <el-col :span="12">
          <UploadModel v-model="file_id" color="#fff" />
        </el-col>
        <el-col :span="12">
          <UploadDrawings v-model="drawing_id" color="#fff" />
        </el-col>
        <el-col :span="24" style="font-size: 20px; color: #577aad">
          Максимальный размер 100Мб
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        style="background-color: #283d5b; padding-bottom: 30px"
      >
        <el-col :offset="0" :span="24" style="color: #577aad">
          <CadShowById v-model="file_id" />
        </el-col>
      </el-row>
      <div style="color: white; font-size: 42px">1,5 ч</div>
      <div style="color: white; font-size: 20px; padding-bottom: 40px">
        Трудоемкость изготовления 1 ед.
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          padding-bottom: 40px;
        "
      >
        <div>
          <div style="color: white; font-size: 40px">1 000 руб</div>
          <div style="color: white; font-size: 20px">
            Стоимость изготовления 1 ед.
          </div>
        </div>
        <div>
          <div style="color: white; font-size: 40px">
            {{ result.total_price }} руб
          </div>
          <div style="color: white; font-size: 20px">
            Стоимость {{ result.quantity }} ед.*
          </div>
        </div>
      </div>
      <div style="color: #577aad; font-size: 20px; padding-bottom: 40px">
        *При увеличении количества единиц в заказе стоимость одного изделия
        становится выгоднее.
      </div>
      <div style="display: flex; justify-content: center">
        <el-button type="primary" plain class="submit" @click="submitOrder">
          Перейти к оформлению >
        </el-button>
      </div>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="15" style="background-color: #e5e5e5; padding-top: 30px">
      <el-row :gutter="5">
        <el-col :offset="2" :span="6">
          <Length v-model="length" />
        </el-col>
        <el-col :offset="1" :span="6">
          <Width v-model="width" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="2" :span="9">
          <MaterialPlastic v-model="material" />
        </el-col>
        <el-col :offset="1" :span="10">
          <PlasticPreparation v-model="plastic_preparation" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="20">
          <CoefficientTooling v-model="k_tooling" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="20">
          <CoefficientOtk v-model="control_type" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding: 30px 0">
        <el-col :offset="2" :span="20">
          <CoefficientCertificate v-model="sert_type" />
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  background-color: #283d5b;
}

.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.submit {
  background-color: #bc2b55;
  border: 1px solid white;
  color: white;
  font-size: 26px;
  padding: 30px 90px;
}
</style>
