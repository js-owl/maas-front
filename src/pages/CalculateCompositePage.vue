<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { req_json, req_json_auth } from '../api'
import { getLocalStpFileById, localStpCacheVersion } from '../helpers/local-stp-files'
import { parseFilesQueryToIds } from '../helpers/parse-files'

import Input from '../components/ui/Input.vue'
// import DatePicker from '../components/ui/DatePicker.vue'
import CoefficientOtk2 from '../components/coefficients/CoefficientOtk2.vue'
import CoefficientCover2 from '../components/coefficients/CoefficientCover2.vue'
import CheckboxСalc from '../components/ui/CheckboxСalc.vue'
import SelectGroup from '../components/ui/SelectGroup.vue'
// @ts-ignore
import CadShowById from '../components/cad/CadShowById.vue'
import { useProfileStore } from '../stores/profile.store'
import SuitableMachines from '../components/SuitableMachines.vue'
import CalculateResults from '../components/sections/CalculateResults.vue'
import type { IOrderPayload, IOrderResponse } from '../interfaces/order.interface'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import DocumentShowByIds2 from '@/components/DocumentShowByIds2.vue'
import CalculateSubmit2 from '@/components/sections/CalculateSubmit2.vue'
import Loader from '../components/ui/Loader.vue'
import { formatDeadline, parseDeadline } from '../helpers/deadline'
import { toMaterialOptionGroupsByFamily } from '../helpers/material-family'

const profileStore = useProfileStore()

const route = useRoute()
const order_id = computed(() => Number(route.query.orderId) || 0)
const order_name = ref('')
const order_code = ref('3000.000.001')

const file_id = ref<number | undefined>(undefined)
const cadViewerKey = ref(0)
const document_ids = ref<number[]>([])

const length = ref(120)
const width = ref(30)
const height = ref(30)
const quantity = ref(1)
const quantityInput = computed({
  get: () => String(quantity.value),
  set: (value: string) => {
    const parsedValue = Number(value)
    quantity.value = Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1
  },
})

const material_id = ref('')
const material_form = ref('sheet')
type BackendMaterial = { id: string; label: string; family?: string | null }
type MaterialOption = { value: string; label: string }
type MaterialOptionGroup = { label: string; options: MaterialOption[] }
const materials = ref<MaterialOptionGroup[]>([])
const service_id = ref('composite')

const cover_id = ref<string[]>([])
const is_need_special_equipment = ref(true)
const n_dimensions = ref(55)

const k_otk = ref('1.0')
const k_cert = ref(['a', 'f'])
const deadline = ref<Date | null>(null)
const special_instructions = ref('')

const payload = reactive({
  service_id: 'composite',
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
  is_need_special_equipment,
  n_dimensions,
  k_otk,
  k_cert,
})

const result = ref<IOrderResponse | null>(null)

const isInfoVisible = ref(false)
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
    cover_id: payload.cover_id,
    is_need_special_equipment: payload.is_need_special_equipment,
    n_dimensions: payload.n_dimensions,
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

    await sendData(calculationPayload.value as unknown as IOrderPayload)
  } finally {
    isBootstrapping.value = false
  }
})

const transformMaterials = (data: { materials: BackendMaterial[] }) =>
  toMaterialOptionGroupsByFamily(data.materials)

async function loadMaterials() {
  try {
    const response = await req_json_auth('/materials?process=composite', 'GET')
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
    if (data.length) length.value = data.length
    if (data.width) width.value = data.width
    if (data.height) height.value = data.height
    if (data.quantity) quantity.value = data.quantity
    if (data.material_id) material_id.value = data.material_id
    if (data.material_form) material_form.value = data.material_form
    if (data.cover_id) cover_id.value = Array.isArray(data.cover_id) ? data.cover_id : [data.cover_id]
    if (data.is_need_special_equipment !== undefined) {
      is_need_special_equipment.value = Boolean(data.is_need_special_equipment)
    }
    if (data.n_dimensions) n_dimensions.value = data.n_dimensions
    if (data.k_otk) k_otk.value = data.k_otk
    if (data.k_cert) k_cert.value = data.k_cert
    deadline.value = parseDeadline(data)
    if (data.special_instructions) special_instructions.value = data.special_instructions
    if (data.order_name) order_name.value = data.order_name
    if ((data as any).order_code) order_code.value = (data as any).order_code

    Object.assign(payload, {
      service_id: 'composite',
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
      is_need_special_equipment: is_need_special_equipment.value,
      n_dimensions: n_dimensions.value,
      k_otk: k_otk.value,
      k_cert: k_cert.value,
    })
  } catch (error) {
    console.error({ error })
  }
  await stopLoading()
}

watch(service_id, () => {
  if (service_id.value !== 'composite') {
    service_id.value = 'composite'
  }
})

watch(file_id, () => {
  cadViewerKey.value += 1
})
</script>

<template>
  <Loader :loading="isLoading" text="Расчет цены...">
    <section class="composite-page">
      <el-row :gutter="0" class="composite-page__row">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <div class="composite-page__card">
            <div class="composite-page__main">
              <div class="composite-block composite-block--form">
                <h2 class="composite-page__mobile-title">Композиты</h2>

                <div class="calc-quantity">
                  <div class="calc-title">Количество, шт</div>
                  <Input
                    v-model="quantityInput"
                    type="number"
                    placeholder="Введите количество"
                  />
                </div>

                <div class="composite-field-group">
                  <div class="calc-title">Материал</div>
                  <SelectGroup
                    v-model="material_id"
                    :options="materials"
                    placeholder="Выберите материал"
                  />
                </div>

                <div class="calc-two-columns">
                  <div class="composite-field-block">
                    <div class="calc-title">Наличие оснастки</div>
                    <CheckboxСalc v-model="is_need_special_equipment">
                      Требуется изготовление
                    </CheckboxСalc>
                  </div>
                  <div class="composite-field-block">
                    <div class="calc-title">Финишная обработка</div>
                    <CoefficientCover2
                      v-model="cover_id"
                      :exclude-labels="['Гальваника']"
                    />
                  </div>
                </div>

                <div class="composite-field-block composite-field-block--otk">
                  <div class="calc-title">Вид контроля</div>
                  <CoefficientOtk2 v-model="k_otk" />
                </div>

                <div
                  class="composite-field-block"
                  v-if="profileStore.profile?.username === 'admin'"
                >
                  <SuitableMachines :machines="result?.suitable_machines || []" />
                </div>
              </div>

              <div class="composite-block composite-block--comment">
                <div class="composite-field-block">
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

                <div class="composite-actions">
                  <div class="composite-submit composite-submit--desktop">
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
                  <div class="composite-submit composite-submit--mobile">
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

            <aside class="composite-page__aside">
              <div class="composite-block composite-block--results">
                <CalculateResults :result="result" />

                <div class="composite-docs composite-docs--mobile">
                  <div class="composite-docs__title">Загруженные файлы</div>
                  <DocumentShowByIds2
                    v-model="document_ids"
                    class="composite-docs-list composite-docs-list--mobile"
                  />
                </div>
              </div>

              <div v-if="file_id" class="composite-block composite-block--cad">
                <div class="composite-cad">
                  <CadShowById :key="cadViewerKey" v-model="file_id" />
                </div>
              </div>

              <div class="composite-block composite-block--upload">
                <div class="composite-upload">
                  <div class="composite-upload__title composite-upload__title--desktop">Загрузите файлы</div>
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
                    class="composite-docs-list composite-docs-list--desktop"
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

<style scoped>
.composite-page {
  padding: 0px 0 40px;
  min-height: 300px;
  background-color: var(--bgcolor);
}

.composite-page__row {
  width: 100%;
}

.composite-page__card {
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

.composite-page__main {
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
}

.composite-block--form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.composite-block--comment {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.composite-page__mobile-title {
  display: none;
}

.calc-title__mobile {
  display: none;
}

.composite-docs--mobile {
  display: none;
}

.upload-files--mobile {
  display: none;
}

.composite-field-group,
.composite-field-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px 0;
}

.composite-field-group :deep(.el-select__wrapper),
.composite-field-block :deep(.el-select__wrapper) {
  min-height: 48px;
  height: 48px;
  padding: 12px 24px;
  border-radius: 10px;
  background-color: var(--whity);
  box-shadow: none;
  border: none;
  box-sizing: border-box;
}

.composite-field-block--otk {
  max-width: 822px;
  gap: 20px;
}

.composite-actions {
  padding-top: 6px;
}

.composite-submit--mobile {
  display: none;
}

.composite-page__aside {
  background: var(--bgcolor);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.composite-block--results,
.composite-block--cad,
.composite-block--upload {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.composite-block--upload {
  gap: 12px;
}

.composite-cad {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.composite-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.composite-upload__title {
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
  .composite-page__card {
    width: 100%;
    padding: 20px;
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 767px) {
  .composite-page {
    padding: 32px 10px 40px;
    background-color: var(--bgcolor);
  }

  .composite-page__row {
    box-sizing: border-box;
  }

  .composite-page__card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 100%;
    padding: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow-x: hidden;
  }

  .composite-page__main,
  .composite-page__aside {
    display: contents;
  }

  .composite-block {
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 0 5px #c8cfe3;
    box-sizing: border-box;
    width: 100%;
  }

  .composite-block--upload {
    order: 1;
    gap: 0;
  }

  .composite-block--form {
    order: 2;
    gap: 32px;
  }

  .composite-block--results {
    order: 3;
    gap: 16px;
  }

  .composite-block--comment {
    order: 4;
    gap: 16px;
  }

  .composite-block--cad {
    display: none;
  }

  .composite-page__mobile-title {
    display: block;
    margin: 0;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 22px;
    line-height: normal;
    color: #000;
  }

  .calc-title__desktop {
    display: none;
  }

  .calc-title__mobile {
    display: inline;
  }

  .composite-docs--mobile {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .composite-docs__title {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    line-height: normal;
    color: #000;
  }

  .composite-docs-list--desktop {
    display: none;
  }

  .upload-files--desktop {
    display: none;
  }

  .upload-files--mobile {
    display: block;
  }

  .composite-upload__title--desktop {
    display: none;
  }

  .composite-upload {
    gap: 0;
  }

  .upload-files--mobile :deep(.upload) {
    min-height: 0;
    padding: 16px 32px;
    border-radius: 8px;
    border: 2px dashed var(--button-bg);
    background-color: transparent;
  }

  .upload-files--mobile :deep(.custom .el-upload__text) {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    max-width: none;
  }

  .composite-block--form .calc-title {
    font-size: 14px;
    line-height: normal;
    padding-bottom: 5px;
  }

  .composite-block--comment .calc-title {
    font-size: 14px;
    line-height: normal;
  }

  .calc-two-columns {
    gap: 20px;
  }

  .composite-field-group,
  .composite-field-block {
    gap: 8px;
    padding: 0;
  }

  .composite-field-block--otk {
    gap: 10px;
    max-width: 100%;
  }

  .composite-block--form :deep(.input .el-input__wrapper),
  .composite-block--form :deep(.el-select__wrapper) {
    min-height: 40px;
    height: 40px;
    padding: 8px;
    border-radius: 8px;
    background-color: #f2f3f7;
    box-shadow: none;
    border: none;
    box-sizing: border-box;
  }

  .composite-block--form :deep(.input .el-input__inner),
  .composite-block--form :deep(.el-select__placeholder),
  .composite-block--form :deep(.el-select__selected-item) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    height: auto;
  }

  .composite-block--form :deep(.el-select .el-select__suffix) {
    width: 20px;
    height: 20px;
  }

  .composite-block--form :deep(.coefficient-value) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
  }

  .composite-block--form :deep(.checkbox-item) {
    width: 100%;
    padding-bottom: 0;
    --checkbox-size: 20px;
    --checkbox-radius: 4px;
    --checkbox-border-color: #7d8083;
    --checkbox-bg-color: #f2f3f7;
    --checkbox-checked-bg-color: #f2f3f7;
    --checkbox-label-padding-left: 8px;
    --checkbox-label-size: 12px;
    --checkbox-line-height: normal;
  }

  .composite-block--form :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .composite-block--form :deep(.otk-radio-group) {
    row-gap: 8px;
  }

  .composite-block--form :deep(.otk-radio) {
    --radio-size: 20px;
    --radio-border-color: #7d8083;
    --radio-bg-color: #f2f3f7;
    --radio-label-size: 12px;
    --radio-label-padding-left: 8px;
    --radio-white-space: normal;
  }

  .composite-block--results :deep(.price-section) {
    font-size: 16px;
    margin: 0;
  }

  .composite-block--results :deep(.card) {
    margin-bottom: 0;
    padding: 8px;
    border-radius: 10px;
    background-color: #f2f3f7;
  }

  .composite-block--results :deep(.calc-res) {
    font-size: 16px;
    line-height: normal;
  }

  .composite-block--results :deep(.price) {
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
  }

  .composite-block--results :deep(.per-item) {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
  }

  .composite-block--results :deep(.price-line) {
    gap: 10px;
    align-items: flex-end;
  }

  .composite-block--results :deep(.price-disclaimer) {
    margin-top: 10px;
    gap: 0;
    font-size: 10px;
    line-height: normal;
    color: #000;
  }

  .composite-block--results :deep(.price-disclaimer p) {
    margin: 0;
  }

  .composite-docs-list--mobile :deep(.doc-list) {
    gap: 4px;
  }

  .composite-docs-list--mobile :deep(.doc-row) {
    min-height: 0;
    height: auto;
    padding: 8px;
    border-radius: 5px;
    background: #f2f3f7;
    gap: 8px;
  }

  .composite-docs-list--mobile :deep(.doc-content) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .composite-docs-list--mobile :deep(.doc-name) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
  }

  .composite-docs-list--mobile :deep(.doc-date) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
  }

  .composite-block--comment :deep(.el-textarea__inner) {
    min-height: 80px !important;
    padding: 8px;
    border-radius: 10px;
    background: #f2f3f7;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    line-height: normal;
  }

  .composite-actions {
    padding-top: 0;
  }

  .composite-submit--desktop {
    display: none;
  }

  .composite-submit--mobile {
    display: block;
  }

  .composite-submit--mobile :deep(.calculate-submit2) {
    flex-direction: column;
    gap: 0;
  }

  .composite-submit--mobile :deep(.auth-tooltip-trigger) {
    width: 100%;
  }

  .composite-submit--mobile :deep(.calculate-submit2 .btn) {
    width: 100% !important;
    min-height: 40px;
    height: 40px;
    padding: 8px 24px;
    border-radius: 8px;
    background-color: var(--button-bg) !important;
    border: none;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    color: #000;
    box-shadow: none;
  }
}
</style>
