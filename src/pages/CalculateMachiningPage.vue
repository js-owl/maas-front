<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { fetchWithoutAuth, fetchWithAuth, req_json_auth } from "../api";

import Length from "../components/coefficients/Length.vue";
import Diameter from "../components/coefficients/Diameter.vue";
import CoefficientQuantity from "../components/coefficients/CoefficientQuantity.vue";

import MaterialMachining from "../components/materials/MaterialMachining.vue";

import CoefficientOtk from "../components/coefficients/CoefficientOtk.vue";
import CoefficientCertificate from "../components/coefficients/CoefficientCertificate.vue";
import CoefficientTolerance from "../components/coefficients/CoefficientTolerance.vue";
import CoefficientFinish from "../components/coefficients/CoefficientFinish.vue";
import CoefficientCover from "../components/coefficients/CoefficientCover.vue";
import CoefficientSize from "../components/coefficients/CoefficientSize.vue";

import router from "../router";
import { useRoute } from "vue-router";
import UploadModel from "../components/UploadModel.vue";
import UploadDrawings from "../components/UploadDrawings.vue";
// @ts-ignore
import CadShowById from "../components/CadShowById.vue";

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
  detail_price: number;
  total_price: number;
  detail_time: number;
  total_time: number;
  created_at: string;
  updated_at: string;
}

const route = useRoute();
const order_id = computed(() => Number(route.query.orderId) || 0);

let file_id = ref(3);
let drawing_id = ref(1);

let length = ref(120);
let width = ref(30);
let quantity = ref(1);

let material = ref("alum");

const k_complexity = ref(0.75);
let k_tolerance = ref(1);
let k_finish = ref(1);
let k_cover = ref(1);
let k_size = ref(55);

let k_otk = ref("1.3");
let k_cert = ref(["a", "f"]);

const payload = reactive({
  service_id: 4,
  file_id,
  quantity,
  length,
  width,
  height: width,
  material_preference: material,
  k_complexity,
  k_tolerance,
  k_finish,
  k_cover,
  n_dimensions: k_size,
  k_otk,
  k_cert,
  special_instructions: "aaa",
});

let result = ref({
  detail_time: 0,
  detail_price: 0,
  total_price: 0,
  quantity: 1,
});

// Отправляем запрос на сервер при любом изменении данных
// watch(payload, sendData, { deep: true });

onMounted(() => {
  console.log("Mach - onMounted", order_id.value);
  if (order_id.value == 0) {
    sendData(payload);
  } else {
    getOrder(order_id.value);
  }
});

type sendType = typeof payload;

async function sendData(payload: sendType) {
  try {
    const res = await fetchWithoutAuth("/anonymous-calc", "POST", payload);
    const data = (await res.json()) as FormResponse;
    result.value = data;
  } catch (error) {
    console.error({ error });
  }
}

async function submitOrder(payload: sendType) {
  try {
    const res = await fetchWithAuth("/orders", "POST", payload);
    const data = (await res.json()) as FormResponse;
    result.value = data;
  } catch (error) {
    console.error({ error });
  }
  router.push({ name: "order-list" });
}

async function getOrder(id: number) {
  try {
    const res = await req_json_auth(`/orders/${id}`, "GET");
    const data = (await res.json()) as FormResponse;
    result.value = data;
    
    // Обновляем все поля из полученного заказа
    if (data.quantity) quantity.value = data.quantity;
    if (data.file_id) file_id.value = data.file_id;
    if (data.material_preference) material.value = data.material_preference;
    
    // Обновляем размеры, если они есть в данных
    if (data.dimensions) {
      try {
        const dimensions = JSON.parse(data.dimensions);
        if (dimensions.length) length.value = dimensions[0];
        if (dimensions.width) width.value = dimensions.width;
      } catch (e) {
        console.warn("Failed to parse dimensions:", e);
      }
    }
    
    // Принудительно обновляем payload после изменения всех полей
    Object.assign(payload, {
      service_id: 4,
      file_id: file_id.value,
      quantity: quantity.value,
      length: length.value,
      width: width.value,
      height: width.value,
      material_preference: material.value,
      k_complexity: k_complexity.value,
      k_tolerance: k_tolerance.value,
      k_finish: k_finish.value,
      k_cover: k_cover.value,
      n_dimensions: k_size.value,
      k_otk: k_otk.value,
      k_cert: k_cert.value,
      special_instructions: "aaa",
    });
    
    // Обновляем result.quantity для отображения в шаблоне
    if (data.quantity) {
      result.value.quantity = data.quantity;
    }
    
    console.log("getOrder", quantity.value, payload);
    
    // Отправляем обновленные данные для пересчета
    await sendData(payload);
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
        Токарная обработка
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
      <div style="color: white; font-size: 42px">
        {{ Number(result?.detail_time ?? 0).toFixed(0) }} ч
      </div>
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
          <div style="color: white; font-size: 40px">
            {{ Number(result?.detail_price ?? 0).toFixed(0) }} руб
          </div>
          <div style="color: white; font-size: 20px">
            Стоимость изготовления 1 ед.
          </div>
        </div>
        <div>
          <div style="color: white; font-size: 40px">
            {{ Number(result?.total_price ?? 0).toFixed(0) }} руб
          </div>
          <div style="color: white; font-size: 20px">
            Стоимость {{ result?.quantity || 0 }} ед.*
          </div>
        </div>
      </div>
      <div style="color: #577aad; font-size: 20px; padding-bottom: 40px">
        *При увеличении количества единиц в заказе стоимость одного изделия
        становится выгоднее.
      </div>
      <div style="display: flex; justify-content: center">
        <el-button
          type="primary"
          plain
          class="submit"
          @click="submitOrder(payload)"
        >
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
          <Diameter v-model="width" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="2" :span="6">
          <CoefficientFinish v-model="k_finish" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientCover v-model="k_cover" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientTolerance v-model="k_tolerance" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="2" :span="13">
          <MaterialMachining v-model="material" />
        </el-col>
        <el-col :offset="1" :span="6">
          <CoefficientSize v-model="k_size"
        /></el-col>
      </el-row>

      <el-row :gutter="5" style="padding-top: 30px">
        <el-col :offset="2" :span="20">
          <CoefficientOtk v-model="k_otk" />
        </el-col>
      </el-row>

      <el-row :gutter="5" style="padding: 30px 0">
        <el-col :offset="2" :span="20">
          <CoefficientCertificate v-model="k_cert" />
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
