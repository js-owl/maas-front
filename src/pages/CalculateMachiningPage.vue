<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { req_json, req_json_auth } from '../api'

// import Length from "../components/coefficients/Length.vue";
// import Width from "../components/coefficients/Width.vue";

import CoefficientQuantity from '../components/coefficients/CoefficientQuantity.vue'

import MaterialMachining from '../components/materials/MaterialMachining.vue'

import CoefficientOtk from '../components/coefficients/CoefficientOtk.vue'
import CoefficientCertificate from '../components/coefficients/CoefficientCertificate.vue'
import CoefficientTolerance from '../components/coefficients/CoefficientTolerance.vue'
import CoefficientFinish from '../components/coefficients/CoefficientFinish.vue'
import CoefficientCover from '../components/coefficients/CoefficientCover.vue'
// import CoefficientSize from "../components/coefficients/CoefficientSize.vue";

import { useRoute } from 'vue-router'
import UploadModel from '../components/cad/UploadModel.vue'
import UploadDrawings from '../components/UploadDrawings.vue'
import DocumentShowByIds from '../components/DocumentShowByIds.vue'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'
import { useProfileStore } from '../stores/profile.store'
import { ElMessage } from 'element-plus'
import DialogInfoPayment from '../components/dialog/DialogInfoPayment.vue'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
import CalculateSubmit from '../components/sections/CalculateSubmit.vue'
// import Height from "../components/coefficients/Height.vue";
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import { locations } from '../helpers/get-location'

const profileStore = useProfileStore()

const route = useRoute()
const order_id = computed(() => Number(route.query.orderId) || 0)

let file_id = ref(4)
let document_ids = ref<number[]>([])

let length = ref(120)
let width = ref(30)
let height = ref(30)
let quantity = ref(1)

// Notify user if quantity exceeds recommended threshold
const hasQuantityWarningShown = ref(false)
watch(quantity, (newVal) => {
  console.log('newVal', newVal)
  const threshold = 999
  if (newVal > threshold && !hasQuantityWarningShown.value) {
    ElMessage.warning('Количество превышает 1000. Свяжитесь с нами для оптового заказа.')
    hasQuantityWarningShown.value = true
  } else if (newVal <= threshold && hasQuantityWarningShown.value) {
    hasQuantityWarningShown.value = false
  }
})
watch(
  document_ids,
  (newVal) => {
    console.log('document_ids', newVal)
  },
  { deep: true },
)

let material_id = ref('alum_D16')
let material_form = ref('rod')

let tolerance_id = ref('4')
let finish_id = ref('3')
let cover_id = ref<string[]>(['1'])
let n_dimensions = ref(55)

let k_otk = ref('1')
let k_cert = ref(['a', 'f'])
// Длительность изготовления (в днях)
let manufacturing_cycle = ref<number>(0)
let special_instructions = ref('')

// Определяем location на основе компании пользователя
const location = computed(() => {
  const companyName = profileStore.profile?.full_name
  console.log('companyName', companyName)
  if (!companyName) return 'location_1'
  
  const foundLocation = locations.find((loc) => loc.company === companyName)
  return foundLocation?.location || 'location_1'
})

const payload = reactive({
  service_id: 'cnc-lathe',
  location,
  file_id,
  document_ids,
  quantity,
  length,
  width,
  height,
  material_id,
  material_form,
  tolerance_id,
  finish_id,
  cover_id,
  n_dimensions,
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

// submitOrder moved to CalculateSubmit component
const onUpdateResult = (d: IOrderResponse) => {
  result.value = d
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
    if (data.tolerance_id) tolerance_id.value = data.tolerance_id
    if (data.finish_id) finish_id.value = data.finish_id
    if (data.cover_id)
      cover_id.value = Array.isArray(data.cover_id) ? data.cover_id : [data.cover_id]
    if (data.n_dimensions) n_dimensions.value = data.n_dimensions
    if (data.k_otk) k_otk.value = data.k_otk
    if (data.k_cert) k_cert.value = data.k_cert
    if (data.manufacturing_cycle) manufacturing_cycle.value = data.manufacturing_cycle
    if (data.special_instructions) special_instructions.value = data.special_instructions

    // Принудительно обновляем payload после изменения всех полей
    Object.assign(payload, {
      service_id: 'cnc-lathe',
      file_id: file_id.value,
      document_ids: document_ids.value,
      quantity: quantity.value,
      length: length.value,
      width: width.value,
      height: height.value,
      material_id: material_id.value,
      material_form: material_form.value,
      tolerance_id: tolerance_id.value,
      finish_id: finish_id.value,
      cover_id: cover_id.value,
      n_dimensions: n_dimensions.value,
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
        ТОКАРНАЯ ОБРАБОТКА <br />
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
        <el-col :span="24" class="upload-model">
          <UploadModel v-model="file_id" color="#000" />
        </el-col>
        <el-col :span="24" class="upload-drawings">
          <UploadDrawings v-model="document_ids" color="#000" />
        </el-col>
        <el-col :span="24" class="upload-info"> Максимальный размер 100Мб </el-col>
        <el-col :span="24">
          <DocumentShowByIds v-model="document_ids" />
        </el-col>
      </el-row>

      <CalculateSubmit
        :order-id="order_id"
        :payload="{ ...payload } as unknown as IOrderPayload"
        :special-instructions="special_instructions"
        @updateResult="onUpdateResult"
        @showInfo="isInfoVisible = true"
      />
    </el-col>

    <!-- 2. Правая часть -->
    <el-col :span="10" :xs="{ span: 24, offset: 0 }" class="right-section">
      <el-row :gutter="5">
        <el-col :offset="0" :span="23" :xs="{ span: 24, offset: 0 }">
          <MaterialMachining v-model="material_id" />
        </el-col>
        <el-col :offset="1" :span="5"> </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :offset="0" :span="7" :xs="{ span: 24, offset: 0 }">
          <!-- <div class="disabled-block"> -->
          <div>
            <CoefficientFinish v-model="finish_id" />
          </div>
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <!-- <div class="disabled-block"> -->
          <div>
            <CoefficientTolerance v-model="tolerance_id" />
          </div>
        </el-col>
        <el-col :offset="1" :span="7" :xs="{ span: 24, offset: 0 }">
          <CoefficientQuantity v-model="quantity" />
        </el-col>
      </el-row>

      <el-row :gutter="5" class="row-spacing-top">
        <el-col :offset="0" :span="23">
          <CoefficientCover v-model="cover_id" />
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

.price-section {
  /* border-top: 1px solid #577aad; */
  /* border-bottom: 1px solid #577aad; */
  font-size: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  background-color: var(--whity);
  color: black;
  margin-bottom: 10px;
  padding: 14px 10px;
  border-radius: 3px;
  /* border-bottom: 1px solid #577aad; */
}

.price-row-last {
  display: flex;
  justify-content: space-between;
  background-color: var(--whity);
  color: black;
  padding: 14px 10px;
  border-radius: 3px;
}

.disclaimer-text {
  color: black;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

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

.upload-model {
  padding-bottom: 20px;
}

.upload-drawings {
  padding-bottom: 20px;
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

  .price-section {
    margin-bottom: 16px;
  }

  .price-row {
    font-size: 16px;
    padding: 8px 0;
  }

  .price-row-last {
    font-size: 16px;
    padding: 8px 0;
  }

  .disclaimer-text {
    font-size: 12px;
    margin-bottom: 16px;
  }

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
