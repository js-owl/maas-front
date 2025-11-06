<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { req_json, req_json_auth } from '../api'

// import Length from "../components/coefficients/Length.vue";
// import Width from "../components/coefficients/Width.vue";

import CoefficientQuantity from '../components/coefficients/CoefficientQuantity.vue'

// import MaterialMilling from "../components/materials/MaterialMilling.vue";

import CoefficientOtk from '../components/coefficients/CoefficientOtk.vue'
import CoefficientCertificate from '../components/coefficients/CoefficientCertificate.vue'
import CoefficientCover from '../components/coefficients/CoefficientCover.vue'
// import CoefficientSize from "../components/coefficients/CoefficientSize.vue";

import { useRoute, useRouter } from 'vue-router'
import UploadModel from '../components/cad/UploadModel.vue'
import UploadDrawings from '../components/UploadDrawings.vue'
import DocumentShowByIds from '../components/DocumentShowByIds.vue'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'
import { useProfileStore, type IProfile } from '../stores/profile.store'
import { useAuthStore } from '../stores/auth.store'
import { ElMessage } from 'element-plus'
import DialogInfoPayment from '../components/dialog/DialogInfoPayment.vue'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
// import Height from "../components/coefficients/Height.vue";
import type {
  IOrderPayload,
  IOrderPostPayload,
  IOrderResponse,
} from '../interfaces/order.interface'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const route = useRoute()
const router = useRouter()
const order_id = computed(() => Number(route.query.orderId) || 0)

let file_id = ref(1)
let document_ids = ref<number[]>([])

let length = ref(120)
let width = ref(30)
let height = ref(30)
let quantity = ref(1)

let material_id = ref('PA11')
let material_form = ref('powder')

let cover_id = ref<string[]>(['1'])
let k_otk = ref('1')
let k_cert = ref(['a', 'f'])
// Длительность изготовления (в днях)
let manufacturing_cycle = ref<number>(0)
let special_instructions = ref('')

const payload = reactive({
  service_id: 'printing',
  file_id,
  document_ids,
  quantity,
  length,
  width,
  height,
  material_id,
  material_form,
  cover_id,
  k_otk,
  k_cert,
  manufacturing_cycle,
})

const result = ref<IOrderResponse | null>(null)

let isInfoVisible = ref(false)
const isLoading = ref<boolean>(true)

// Ensure minimum loading indicator duration
const MIN_LOADING_MS = 1000
let loadingStartedAt = 0
const startLoading = () => {
  loadingStartedAt = Date.now()
  isLoading.value = true
}
const stopLoading = async () => {
  const elapsed = Date.now() - loadingStartedAt
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
  if (remaining > 0) await new Promise((r) => setTimeout(r, remaining))
  isLoading.value = false
}

// Отправляем запрос на сервер при любом изменении данных
watch(payload, sendData, { deep: true })

onMounted(() => {
  if (order_id.value == 0) {
    sendData(payload)
  } else {
    getOrder(order_id.value)
  }
})

// type sendType = typeof payload;

function isProfileComplete(profile?: IProfile): boolean {
  if (!profile) return false
  const required: Array<keyof IProfile> = [
    'email',
    'full_name',
    'postal',
    'region',
    'city_name',
    'street',
    'building',
  ]
  return required.every((key) => {
    const v = profile[key] as unknown as string | undefined
    return typeof v === 'string' && v.trim().length > 0
  })
}

async function ensureProfileLoaded() {
  if (!profileStore.profile) {
    try {
      await profileStore.getProfile()
    } catch (e) {
      console.error(e)
    }
  }
}

async function sendData(payload: IOrderPayload) {
  startLoading()
  try {
    const res = await req_json('/calculate-price', 'POST', payload)
    const data = (await res?.json()) as IOrderResponse
    result.value = data
  } catch (error) {
    console.error({ error })
  }
  await stopLoading()
}

async function submitOrder(payload: IOrderPayload) {
  if (!authStore.getToken) {
    ElMessage.warning('Необходимо зарегистрироваться!')
    return
  }
  startLoading()
  if (order_id.value == 0) {
    try {
      // Для POST запроса преобразуем document_ids в строку
      const postPayload: IOrderPostPayload = {
        ...payload,
        document_ids: payload.document_ids,
      }
      const res = await req_json_auth('/orders', 'POST', postPayload)
      const data = (await res?.json()) as IOrderResponse
      result.value = data
    } catch (error) {
      console.error({ error })
    }
  } else {
    const id = order_id.value
    try {
      const res = await req_json_auth(`/orders/${id}`, 'PUT', payload)
      const data = (await res?.json()) as IOrderResponse
      result.value = data
      console.log('PUT', result.value)
    } catch (error) {
      console.error({ error })
    }
  }
  await stopLoading()
  // Проверяем профиль перед переходом к списку заказов
  await ensureProfileLoaded()
  if (!isProfileComplete(profileStore.profile)) {
    ElMessage.warning('Заполните профиль перед оформлением заказа')
    router.push({ path: '/personal/profile' })
    return
  }
  isInfoVisible.value = true
  router.push({ path: '/personal/orders' })
}

async function getOrder(id: number) {
  startLoading()
  try {
    const res = await req_json_auth(`/orders/${id}`, 'GET')
    const data = (await res?.json()) as IOrderResponse
    result.value = data

    // Обновляем все поля из полученного заказа
    if (data.file_id) file_id.value = data.file_id
    if (data.document_ids) document_ids.value = data.document_ids
    if (data.length) length.value = data.length
    if (data.width) width.value = data.width
    if (data.height) height.value = data.height
    if (data.quantity) quantity.value = data.quantity
    if (data.material_id) material_id.value = data.material_id
    if (data.material_form) material_form.value = data.material_form
    if (data.cover_id)
      cover_id.value = Array.isArray(data.cover_id) ? data.cover_id : [data.cover_id]
    if (data.k_otk) k_otk.value = data.k_otk
    if (data.k_cert) k_cert.value = data.k_cert
    if (data.manufacturing_cycle) manufacturing_cycle.value = data.manufacturing_cycle
    if (data.special_instructions) special_instructions.value = data.special_instructions

    // Принудительно обновляем payload после изменения всех полей
    Object.assign(payload, {
      service_id: 'printing',
      file_id: file_id.value,
      document_ids: document_ids.value,
      quantity: quantity.value,
      length: length.value,
      width: width.value,
      height: height.value,
      material_id: material_id.value,
      material_form: material_form.value,
      cover_id: cover_id.value,
      k_otk: k_otk.value,
      k_cert: k_cert.value,
      manufacturing_cycle: manufacturing_cycle.value,
    })
  } catch (error) {
    console.error({ error })
  }
  await stopLoading()
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
    <el-col :offset="3" :span="8" :xs="{ span: 24, offset: 0 }" class="left-section">
      <div class="title-text">
        3D ПЕЧАТЬ <br />
        {{ order_id != 0 ? `(заказ ${order_id})` : '' }}
      </div>

      <CalculateResults :result="result" />

      <el-row :gutter="20" class="component-section">
        <el-col :offset="0" :span="24" class="cad-section">
          <CadShowById v-model="file_id" />
        </el-col>
      </el-row>
      <el-row :gutter="5" class="upload-section">
        <el-col :span="24" class="upload-title"> Загрузите файлы для расчета </el-col>
        <el-col :span="12">
          <UploadModel v-model="file_id" color="#000" />
        </el-col>
        <el-col :span="12">
          <UploadDrawings v-model="document_ids" color="#000" />
        </el-col>
        <el-col :span="24" class="upload-info"> Максимальный размер 100Мб </el-col>
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
            @click="router.push({ path: '/personal/orders' })"
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
            {{ order_id != 0 ? 'Сохранить заказ' : 'Оформить заказ' }}
          </el-button>
        </el-col>
      </el-row>
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="10" :xs="{ span: 24, offset: 0 }" class="right-section">
      <!--   <el-row :gutter="5">
        <el-col :offset="0" :span="7" :xs="{ span: 24, offset: 0 }">
          <Length v-model="length" />
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <Width v-model="width" />
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <Height v-model="height" />
        </el-col>
      </el-row> -->

      <!-- <el-row :gutter="5">
        <el-col :offset="2" :span="5" :xs="{ span: 24, offset: 0 }" class="disabled-block">
          <CoefficientFinish v-model="finish_id" />
        </el-col>
        <el-col :offset="1" :span="5" :xs="{ span: 24, offset: 0 }" class="disabled-block">
          <CoefficientTolerance v-model="tolerance_id" />
        </el-col>
        <el-col :offset="1" :span="5" :xs="{ span: 24, offset: 0 }" class="disabled-block">
          <CoefficientSize v-model="n_dimensions" />
        </el-col>
      </el-row> -->

      <el-row :gutter="5">
        <el-col :offset="0" :span="15" :xs="{ span: 24, offset: 0 }">
          <MaterialPrinting v-model="material_id" />
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-top">
        <el-col :offset="0" :span="23">
          <CoefficientCover v-model="cover_id" :exclude-labels="['Гальваника']" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-top" v-if="profileStore.profile?.username === 'admin'">
        <el-col :offset="0" :span="23">
          <SuitableMachines :machines="result?.suitable_machines || []" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-top">
        <el-col :offset="0" :span="23">
          <CoefficientOtk v-model="k_otk" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-both">
        <el-col :offset="0" :span="23">
          <CoefficientCertificate v-model="k_cert" />
        </el-col>
      </el-row>
      <el-row :gutter="5" class="row-spacing-bottom">
        <el-col :offset="0" :span="23">
          <div class="coefficient-label">Комментарий</div>
          <el-input
            v-model="special_instructions"
            type="textarea"
            :rows="5"
            placeholder="Укажите особые требования, допуски, упаковку, логистику и т.п."
            :input-style="{ backgroundColor: 'var(--whity)', color: 'black' }"
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
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  color: black;
  font-size: 20px;
  padding: 30px 0;
  width: 100%;
}

/* Основные цвета и фоны */
.main-container {
  min-height: 500px;
  background-color: var(--bgcolor);
}

.left-section {
  margin-bottom: 40px;
  padding: 30px 30px 40px 40px;
  background-color: white;
  border-radius: 20px 0 0 20px;
}

.right-section {
  margin-bottom: 40px;
  padding: 30px 30px 40px 40px;
  background-color: white;
  border-radius: 0 20px 20px 0;
}

/* Текстовые стили */
.title-text {
  color: black;
  font-size: 38px;
  font-weight: 600;
  padding-bottom: 30px;
}

/* price section moved to CalculateResults */

/* Секции с компонентами */
.component-section {
  background-color: white;
  padding-bottom: 30px;
}

.upload-section {
  background-color: white;
  padding-bottom: 30px;
}

.upload-title {
  padding-bottom: 10px;
  font-size: 30px;
  color: black;
  font-weight: 700;
  /* color: #577aad; */
}

.upload-info {
  font-size: 20px;
  color: black;
}

.cad-section {
  color: var(--whity);
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

.disabled-block {
  opacity: 0.5;
  pointer-events: none;
}

@media (max-width: 767px) {
  .main-container {
    min-height: auto;
  }

  .left-section {
    padding: 16px 12px 24px 12px;
  }

  .right-section {
    padding: 16px 12px 24px 12px;
  }

  .title-text {
    font-size: 24px;
    text-align: center;
    padding-bottom: 16px;
  }

  /* price section styles now provided by CalculateResults */

  .upload-section {
    margin-bottom: 16px;
  }

  .upload-title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 12px;
  }

  .upload-info {
    font-size: 12px;
    text-align: center;
    margin-bottom: 12px;
  }

  .submit {
    font-size: 16px;
    padding: 16px 0;
    margin-bottom: 8px;
  }

  .component-section {
    margin-bottom: 16px;
  }

  .coefficient-label {
    font-size: 18px;
    padding-bottom: 8px;
  }
}
</style>
