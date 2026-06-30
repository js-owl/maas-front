<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { req_json, req_json_auth } from '../api'
import { getLocalStpFileById, localStpCacheVersion } from '../helpers/local-stp-files'
import { parseFilesQueryToIds } from '../helpers/parse-files'
import { locations } from '../helpers/get-location'
import Input from '../components/ui/Input.vue'
import SelectCalc from '../components/ui/SelectCalc.vue'
import CoefficientOtk2 from '../components/coefficients/CoefficientOtk2.vue'
import { useProfileStore } from '../stores/profile.store'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import Loader from '../components/ui/Loader.vue'
import { toElectroplatingFamilyOptions } from '../helpers/material-family'
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

const electroplating_family = ref('')

type SelectOption = {
  value: string
  label: string
}

type ElectroplatingMaterialFamily = {
  id: string
  label: string
  density_kg_dm3?: number
  allowed_processes?: string[]
}
type ElectroplatingMaterialFamiliesResponse = {
  values?: ElectroplatingMaterialFamily[]
  data?: {
    values?: ElectroplatingMaterialFamily[]
  }
}
const materialFamilies = ref<SelectOption[]>([])

const service_id = ref('electroplating_auto')

type OperationAvailable = {
  id: string
  group: string
  path: string[]
  label: string
  max_part_size_label: string
  max_weight_kg: number
  requires_thickness_input?: boolean
  requires_processing_depth_input?: boolean
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

const requiresCoatingThicknessInput = computed(() => {
  const operation = selectedOperation.value
  if (!operation) return false
  return Boolean(operation.requires_thickness_input)
})

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
  electroplating_family,
  electroplating_process_id,
  coating_thickness_microns,
  k_otk,
})

const result = ref<IOrderResponse | null>(null)

const isInfoVisible = ref(false)
const isLoading = ref<boolean>(true)
const isBootstrapping = ref(true)
const isMaterialsLoading = ref(false)

const isFamilyInList = computed(() =>
  materialFamilies.value.some((item) => item.value === electroplating_family.value)
)

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

const localStpFile = computed(() => {
  localStpCacheVersion.value
  return getLocalStpFileById(file_id.value)
})

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
    electroplating_family: payload.electroplating_family,
    electroplating_process_id: payload.electroplating_process_id,
    ...(requiresCoatingThicknessInput.value
      ? { coating_thickness_microns: payload.coating_thickness_microns }
      : {}),
    k_otk: String(payload.k_otk),
  }
})

const submitPayload = computed(() => ({
  service_id: payload.service_id,
  order_name: payload.order_name,
  order_code: payload.order_code,
  location: payload.location,
  file_id: payload.file_id,
  document_ids: payload.document_ids,
  quantity: payload.quantity,
  electroplating_family: payload.electroplating_family,
  electroplating_process_id: payload.electroplating_process_id,
  k_otk: payload.k_otk,
  ...(requiresCoatingThicknessInput.value
    ? { coating_thickness_microns: payload.coating_thickness_microns }
    : {}),
}))

watch(
  electroplating_process_id,
  (id, oldId) => {
    if (!id || isBootstrapping.value || id === oldId) return
    isMaterialsLoading.value = true
    materialFamilies.value = []
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
      !electroplating_family.value ||
      !isFamilyInList.value
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
    await loadMaterialFamilies()
  } finally {
    isBootstrapping.value = false
  }
})

async function loadMaterialFamilies() {
  if (!electroplating_process_id.value) {
    materialFamilies.value = []
    return
  }

  isMaterialsLoading.value = true
  try {
    const processQuery = encodeURIComponent(electroplating_process_id.value)
    // New endpoint may be absent on older backends — fall back to /materials.
    const response = await req_json_auth(
      `/electroplating_material_families?electroplating_process_id=${processQuery}`,
      'GET',
      undefined,
      [404],
    )

    if (response?.status === 404) {
      const legacyResponse = await req_json_auth(
        `/materials?process=electroplating_auto&electroplating_process_id=${processQuery}`,
        'GET',
      )
      if (!legacyResponse?.ok) return

      const legacyBody = (await legacyResponse.json()) as {
        materials?: Array<{ electroplating_family?: string | null }>
      }
      materialFamilies.value = toElectroplatingFamilyOptions(legacyBody.materials ?? [])
    } else {
      if (!response?.ok) return

      const body = (await response.json()) as ElectroplatingMaterialFamiliesResponse
      const values = body.data?.values ?? body.values ?? []
      materialFamilies.value = values.map((item) => ({
        value: item.id,
        label: item.label,
      }))
    }

    if (!materialFamilies.value.length) return

    if (
      order_id.value === 0 ||
      !materialFamilies.value.some((item) => item.value === electroplating_family.value)
    ) {
      electroplating_family.value = materialFamilies.value[0].value
    }

    await sendData(calculationPayload.value as unknown as IOrderPayload)
  } catch (error) {
    console.error('Error loading electroplating material families:', error)
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

    const galvanicOrder = data as {
      electroplating_family?: string
      electroplating_process_id?: string
      coating_thickness_microns?: number
    }
    if (galvanicOrder.electroplating_family) {
      electroplating_family.value = galvanicOrder.electroplating_family
    }

    const orderProcessId =
      galvanicOrder.electroplating_process_id ??
      (data.cover_id
        ? Array.isArray(data.cover_id)
          ? data.cover_id[0]
          : data.cover_id
        : '')

    if (orderProcessId) electroplating_process_id.value = orderProcessId

    if (galvanicOrder.coating_thickness_microns) {
      coating_thickness_microns.value = galvanicOrder.coating_thickness_microns
    }

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
      electroplating_family: electroplating_family.value,
      electroplating_process_id: electroplating_process_id.value,
      ...(requiresCoatingThicknessInput.value
        ? { coating_thickness_microns: coating_thickness_microns.value }
        : {}),
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
  await loadMaterialFamilies()
})

watch(file_id, () => {
  cadViewerKey.value += 1
})
</script>

<template>
  <Loader :loading="isLoading" text="Расчет цены...">
    <section class="calc-page">
      <el-row :gutter="0" class="calc-page__row">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <div class="calc-page__card">
            <div class="calc-page__main">
              <div class="calc-block calc-block--form">
                <h2 class="calc-page__mobile-title">Гальваника</h2>

                <div class="calc-quantity">
                  <div class="calc-title">Количество, шт</div>
                  <Input v-model="quantityInput" type="number" placeholder="Введите количество" />
                </div>

                <div class="calc-field-block">
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

                <div class="calc-field-group">
                  <div class="calc-title">Материал детали</div>
                  <SelectCalc
                    v-model="electroplating_family"
                    :input-data="materialFamilies"
                  />
                </div>

                <div v-if="requiresCoatingThicknessInput" class="calc-field-block">
                  <div class="calc-title">Толщина покрытия, мкм</div>
                  <Input
                    v-model="coatingThicknessInput"
                    type="number"
                    placeholder="Введите толщину"
                  />
                </div>

                <div v-if="technicalRestrictions.length" class="calc-field-block">
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

                <div class="calc-field-block calc-field-block--otk">
                  <div class="calc-title">Вид контроля</div>
                  <CoefficientOtk2 v-model="k_otk" />
                </div>

                <div class="calc-field-block" v-if="profileStore.profile?.username === 'admin'">
                  <SuitableMachines :machines="result?.suitable_machines || []" />
                </div>
              </div>

              <div class="calc-block calc-block--comment">
                <div class="calc-field-block">
                  <div class="calc-title">
                    <span class="calc-title__desktop">Описание заказа</span>
                    <span class="calc-title__mobile">Комментарий</span>
                  </div>
                  <el-input v-model="special_instructions" type="textarea" :rows="5" placeholder="" />
                </div>

                <div class="calc-actions">
                  <div class="calc-submit calc-submit--desktop">
                    <CalculateSubmit2
                      :order-id="order_id"
                      :payload="submitPayload as unknown as IOrderPayload"
                      :special-instructions="special_instructions"
                      @updateResult="onUpdateResult"
                      @showInfo="isInfoVisible = true"
                    />
                  </div>
                  <div class="calc-submit calc-submit--mobile">
                    <CalculateSubmit2
                      :order-id="order_id"
                      :payload="submitPayload as unknown as IOrderPayload"
                      :special-instructions="special_instructions"
                      save-label="Сохранить"
                      hide-back-button
                      @updateResult="onUpdateResult"
                      @showInfo="isInfoVisible = true"
                    />
                  </div>
                </div>
              </div>
            </div>

            <aside class="calc-page__aside">
              <div class="calc-block calc-block--results">
                <CalculateResults :result="result" />

                <div class="calc-docs calc-docs--mobile">
                  <div class="calc-docs__title">Загруженные файлы</div>
                  <DocumentShowByIds2
                    v-model="document_ids"
                    class="calc-docs-list calc-docs-list--mobile"
                  />
                </div>
              </div>

              <div v-if="file_id" class="calc-block calc-block--cad">
                <div class="calc-cad">
                  <CadShowById :key="cadViewerKey" v-model="file_id" />
                </div>
              </div>

              <div class="calc-block calc-block--upload">
                <div class="calc-upload">
                  <div class="calc-upload__title calc-upload__title--desktop">Загрузите файлы</div>
                  <UploadFiles2
                    v-model="document_ids"
                    color="#000"
                    :hide-formats-text="true"
                    upload-text="Загрузите файлы"
                    v-model:stp_id="file_id"
                    class="upload-files-bordered upload-files--desktop"
                  />
                  <UploadFiles2
                    v-model="document_ids"
                    color="#000"
                    :hide-formats-text="true"
                    upload-text="Загрузите файлы"
                    v-model:stp_id="file_id"
                    class="upload-files-bordered upload-files--mobile"
                  />
                  <DocumentShowByIds2
                    v-model="document_ids"
                    class="calc-docs-list calc-docs-list--desktop"
                  />
                </div>
              </div>
            </aside>
          </div>
        </el-col>
      </el-row>
    </section>
  </Loader>
</template>
