<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { req_json, req_json_auth } from '../api'
import { getLocalStpFileById } from '../helpers/local-stp-files'
import { parseFilesQueryToIds } from '../helpers/parse-files'
import { locations } from '../helpers/get-location'
import Input from '../components/ui/Input.vue'
import SelectCalc from '../components/ui/SelectCalc.vue'
import SelectGroup from '../components/ui/SelectGroup.vue'
import CoefficientOtk2 from '../components/coefficients/CoefficientOtk2.vue'
import { useProfileStore } from '../stores/profile.store'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import Loader from '../components/ui/Loader.vue'
import { toMaterialOptionGroupsByFamily } from '../helpers/material-family'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'

const profileStore = useProfileStore()

const route = useRoute()
const order_id = computed(() => Number(route.query.orderId) || 0)
const order_name = ref('')
const order_code = ref('3000.000.001')

const file_id = ref<number | undefined>(undefined)
const cadViewerKey = ref(0)
const document_ids = ref<number[]>([])

const quantity = ref(1)
const quantityInput = computed({
  get: () => String(quantity.value),
  set: (value: string) => {
    const parsedValue = Number(value)
    quantity.value = Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1
  },
})

const material_id = ref('')
type BackendMaterial = { id: string; label: string; family?: string | null }
type MaterialOption = { value: string; label: string }
type MaterialOptionGroup = { label: string; options: MaterialOption[] }
const materials = ref<MaterialOptionGroup[]>([])

const service_id = ref('electroplating_auto')

type SelectOption = {
  value: string
  label: string
}

type OperationAvailable = {
  id: string
  group: string
  path: string[]
  label: string
  max_part_size_label: string
  max_weight_kg: number
}

type OperationsAvailableResponse = {
  values?: OperationAvailable[]
  data?: {
    values?: OperationAvailable[]
  }
}

const operationsAvailable = ref<OperationAvailable[]>([])
const process_id = ref('')
const electroplating_process_id = ref('')

const coating_thickness_microns = ref(9)
const coatingThicknessInput = computed({
  get: () => String(coating_thickness_microns.value),
  set: (value: string) => {
    const parsedValue = Number(value)
    coating_thickness_microns.value =
      Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 9
  },
})

const coatingProcesses = computed<SelectOption[]>(() => {
  const groups = new Set<string>()

  return operationsAvailable.value.reduce<SelectOption[]>((options, operation) => {
    if (groups.has(operation.group)) return options

    groups.add(operation.group)
    options.push({ value: operation.id, label: operation.group })
    return options
  }, [])
})

const selectedProcessOperation = computed(() =>
  operationsAvailable.value.find((operation) => operation.id === process_id.value)
)

const selectedGroupOperations = computed(() => {
  const group = selectedProcessOperation.value?.group
  if (!group) return []

  return operationsAvailable.value.filter((operation) => operation.group === group)
})

const coatingTypes = computed<SelectOption[]>(() =>
  selectedGroupOperations.value
    .filter((operation) => operation.path.length > 0)
    .map((operation) => ({
      value: operation.id,
      label: operation.path.length > 1 ? operation.path.join(' / ') : operation.path[0],
    }))
)

const selectedOperation = computed(() =>
  operationsAvailable.value.find((operation) => operation.id === electroplating_process_id.value)
)

const technicalRestrictions = computed(() => {
  if (!selectedOperation.value) return []

  return [
    `Макс. размер 1 ед. изделия, мм: ${selectedOperation.value.max_part_size_label}`,
    `Макс. масса 1 ед. изделия, кг: ${selectedOperation.value.max_weight_kg}`,
  ]
})

const location = computed(() => {
  const companyName = profileStore.profile?.username
  if (!companyName) return 'location_1'

  const foundLocation = locations.find((loc) => loc.company === companyName)
  return foundLocation?.location || 'location_1'
})

const k_otk = ref('1.0')
const special_instructions = ref('')

const payload = reactive({
  service_id: 'electroplating_auto',
  order_name,
  order_code,
  location,
  file_id,
  document_ids,
  quantity,
  material_id,
  electroplating_process_id,
  coating_thickness_microns,
  k_otk,
})

const result = ref<IOrderResponse | null>(null)

const isInfoVisible = ref(false)
const isLoading = ref<boolean>(true)
const isBootstrapping = ref(true)
const isMaterialsLoading = ref(false)

const isMaterialInList = computed(() => {
  const flat = materials.value.flatMap((g) => g.options)
  return flat.some((item) => item.value === material_id.value)
})

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

const localStpFile = computed(() => getLocalStpFileById(file_id.value))

const calculationPayload = computed(() => {
  const fileFields = localStpFile.value
    ? {
        file_type: localStpFile.value.file_type,
        file_name: localStpFile.value.file_name,
        file_data: localStpFile.value.file_data,
      }
    : {
        file_id: payload.file_id,
      }

  return {
    service_id: payload.service_id,
    location: payload.location,
    ...fileFields,
    document_ids: payload.document_ids,
    quantity: payload.quantity,
    material_id: payload.material_id,
    electroplating_process_id: payload.electroplating_process_id,
    coating_thickness_microns: payload.coating_thickness_microns,
    k_otk: String(payload.k_otk),
  }
})

watch(
  electroplating_process_id,
  (id, oldId) => {
    if (!id || isBootstrapping.value || id === oldId) return
    isMaterialsLoading.value = true
    materials.value = []
  },
  { flush: 'sync' }
)

watch(
  calculationPayload,
  (newVal) => {
    if (
      isBootstrapping.value ||
      isMaterialsLoading.value ||
      !electroplating_process_id.value ||
      !material_id.value ||
      !isMaterialInList.value
    ) {
      return
    }

    sendData(newVal as unknown as IOrderPayload)
  },
  { deep: true }
)

onMounted(async () => {
  try {
    await loadOperationsAvailable()
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
        file_id.value = 2
      }
    } else {
      await getOrder(order_id.value)
    }
    await loadMaterials()
  } finally {
    isBootstrapping.value = false
  }
})

const transformMaterials = (data: { materials: BackendMaterial[] }) =>
  toMaterialOptionGroupsByFamily(data.materials)

async function loadMaterials() {
  if (!electroplating_process_id.value) {
    materials.value = []
    return
  }

  isMaterialsLoading.value = true
  try {
    const response = await req_json_auth(
      `/materials?process=electroplating_auto&electroplating_process_id=${encodeURIComponent(electroplating_process_id.value)}`,
      'GET'
    )
    if (!response?.ok) return

    const backendMaterials = (await response.json()) as {
      materials: BackendMaterial[]
    }
    materials.value = transformMaterials(backendMaterials)
    const flat = materials.value.flatMap((g) => g.options)
    if (!flat.length) return

    material_id.value = flat[0].value
    await sendData(calculationPayload.value as unknown as IOrderPayload)
  } catch (error) {
    console.error('Error loading materials:', error)
  } finally {
    isMaterialsLoading.value = false
  }
}

async function loadOperationsAvailable() {
  try {
    const response = await req_json_auth(
      '/operations_available?service_id=electroplating_auto',
      'GET'
    )
    if (!response?.ok) return

    const backendOperations = (await response.json()) as OperationsAvailableResponse
    operationsAvailable.value = backendOperations.data?.values ?? backendOperations.values ?? []

    if (!coatingProcesses.value.some((item) => item.value === process_id.value)) {
      process_id.value = coatingProcesses.value[0]?.value ?? ''
    }

    syncSelectedProcess()
  } catch (error) {
    console.error('Error loading electroplating operations:', error)
  }
}

function syncSelectedProcess() {
  const firstCoating =
    coatingTypes.value[0]?.value ?? selectedGroupOperations.value[0]?.id ?? ''

  if (order_id.value === 0 && firstCoating) {
    electroplating_process_id.value = firstCoating
    return
  }

  if (coatingTypes.value.some((item) => item.value === electroplating_process_id.value)) return

  if (firstCoating) {
    electroplating_process_id.value = firstCoating
  }
}

async function sendData(currentPayload: IOrderPayload) {
  startLoading()
  try {
    const res = await req_json('/calculate-price', 'POST', currentPayload)
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
    if (data.quantity) quantity.value = data.quantity
    if (data.material_id) material_id.value = data.material_id

    const orderProcessId =
      (data as { electroplating_process_id?: string }).electroplating_process_id ??
      data.cover_id
        ? Array.isArray(data.cover_id)
          ? data.cover_id[0]
          : data.cover_id
        : data.material_id && operationsAvailable.value.some((op) => op.id === data.material_id)
          ? data.material_id
          : ''

    if (orderProcessId) electroplating_process_id.value = orderProcessId

    const thickness = (data as { coating_thickness_microns?: number }).coating_thickness_microns
    if (thickness) coating_thickness_microns.value = thickness

    if (data.k_otk) k_otk.value = String(data.k_otk)
    if (data.special_instructions) special_instructions.value = data.special_instructions
    if (data.order_name) order_name.value = data.order_name
    if ((data as { order_code?: string }).order_code) order_code.value = (data as { order_code?: string }).order_code!

    if (!coatingProcesses.value.some((item) => item.value === process_id.value)) {
      const processOperation = operationsAvailable.value.find(
        (operation) => operation.id === electroplating_process_id.value
      )
      process_id.value =
        coatingProcesses.value.find((item) => {
          const groupOperation = operationsAvailable.value.find(
            (operation) => operation.id === item.value
          )
          return groupOperation?.group === processOperation?.group
        })?.value ??
        coatingProcesses.value[0]?.value ??
        ''
    }
    syncSelectedProcess()

    Object.assign(payload, {
      service_id: 'electroplating_auto',
      order_name: order_name.value,
      order_code: order_code.value,
      location: location.value,
      file_id: file_id.value,
      document_ids: document_ids.value,
      quantity: quantity.value,
      material_id: material_id.value,
      electroplating_process_id: electroplating_process_id.value,
      coating_thickness_microns: coating_thickness_microns.value,
      k_otk: k_otk.value,
    })
  } catch (error) {
    console.error({ error })
  }
  await stopLoading()
}

watch(service_id, () => {
  if (service_id.value !== 'electroplating_auto') {
    service_id.value = 'electroplating_auto'
  }
})

watch(process_id, () => {
  syncSelectedProcess()
})

watch(electroplating_process_id, async (id) => {
  if (!id || isBootstrapping.value) return
  await loadMaterials()
})

watch(file_id, () => {
  cadViewerKey.value += 1
})
</script>

<template>
  <Loader :loading="isLoading" text="Расчет цены...">
    <section class="milling-page">
      <el-row :gutter="0" class="milling-page__row">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <div class="milling-page__card">
            <div class="milling-page__main galvanic-page__main">
              <div class="calc-quantity">
                <div class="calc-title">Количество, шт</div>
                <Input v-model="quantityInput" type="number" placeholder="Введите количество" />
              </div>

              <div class="milling-field-block">
                <div class="calc-title">Вид покрытия</div>
                <div class="galvanic-cover-fields">
                  <SelectCalc v-model="process_id" :input-data="coatingProcesses" />
                  <SelectCalc
                    v-if="coatingTypes.length"
                    v-model="electroplating_process_id"
                    :input-data="coatingTypes"
                  />
                </div>
              </div>

              <div class="milling-field-group">
                <div class="calc-title">Материал заготовки</div>
                <SelectGroup
                  v-model="material_id"
                  :options="materials"
                  placeholder="Выберите материал"
                />
              </div>

              <div class="milling-field-block">
                <div class="calc-title">Толщина покрытия, мкм</div>
                <Input
                  v-model="coatingThicknessInput"
                  type="number"
                  placeholder="Введите толщину"
                />
              </div>

              <div v-if="technicalRestrictions.length" class="milling-field-block">
                <div class="calc-title">Технические ограничения</div>
                <div class="galvanic-restrictions">
                  <div
                    v-for="restriction in technicalRestrictions"
                    :key="restriction"
                    class="galvanic-restriction"
                  >
                    {{ restriction }}
                  </div>
                </div>
              </div>

              <div class="milling-field-block milling-field-block--otk">
                <div class="calc-title">Вид контроля</div>
                <CoefficientOtk2 v-model="k_otk" />
              </div>

              <div class="milling-field-block" v-if="profileStore.profile?.username === 'admin'">
                <SuitableMachines :machines="result?.suitable_machines || []" />
              </div>

              <div class="milling-field-block">
                <div class="calc-title">Описание заказа</div>
                <el-input v-model="special_instructions" type="textarea" :rows="5" placeholder="" />
              </div>

              <div class="milling-actions">
                <CalculateSubmit2
                  :order-id="order_id"
                  :payload="payload as unknown as IOrderPayload"
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
                <DocumentShowByIds2 v-model="document_ids" />
              </div>
            </aside>
          </div>
        </el-col>
      </el-row>
    </section>
  </Loader>
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

.galvanic-page__main {
  gap: 40px;
}

.milling-field-group,
.milling-field-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px 0;
}

:deep(.el-select__wrapper) {
  min-height: 48px;
  height: 48px;
  padding: 12px 24px;
  border-radius: 10px;
  background-color: var(--whity);
  box-shadow: none;
  border: none;
  box-sizing: border-box;
}

.milling-field-block--otk {
  max-width: 822px;
  gap: 20px;
}

.galvanic-cover-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.galvanic-restrictions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.galvanic-restriction {
  padding: 12px 24px;
  border-radius: 10px;
  background: var(--bgcolor);
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
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

  .milling-page__main,
  .galvanic-page__main {
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

  .galvanic-restriction {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 14px;
    font-size: 14px;
  }

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
