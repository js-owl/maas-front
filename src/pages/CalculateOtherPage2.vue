<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { req_json, req_json_auth } from '../api'
import { parseFilesQueryToIds } from '../helpers/parse-files'

import Input from '../components/ui/Input.vue'
import DatePicker from '../components/ui/DatePicker.vue'

import SelectCalc from '../components/ui/SelectCalc.vue'

import CoefficientOtk2 from '../components/coefficients/CoefficientOtk2.vue'
  // import CoefficientCertificate from '../components/coefficients/CoefficientCertificate.vue'
  // import CoefficientTolerance from '../components/coefficients/CoefficientTolerance.vue'
  // import CoefficientFinish from '../components/coefficients/CoefficientFinish.vue'
import CoefficientCover2 from '../components/coefficients/CoefficientCover2.vue'
// import CoefficientSize from "../components/coefficients/CoefficientSize.vue";


// import UploadModel from '../components/cad/UploadModel.vue'
// import UploadDrawings from '../components/UploadDrawings.vue'
// import DocumentShowByIds from '../components/DocumentShowByIds.vue'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'
import { useProfileStore } from '../stores/profile.store'
// import DialogInfoPayment from '../components/dialog/DialogInfoPayment.vue'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
// import CalculateSubmit from '../components/sections/CalculateSubmit.vue'
// import Height from "../components/coefficients/Height.vue";
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
// import Loader from '../components/ui/Loader.vue'

const profileStore = useProfileStore()

const route = useRoute()
const order_id = computed(() => Number(route.query.orderId) || 0)
let order_name = ref('')
let order_code = ref('3000.000.001')

let file_id = ref<number | undefined>(undefined)
const cadViewerKey = ref(0)
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

let material_id = ref('alum_D16')
let material_form = ref('sheet')
const materials = ref<Array<{ value: string; label: string }>>([])
let service_id = ref('cnc-milling')
const processes = ref<Array<{ value: string; label: string }>>([])

let tolerance_id = ref('4')
let finish_id = ref('3')
let cover_id = ref<string[]>(['1'])
let n_dimensions = ref(55)

let k_otk = ref('1.0')
let k_cert = ref(['a', 'f'])
// Длительность изготовления (в днях)
let manufacturing_cycle = ref<number>(0)
let manufacturing_deadline = ref<Date | null>(null)
let special_instructions = ref('')

const MS_IN_DAY = 24 * 60 * 60 * 1000
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => new Date(startOfDay(date).getTime() + days * MS_IN_DAY)

const payload = reactive({
  service_id,
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

// Пэйлоад только для расчета (игнорируем order_name, чтобы не дергать /calculate-price)
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
  tolerance_id: payload.tolerance_id,
  finish_id: payload.finish_id,
  cover_id: payload.cover_id,
  n_dimensions: payload.n_dimensions,
  k_otk: payload.k_otk,
  k_cert: payload.k_cert,
  manufacturing_cycle: payload.manufacturing_cycle,
}))

// Отправляем запрос на сервер при изменении значимых для расчета данных
watch(
  calculationPayload,
  (newVal) => {
    sendData(newVal as unknown as IOrderPayload)
  },
  { deep: true }
)

onMounted(() => {
  loadMaterials()
  loadProcesses()
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
      // file_id.value = 2
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
    const response = await req_json_auth('/materials?process=cnc-milling', 'GET')
    if (response?.ok) {
      const backendMaterials = (await response.json()) as {
        materials: Array<{ id: string; label: string }>
      }
      materials.value = transformMaterials(backendMaterials)
    }
  } catch (error) {
    console.error('Error loading materials:', error)
    materials.value = [
      {
        value: 'alum_D16T',
        label: 'Алюминий Д16Т',
      },
      {
        value: 'steel_12X18H10T',
        label: 'Сталь 12Х18Н10Т',
      },
    ]
  }
}

type OtherService = {
  id: string
  label: string
  service: string
}

type OtherServicesResponse = {
  other_services: OtherService[]
}

async function loadProcesses() {
  try {
    const res = await req_json('/other_services', 'GET')
    if (res?.ok) {
      const data = (await res.json()) as OtherServicesResponse | OtherService[]
      const services = Array.isArray(data)
        ? data
        : Array.isArray(data?.other_services)
          ? data.other_services
          : []

      processes.value = services.map((item) => ({
        value: item.service,
        label: item.label,
      }))
    }
  } catch (error) {
    console.error('Error loading processes:', error)
  } finally {
    if (!processes.value.length) {
      processes.value = [{ value: 'cnc-milling', label: 'Механообработка' }]
    }
    const hasCurrent = processes.value.some((item) => item.value === service_id.value)
    if (!hasCurrent) {
      service_id.value = processes.value[0].value
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
    if (data.service_id) service_id.value = data.service_id
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
    manufacturing_deadline.value = addDays(new Date(), manufacturing_cycle.value)
    if (data.special_instructions) special_instructions.value = data.special_instructions
    if (data.order_name) order_name.value = data.order_name
    if ((data as any).order_code) order_code.value = (data as any).order_code

    // Принудительно обновляем payload после изменения всех полей
    Object.assign(payload, {
      service_id: service_id.value,
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

watch(file_id, () => {
  cadViewerKey.value += 1
})
</script>

<template>
  <section
    class="milling-page"
    v-loading="isLoading"
    element-loading-text="Пересчитываем стоимость..."
  >
    <el-row :gutter="0" class="milling-page__row">
      <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }" >
        <div class="milling-page__card">
          <div class="milling-page__main">
            <div class="milling-field-grid">
              <div class="milling-field-group">
                <div class="milling-field-title">Количество, шт</div>
                <Input
                  v-model="quantityInput"
                  type="number"
                  placeholder="Введите количество"
                />
              </div>
              <div class="milling-field-group">
                <div class="milling-field-title">Сроки выполнения</div>
                <DatePicker
                  v-model="manufacturing_deadline"
                  v-model:manufacturing-cycle="manufacturing_cycle"
                  placeholder="Выберите дату"
                />
              </div>
            </div>

            <div class="milling-field-group">
              <div class="milling-field-title">Материал</div>
              <SelectCalc v-model="material_id" :input-data="materials" />
            </div>

            <div class="milling-field-group">
              <div class="milling-field-title">Технология</div>
              <SelectCalc v-model="service_id" :input-data="processes" />
            </div>

            <!-- <div class="milling-field-grid">
              <div class="milling-field-group">
                <CoefficientFinish v-model="finish_id" />
              </div>
              <div class="milling-field-group">
                <CoefficientTolerance v-model="tolerance_id" />
              </div>
            </div> -->

            <div class="milling-field-block">
              <div class="milling-field-title">Финишная обработка изделия</div>
              <CoefficientCover2 v-model="cover_id" />
            </div>

            <div class="milling-field-block milling-field-block--otk">
              <div class="milling-field-title">Вид контроля</div>
              <CoefficientOtk2 v-model="k_otk" />
            </div>

            <!-- <div class="milling-field-block">
              <CoefficientCertificate v-model="k_cert" />
            </div> -->

            <div
              class="milling-field-block"
              v-if="profileStore.profile?.username === 'admin'"
            >
              <SuitableMachines :machines="result?.suitable_machines || []" />
            </div>

            <div class="milling-field-block">
              <div class="milling-field-title">Описание заказа</div>
              <el-input
                v-model="special_instructions"
                type="textarea"
                :rows="5"
                placeholder=""
              />
            </div>

            <div class="milling-actions">
              <CalculateSubmit2
                :order-id="order_id"
                :payload="{ ...payload } as unknown as IOrderPayload"
                :special-instructions="special_instructions"
                @updateResult="onUpdateResult"
                @showInfo="isInfoVisible = true"
              />
            </div>
          </div>

          <aside class="milling-page__aside">
            <CalculateResults :result="result" />

            <div v-if="file_id" class="milling-cad">
              <CadShowById :key="cadViewerKey" v-model="file_id" />
            </div>

            <div class="milling-upload">
              <div class="milling-upload__title">Загрузите файлы</div>
              <UploadFiles2
                v-model="document_ids"
                color="#000"
                :hide-formats-text="true"
                v-model:stp_id="file_id"
                class="upload-files-bordered"
              />
              <!-- <UploadModel v-model="file_id" color="#000" />
              <UploadDrawings v-model="document_ids" color="#000" /> -->
              <DocumentShowByIds2 v-model="document_ids" />
            </div>
          </aside>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<style scoped>
.milling-page {
  padding: 0px 0 40px;
  min-height: 300px;
  background-color: var(--bgcolor);
}

.milling-page__row {
  width: 100%;
}

.milling-page__card {
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

.milling-page__main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.milling-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.milling-field-group,
.milling-field-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px 0;
}

.milling-field-block--otk {
  max-width: 822px;
  gap: 20px;
}

.milling-field-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  color: #000;
}


.milling-actions {
  padding-top: 6px;
}

.milling-page__aside {
  background: var(--bgcolor);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.milling-cad {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.milling-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milling-upload__title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  color: #000;
}

:deep(.el-textarea__inner) {
  min-height: 150px !important;
  border-radius: 10px;
  background: var(--whity);
  box-shadow: none;
  border: 0;
}

@media (max-width: 1199px) {
  .milling-page__card {
    width: 100%;
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 767px) {
  .milling-page {
    padding: 16px 0 20px;
  }

  .milling-page__row {
    box-sizing: border-box;
  }

  .milling-page__card {
    width: 100%;
    max-width: 100%;
    padding: 14px;
    border-radius: 0px;
    gap: 16px;
    box-shadow: 0 6px 10px 0 var(--button);
    overflow-x: hidden;
  }

  .milling-page__main {
    gap: 16px;
  }

  .milling-field-group,
  .milling-field-block {
    gap: 8px;
    padding: 2px 0;
  }

  .milling-field-block--otk {
    gap: 12px;
    max-width: 100%;
  }

  .milling-field-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .milling-field-title,
  .milling-upload__title {
    font-size: 18px;
    line-height: 1.2;
  }

  .milling-page__aside {
    padding: 12px;
    border-radius: 14px;
    gap: 14px;
  }

  .milling-upload {
    gap: 10px;
  }

  .milling-actions {
    padding-top: 0;
  }

  .milling-cad {
    border-radius: 8px;
  }

  :deep(.el-textarea__inner) {
    min-height: 120px !important;
  }
}
</style>
