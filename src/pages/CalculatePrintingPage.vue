<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { req_urlencoded_auth, req_json_auth } from "../api";

import Length from "../components/coefficients/Length.vue";
import Width from "../components/coefficients/Width.vue";

import CoefficientQuantity from "../components/coefficients/CoefficientQuantity.vue";

import MaterialPrinting from "../components/materials/MaterialPrinting.vue";

import CoefficientOtk from "../components/coefficients/CoefficientOtk.vue";
import CoefficientCertificate from "../components/coefficients/CoefficientCertificate.vue";
import CoefficientCover from "../components/coefficients/CoefficientCover.vue";

import { useRoute, useRouter } from "vue-router";
import UploadModel from "../components/UploadModel.vue";
import UploadDrawings from "../components/UploadDrawings.vue";
// @ts-ignore
import CadShowById from "../components/CadShowById.vue";
import { useProfileStore, type IProfile } from "../stores/profile.store";
import { useAuthStore } from "../stores/auth.store";
import { ElMessage } from "element-plus";
import DialogInfoPayment from "../components/dialog/DialogInfoPayment.vue";
import SuitableMachines from "../components/SuitableMachines.vue";
import Height from "../components/coefficients/Height.vue";
import type {
  IOrderPayload,
  IOrderPostPayload,
  IOrderResponse,
} from "../interfaces/order.interface";

const authStore = useAuthStore();
const profileStore = useProfileStore();

const route = useRoute();
const router = useRouter();
const order_id = computed(() => Number(route.query.orderId) || 0);

let file_id = ref(1);
let document_ids = ref<number[]>([]);

let length = ref(120);
let width = ref(30);
let height = ref(30);
let quantity = ref(1);

let material_id = ref("PA11");
let material_form = ref("powder");

let id_cover = ref<string[]>(['1']);

let k_otk = ref("1");
let k_cert = ref(["a", "f"]);
// Длительность изготовления (в днях)
let manufacturing_cycle = ref<number>(0);
let special_instructions = ref("");

const payload = reactive({
  service_id: "3dprinting",
  file_id,
  document_ids,
  quantity,
  length,
  width,
  height,
  material_id,
  material_form,
  id_cover,
  k_otk,
  k_cert,
  manufacturing_cycle,
});

let result = ref({
  id: 0,
  detail_time: 0,
  detail_price: 0,
  detail_price_one: 0,
  total_price: 0,
  quantity: 1,
  manufacturing_cycle: 0,
  suitable_machines: [],
});

let isInfoVisible = ref(false);
const isLoading = ref<boolean>(true);

// Отправляем запрос на сервер при любом изменении данных
watch(payload, sendData, { deep: true });

onMounted(() => {
  if (order_id.value == 0) {
    sendData(payload);
  } else {
    getOrder(order_id.value);
  }
});

// type sendType = typeof payload;

function isProfileComplete(profile?: IProfile): boolean {
  if (!profile) return false;
  const required: Array<keyof IProfile> = [
    "email",
    "full_name",
    "postal",
    "region",
    "city_name",
    "street",
    "building",
  ];
  return required.every((key) => {
    const v = profile[key] as unknown as string | undefined;
    return typeof v === "string" && v.trim().length > 0;
  });
}

async function ensureProfileLoaded() {
  if (!profileStore.profile) {
    try {
      await profileStore.getProfile();
    } catch (e) {
      console.error(e);
    }
  }
}

async function sendData(payload: IOrderPayload) {
  isLoading.value = true;
  try {
    const res = await req_urlencoded_auth("/anonymous-calc", "POST", payload);
    const data = (await res?.json()) as IOrderResponse;
    result.value = data;
  } catch (error) {
    console.error({ error });
  }
  isLoading.value = false;
}

async function submitOrder(payload: IOrderPayload) {
  if (!authStore.getToken) {
    ElMessage.warning("Необходимо зарегистрироваться!");
    return;
  }
  isLoading.value = true;
  if (order_id.value == 0) {
    try {
      // Для POST запроса преобразуем document_ids в строку
      const postPayload: IOrderPostPayload = {
        ...payload,
        document_ids: JSON.stringify(payload.document_ids),
      };
      const res = await req_urlencoded_auth("/orders", "POST", postPayload);
      const data = (await res?.json()) as IOrderResponse;
      result.value = data;
    } catch (error) {
      console.error({ error });
    }
  } else {
    const id = order_id.value;
    try {
      const res = await req_json_auth(`/orders/${id}`, "PUT", payload);
      const data = (await res?.json()) as IOrderResponse;
      result.value = data;
      console.log("PUT", result.value);
    } catch (error) {
      console.error({ error });
    }
  }
  isLoading.value = false;
  // Проверяем профиль перед переходом к списку заказов
  await ensureProfileLoaded();
  if (!isProfileComplete(profileStore.profile)) {
    ElMessage.warning("Заполните профиль перед оформлением заказа");
    router.push({ name: "profile" });
    return;
  }
  isInfoVisible.value = true;
  router.push({ name: "order-list" });
}

async function getOrder(id: number) {
  isLoading.value = true;
  try {
    const res = await req_json_auth(`/orders/${id}`, "GET");
    const data = (await res?.json()) as IOrderResponse;
    result.value = data;

    // Обновляем все поля из полученного заказа
    if (data.file_id) file_id.value = data.file_id;
    if (data.document_ids) document_ids.value = data.document_ids;
    if (data.length) length.value = data.length;
    if (data.width) width.value = data.width;
    if (data.height) height.value = data.height;
    if (data.quantity) quantity.value = data.quantity;
    if (data.material_id) material_id.value = data.material_id;
    if (data.material_form) material_form.value = data.material_form;
    if (data.id_cover) id_cover.value = Array.isArray(data.id_cover) ? data.id_cover : [data.id_cover];
    if (data.k_otk) k_otk.value = data.k_otk;
    if (data.k_cert) k_cert.value = data.k_cert;
    if (data.manufacturing_cycle)
      manufacturing_cycle.value = data.manufacturing_cycle;
    if (data.special_instructions)
      special_instructions.value = data.special_instructions;

    // Принудительно обновляем payload после изменения всех полей
    Object.assign(payload, {
      service_id: "3dprinting",
      file_id: file_id.value,
      document_ids: document_ids.value,
      quantity: quantity.value,
      length: length.value,
      width: width.value,
      height: height.value,
      material_id: material_id.value,
      material_form: material_form.value,
      id_cover: id_cover.value,
      k_otk: k_otk.value,
      k_cert: k_cert.value,
      manufacturing_cycle: manufacturing_cycle.value,
    });
  } catch (error) {
    console.error({ error });
  }
  isLoading.value = false;
}
</script>

<template>
  <el-row
    :gutter="0"
    class="main-container"
    v-loading="isLoading"
    element-loading-background="rgba(0, 42, 68, 0.8)"
    element-loading-text="Расчет цены..."
    element-loading-custom-class="loading-top"
  >
    <!-- 1. Левая часть -->
    <el-col :offset="3" :span="8" class="left-section">
      <div class="title-text">
        3D ПЕЧАТЬ <br />
        {{ order_id != 0 ? `(заказ ${order_id})` : "" }}
      </div>

      <div class="price-section">
        <div class="price-row">
          <div>Стоимость 1 ед.</div>
          <div>
            {{ Number(result?.detail_price_one ?? 0).toLocaleString() }} р.
          </div>
        </div>
        <div class="price-row">
          <div>Общая стоимость {{ result?.quantity || 0 }} ед.*</div>
          <div>
            <span>
              {{ Number(result?.total_price ?? 0).toLocaleString() }} р.
            </span>
            <span
              v-show="
                Number(result?.detail_price ?? 0) !=
                Number(result?.detail_price_one ?? 0)
              "
            >
              ({{ Number(result?.detail_price ?? 0).toLocaleString() }} р. за 1
              ед.)
            </span>
          </div>
        </div>
        <div v-if="profileStore.profile?.username == 'admin'" class="price-row">
          <div>Трудоемкость</div>
          <div>{{ Number(result?.detail_time ?? 0).toFixed(2) || "?" }} ч.</div>
        </div>
        <div class="price-row-last">
          <div>Длительность изготовления</div>
          <div>{{ result?.manufacturing_cycle }} дн.</div>
        </div>
      </div>
      <div class="disclaimer-text">
        *При увеличении количества единиц в заказе стоимость одного изделия
        становится выгоднее
      </div>
      <el-row :gutter="20" class="component-section">
        <el-col :offset="0" :span="24" class="cad-section">
          <CadShowById v-model="file_id" />
        </el-col>
      </el-row>
      <el-row :gutter="5" class="upload-section">
        <el-col :span="24" class="upload-title">
          Загрузите файлы для расчета
        </el-col>
        <el-col :span="12">
          <UploadModel v-model="file_id" color="#fff" />
        </el-col>
        <el-col :span="12">
          <UploadDrawings v-model="document_ids" color="#fff" />
        </el-col>
        <el-col :span="24" class="upload-info">
          Максимальный размер 100Мб
        </el-col>
        <el-col :span="24">
          <DocumentShowByIds v-model="document_ids" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="upload-section">
        <el-col :span="12">
          <el-button
            type="primary"
            plain
            class="submit"
            @click="router.push({ name: 'order-list' })"
          >
            Отменить
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            plain
            class="submit"
            @click="
              submitOrder({
                ...payload,
                special_instructions: special_instructions,
              })
            "
          >
            {{ order_id != 0 ? "Сохранить заказ" : "Оформить заказ" }}
          </el-button>
        </el-col>
      </el-row>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="13" class="right-section">
      <el-row :gutter="5">
        <el-col :offset="2" :span="5">
          <Length v-model="length" />
        </el-col>
        <el-col :offset="1" :span="5">
          <Width v-model="width" />
        </el-col>
        <el-col :offset="1" :span="5">
          <Height v-model="height" />
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="2" :span="11">
          <MaterialPrinting v-model="material_id" />
        </el-col>
        <el-col :offset="1" :span="5">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-top">
        <el-col :offset="2" :span="20">
          <CoefficientCover v-model="id_cover" />
        </el-col>
      </el-row>

      <el-row
        :gutter="5"
        class="row-spacing-top"
        v-if="profileStore.profile?.username === 'admin'"
      >
        <el-col :offset="2" :span="20">
          <SuitableMachines :machines="result.suitable_machines" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-top">
        <el-col :offset="2" :span="20">
          <CoefficientOtk v-model="k_otk" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-both">
        <el-col :offset="2" :span="20">
          <CoefficientCertificate v-model="k_cert" />
        </el-col>
      </el-row>
      <el-row :gutter="5" class="row-spacing-bottom">
        <el-col :offset="2" :span="17">
          <div class="label">Комментарий</div>
          <el-input
            v-model="special_instructions"
            type="textarea"
            :rows="3"
            placeholder="Укажите особые требования, допуски, упаковку, логистику и т.п."
            :input-style="{ backgroundColor: '#ebf3ff', color: '#000' }"
          />
        </el-col>
      </el-row>
    </el-col>
    <DialogInfoPayment v-model="isInfoVisible" />
  </el-row>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  background-color: #283d5b;
}
:deep(.loading-top .el-loading-spinner) {
  top: 40px;
  margin-top: 0;
  transform: scale(1.5);
  transform-origin: top center;
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
  padding: 30px 0;
  width: 100%;
}

/* Основные цвета и фоны */
.main-container {
  min-height: 500px;
  background-color: var(--left-section-bg);
}

.left-section {
  padding: 30px 50px 40px 20px;
}

.right-section {
  background-color: #fff;
  padding-top: 30px;
}

/* Текстовые стили */
.title-text {
  color: var(--left-section-color);
  font-size: 38px;
  font-weight: 600;
  padding-bottom: 30px;
}

.price-section {
  border-top: 1px solid #577aad;
  border-bottom: 1px solid #577aad;
  font-size: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  color: var(--left-section-color);
  padding: 14px 0;
  border-bottom: 1px solid #577aad;
}

.price-row-last {
  display: flex;
  justify-content: space-between;
  color: var(--left-section-color);
  padding: 14px 0;
}

.disclaimer-text {
  color: #577aad;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

/* Секции с компонентами */
.component-section {
  background-color: var(--left-section-bg);
  padding-bottom: 30px;
}

.upload-section {
  background-color: var(--left-section-bg);
  padding-bottom: 30px;
}

.upload-title {
  padding-bottom: 10px;
  font-size: 30px;
  color: var(--left-section-color);
  /* color: #577aad; */
}

.upload-info {
  font-size: 20px;
  color: #577aad;
}

.cad-section {
  color: #577aad;
}

/* Кнопки и центрирование */
.center-button {
  display: flex;
  justify-content: center;
}

/* Отступы для строк */
.row-spacing-top {
  padding-top: 30px;
}

.row-spacing-bottom {
  padding: 0 0 30px 0;
}

.row-spacing-both {
  padding: 30px 0;
}

/* Стили для комментариев */
.label {
  padding-bottom: 12px;
  color: #283d5b;
  font-size: 24px;
  font-weight: 700;
}
</style>
