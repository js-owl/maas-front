<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { req_json, req_json_auth } from '../api'
import { getLocalStpFileById, localStpCacheVersion } from '../helpers/local-stp-files'
import { parseFilesQueryToIds } from '../helpers/parse-files'
import { formatDeadline, parseDeadline } from '../helpers/deadline'
import { toMaterialOptionGroupsByFamily } from '../helpers/material-family'

import CoefficientOtk2 from '../components/coefficients/CoefficientOtk2.vue'
// import CoefficientCertificate from '../components/coefficients/CoefficientCertificate.vue'
import CoefficientCover2 from '../components/coefficients/CoefficientCover2.vue'
import Input from '../components/ui/Input.vue'
import SelectCalc from '../components/ui/SelectCalc.vue'
import SelectGroup from '../components/ui/SelectGroup.vue'

import { useRoute } from 'vue-router'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'
import { useProfileStore } from '../stores/profile.store'
// import DialogInfoPayment from '../components/dialog/DialogInfoPayment.vue'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
import CalculateSubmit2 from '../components/sections/CalculateSubmit2.vue'
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import Loader from '../components/ui/Loader.vue'

type BackendMaterial = { id: string; label: string; family?: string | null }
type MaterialOption = { value: string; label: string }
type MaterialOptionGroup = { label: string; options: MaterialOption[] }

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

let material_id = ref('')
let material_form = ref('powder')
const printing_technology = ref('sls')
const printingTechnologies = ref<Array<{ value: string; label: string }>>([
  { value: 'sls', label: 'SLS (послойное лазерное спекание)' },
])
const materials = ref<MaterialOptionGroup[]>([])

let cover_id = ref<string[]>(['1'])
let k_otk = ref('1.0')
let k_cert = ref(['a', 'f'])
let deadline = ref<Date | null>(null)
let special_instructions = ref('')

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
})

const result = ref<IOrderResponse | null>(null)

let isInfoVisible = ref(false)
const isLoading = ref<boolean>(true)
const isBootstrapping = ref(true)

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
    ...fileFields,
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
    deadline: formatDeadline(deadline.value),
  }
})

watch(
  calculationPayload,
  (newVal) => {
    if (isBootstrapping.value) return
    sendData(newVal as unknown as IOrderPayload)
  },
  { deep: true }
)

onMounted(async () => {
  try {
    await loadMaterials()
    deadline.value = new Date()
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
    } else {
      await getOrder(order_id.value)
    }

    await sendData(calculationPayload.value as unknown as IOrderPayload)
  } finally {
    isBootstrapping.value = false
  }
})

const transformMaterials = (data: { materials: BackendMaterial[] }) =>
  toMaterialOptionGroupsByFamily(data.materials)

async function loadMaterials() {
  try {
    const response = await req_json_auth('/materials?process=printing', 'GET')
    if (response?.ok) {
      const backendMaterials = (await response.json()) as {
        materials: BackendMaterial[]
      }
      materials.value = transformMaterials(backendMaterials)
      const flat = materials.value.flatMap((g) => g.options)
      if (order_id.value === 0 && flat.length) {
        material_id.value = flat[0].value
      } else if (!flat.some((item) => item.value === material_id.value) && flat.length) {
        material_id.value = flat[0].value
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
    deadline.value = parseDeadline(data)
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
    })
  } catch (error) {
    console.error({ error })
  }
  await stopLoading()
}

watch(file_id, () => {
  cadViewerKey.value += 1
})

watch(
  () => result.value?.manufacturing_cycle,
  (cycle) => {
    if (cycle) {
      deadline.value = parseDeadline({ manufacturing_cycle: cycle })
    }
  }
)
</script>

<template>
  <Loader :loading="isLoading" text="Расчет цены...">
    <section class="calc-page">
      <el-row :gutter="0" class="calc-page__row">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <div class="calc-page__card">
            <div class="calc-page__main">
              <div class="calc-block calc-block--form">
                <h2 class="calc-page__mobile-title">3D-печать</h2>

                <div class="calc-quantity-material">
                  <div class="calc-quantity">
                    <div class="calc-title">Количество, шт</div>
                    <Input
                      v-model="quantityInput"
                      type="number"
                      placeholder="Введите количество"
                    />
                  </div>
                  <div class="calc-field-group">
                    <div class="calc-title">Технология печати</div>
                    <SelectCalc v-model="printing_technology" :input-data="printingTechnologies" />
                  </div>
                </div>

                <div class="calc-field-group">
                  <div class="calc-title">Материал</div>
                  <SelectGroup
                    v-model="material_id"
                    :options="materials"
                    placeholder="Выберите материал"
                  />
                </div>

                <div class="calc-field-block">
                  <div class="calc-title">Финишная обработка изделия</div>
                  <CoefficientCover2 v-model="cover_id" :exclude-labels="['Гальваника']" />
                </div>

                <div class="calc-field-block calc-field-block--otk">
                  <div class="calc-title">Вид контроля</div>
                  <CoefficientOtk2 v-model="k_otk" />
                </div>

                <div
                  class="calc-field-block"
                  v-if="profileStore.profile?.username === 'admin'"
                >
                  <SuitableMachines :machines="result?.suitable_machines || []" />
                </div>
              </div>

              <div class="calc-block calc-block--comment">
                <div class="calc-field-block">
                  <div class="calc-title">
                    <span class="calc-title__desktop">Описание заказа</span>
                    <span class="calc-title__mobile">Комментарий</span>
                  </div>
                  <el-input
                    v-model="special_instructions"
                    type="textarea"
                    :rows="5"
                    placeholder=""
                  />
                </div>

                <div class="calc-actions">
                  <div class="calc-submit calc-submit--desktop">
                    <CalculateSubmit2
                      :order-id="order_id"
                      :payload="{
                        ...payload,
                      } as unknown as IOrderPayload"
                      :special-instructions="special_instructions"
                      @updateResult="onUpdateResult"
                      @showInfo="isInfoVisible = true"
                    />
                  </div>
                  <div class="calc-submit calc-submit--mobile">
                    <CalculateSubmit2
                      :order-id="order_id"
                      :payload="{
                        ...payload,
                      } as unknown as IOrderPayload"
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
                <CalculateResults :result="result" price-label-format="asterisk" />

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
      <!-- <DialogInfoPayment v-model="isInfoVisible" /> -->
    </section>
  </Loader>
</template>
