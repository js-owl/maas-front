<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { req_json, req_json_auth } from '../api'
import { parseFilesQueryToIds } from '../helpers/parse-files'

import CoefficientOtk2 from '../components/coefficients/CoefficientOtk2.vue'
// import CoefficientCertificate from '../components/coefficients/CoefficientCertificate.vue'
import CoefficientCover2 from '../components/coefficients/CoefficientCover2.vue'
import SelectCalc from '../components/ui/SelectCalc.vue'
import Input from '../components/ui/Input.vue'
import DatePicker from '../components/ui/DatePicker.vue'

import { useRoute } from 'vue-router'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'
import { useProfileStore } from '../stores/profile.store'
import DialogInfoPayment from '../components/dialog/DialogInfoPayment.vue'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
import CalculateSubmit2 from '../components/sections/CalculateSubmit2.vue'
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import Loader from '../components/ui/Loader.vue'

const profileStore = useProfileStore()

const route = useRoute()
const order_id = computed(() => Number(route.query.orderId) || 0)
let order_name = ref('')
let order_code = ref('3000.000.001')

let file_id = ref<number | undefined>(undefined)
let document_ids = ref<number[]>([])

let length = ref(120)
let width = ref(30)
let height = ref(30)
let quantity = ref(1)
const quantityInput = computed({
  get: () => String(quantity.value),
  set: (value: string) => {
    const parsedValue = Number(value)
    quantity.value = Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1
  },
})

let material_id = ref('PA11')
let material_form = ref('powder')
const printing_technology = ref('sls')
const printingTechnologies = ref<Array<{ value: string; label: string }>>([
  { value: 'sls', label: 'SLS (послойное лазерное спекание)' },
])
const materials = ref<Array<{ value: string; label: string }>>([
  { value: 'PA11', label: 'Полиамид PA11' },
])

let cover_id = ref<string[]>(['1'])
let k_otk = ref('1.0')
let k_cert = ref(['a', 'f'])
let manufacturing_cycle = ref<number>(0)
let manufacturing_deadline = ref<Date | null>(null)
let special_instructions = ref('')

const MS_IN_DAY = 24 * 60 * 60 * 1000
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => new Date(startOfDay(date).getTime() + days * MS_IN_DAY)

const payload = reactive({
  service_id: 'printing',
  order_name,
  order_code,
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

const calculationPayload = computed(() => ({
  service_id: payload.service_id,
  file_id: payload.file_id,
  document_ids: payload.document_ids,
  quantity: payload.quantity,
  length: payload.length,
  width: payload.width,
  height: payload.height,
  material_id: payload.material_id,
  material_form: payload.material_form,
  cover_id: payload.cover_id,
  k_otk: payload.k_otk,
  k_cert: payload.k_cert,
  manufacturing_cycle: payload.manufacturing_cycle,
}))

watch(
  calculationPayload,
  (newVal) => {
    sendData(newVal as unknown as IOrderPayload)
  },
  { deep: true }
)

onMounted(() => {
  loadMaterials()
  manufacturing_deadline.value = addDays(new Date(), manufacturing_cycle.value)
  if (order_id.value === 0) {
    const filesQuery = route.query.files
    const stpParam = route.query.stp

    const ids = parseFilesQueryToIds(filesQuery)
    if (ids.length > 0) {
      document_ids.value = ids
    }

    if (filesQuery) {
      if (stpParam) {
        const stpId = Array.isArray(stpParam) ? stpParam[0] : stpParam
        const parsedStpId = Number(stpId)
        if (!Number.isNaN(parsedStpId)) {
          file_id.value = parsedStpId
        }
      }
    } else {
      file_id.value = 1
    }

    sendData(calculationPayload.value as unknown as IOrderPayload)
  } else {
    getOrder(order_id.value)
  }
})

const transformMaterials = (data: { materials: Array<{ id: string; label: string }> }) =>
  data.materials.map((item) => ({
    value: item.id,
    label: item.label,
  }))

async function loadMaterials() {
  try {
    const response = await req_json_auth('/materials?process=printing', 'GET')
    if (response?.ok) {
      const backendMaterials = (await response.json()) as {
        materials: Array<{ id: string; label: string }>
      }
      materials.value = transformMaterials(backendMaterials)
      if (!materials.value.some((item) => item.value === material_id.value) && materials.value.length) {
        material_id.value = materials.value[0].value
      }
    }
  } catch (error) {
    console.error('Error loading materials:', error)
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

const onUpdateResult = (d: IOrderResponse) => {
  result.value = d
}

async function getOrder(id: number) {
  startLoading()
  try {
    const res = await req_json_auth(`/orders/${id}`, 'GET')
    const data = (await res?.json()) as IOrderResponse
    result.value = data

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
    manufacturing_deadline.value = addDays(new Date(), manufacturing_cycle.value)
    if (data.special_instructions) special_instructions.value = data.special_instructions
    if (data.order_name) order_name.value = data.order_name
    if ((data as any).order_code) order_code.value = (data as any).order_code

    Object.assign(payload, {
      service_id: 'printing',
      order_name: order_name.value,
      order_code: order_code.value,
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

watch(
  manufacturing_cycle,
  (days) => {
    manufacturing_deadline.value = addDays(new Date(), Math.max(0, Number(days) || 0))
  },
  { immediate: true }
)
</script>

<template>
  <Loader :loading="isLoading" text="Расчет цены...">
    <section class="printing-page">
      <el-row :gutter="0" class="printing-page__row">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <div class="printing-page__card">
            <div class="printing-page__main">
              <!-- <div class="printing-title">
                <div v-if="order_id != 0" class="printing-title__inputs">
                  <el-input
                    v-model="order_code"
                    placeholder="Код заказа"
                    class="printing-title__input"
                    style="margin-top: 8px"
                  />
                  <el-input
                    v-model="order_name"
                    placeholder="Название заказа"
                    class="printing-title__input"
                  />
                  {{ order_id != 0 ? `(заказ ${order_id})` : '' }}
                </div>
                <div v-else class="printing-title__text">3D ПЕЧАТЬ</div>
              </div> -->

              <div class="printing-field-grid">
                <div class="printing-field-group">
                  <div class="printing-field-title">Количество, шт</div>
                  <Input
                    v-model="quantityInput"
                    type="number"
                    placeholder="Введите количество"
                  />
                </div>
                <div class="printing-field-group">
                  <div class="printing-field-title">Сроки выполнения</div>
                  <DatePicker
                    v-model="manufacturing_deadline"
                    v-model:manufacturing-cycle="manufacturing_cycle"
                    placeholder="Выберите дату"
                  />
                </div>
              </div>

              <div class="printing-field-group">
                <div class="printing-field-title">Материал</div>
                <SelectCalc v-model="material_id" :input-data="materials" />
              </div>

              <div class="printing-field-group">
                <div class="printing-field-title">Технология печати</div>
                <SelectCalc v-model="printing_technology" :input-data="printingTechnologies" />
              </div>

              <div class="printing-field-block">
                <div class="printing-field-title">Финишная обработка изделия</div>
                <CoefficientCover2 v-model="cover_id" :exclude-labels="['Гальваника']" />
              </div>

              <div class="printing-field-block printing-field-block--otk">
                <div class="printing-field-title">Вид контроля</div>
                <CoefficientOtk2 v-model="k_otk" />
              </div>

              <!-- <div class="printing-field-block">
                <CoefficientCertificate v-model="k_cert" />
              </div> -->

              <div class="printing-field-block">
                <div class="printing-field-title">Описание заказа</div>
                <el-input
                  v-model="special_instructions"
                  type="textarea"
                  :rows="5"
                  placeholder=""
                />
              </div>

              
              <div
                class="printing-field-block"
                v-if="profileStore.profile?.username === 'admin'"
              >
                <SuitableMachines :machines="result?.suitable_machines || []" />
              </div>

              <div class="printing-actions">
                <CalculateSubmit2
                  :order-id="order_id"
                  :payload="{ ...payload } as unknown as IOrderPayload"
                  :special-instructions="special_instructions"
                  @updateResult="onUpdateResult"
                  @showInfo="isInfoVisible = true"
                />
              </div>
            </div>

            <aside class="printing-page__aside">
              <CalculateResults :result="result" />

              <div v-if="file_id" class="printing-cad">
                <CadShowById v-model="file_id" />
              </div>

              <div class="printing-upload">
                <div class="printing-upload__title">Загрузите файлы</div>
                <UploadFiles2
                  v-model="document_ids"
                  color="#000"
                  :hide-formats-text="true"
                  v-model:stp_id="file_id"
                  class="upload-files-bordered"
                />
                <DocumentShowByIds2 v-model="document_ids" />
              </div>
            </aside>
          </div>
        </el-col>
      </el-row>
      <DialogInfoPayment v-model="isInfoVisible" />
    </section>
  </Loader>
</template>

<style scoped>
.printing-page {
  padding: 0px 0 40px;
  min-height: 300px;
  background-color: var(--bgcolor);
}

.printing-page__row {
  width: 100%;
}

.printing-page__card {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 30px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 15px 0 var(--button);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
}

.printing-page__main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.printing-title {
  color: black;
  font-size: 28px;
  font-weight: 600;
}

.printing-title__inputs {
  width: 100%;
}

.printing-title__input :deep(.el-input__wrapper) {
  padding: 0;
  box-shadow: none;
  background-color: transparent;
  border: none;
}

.printing-title__input :deep(.el-input__wrapper:hover) {
  box-shadow: none;
}

.printing-title__input :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border: none;
}

.printing-title__input :deep(.el-input__inner) {
  padding: 0;
  font-size: 28px;
  font-weight: 600;
  color: black;
}

.printing-title__input :deep(.el-input__inner::placeholder) {
  color: rgba(0, 0, 0, 0.4);
}

.printing-title__text {
  font-size: 38px;
}

.printing-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.printing-field-group,
.printing-field-block {
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.printing-field-block--otk {
  max-width: 822px;
  gap: 20px;
}

.printing-field-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  color: #000;
}

.printing-actions {
  padding-top: 6px;
}

.printing-page__aside {
  background: var(--bgcolor);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.printing-cad {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.printing-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.printing-upload__title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  color: #000;
}

.upload-files-bordered :deep(.upload) {
  border: 2px dashed #7d8083;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

:deep(.el-textarea__inner) {
  min-height: 150px !important;
  border-radius: 10px;
  background: var(--whity);
  box-shadow: none;
  border: 0;
}

@media (max-width: 1199px) {
  .printing-page__card {
    width: 100%;
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 767px) {
  .printing-page {
    padding: 16px 0 20px;
  }

  .printing-page__row {
    box-sizing: border-box;
  }

  .printing-page__card {
    width: 100%;
    max-width: 100%;
    padding: 14px;
    border-radius: 0px;
    gap: 16px;
    box-shadow: 0 6px 10px 0 var(--button);
    overflow-x: hidden;
  }

  .printing-page__main {
    gap: 16px;
  }

  .printing-field-group,
  .printing-field-block {
    gap: 8px;
    padding: 2px 0;
  }

  .printing-field-block--otk {
    gap: 12px;
    max-width: 100%;
  }

  .printing-field-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .printing-field-title,
  .printing-upload__title {
    font-size: 18px;
    line-height: 1.2;
  }

  .printing-title {
    font-size: 24px;
  }

  .printing-title__input :deep(.el-input__inner) {
    font-size: 24px;
  }

  .printing-title__text {
    font-size: 24px;
    text-align: center;
  }

  .printing-page__aside {
    padding: 12px;
    border-radius: 14px;
    gap: 14px;
  }

  .printing-upload {
    gap: 10px;
  }

  .printing-actions {
    padding-top: 0;
  }

  .printing-cad {
    border-radius: 8px;
  }

  :deep(.el-textarea__inner) {
    min-height: 120px !important;
  }
}
</style>
