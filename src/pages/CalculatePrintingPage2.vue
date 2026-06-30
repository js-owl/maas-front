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
    <section class="printing-page">
      <el-row :gutter="0" class="printing-page__row">
        <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
          <div class="printing-page__card">
            <div class="printing-page__main">
              <div class="printing-block printing-block--form">
                <h2 class="printing-page__mobile-title">3D Печать</h2>

                <div class="calc-quantity-material">
                  <div class="calc-quantity">
                    <div class="calc-title">Количество, шт</div>
                    <Input
                      v-model="quantityInput"
                      type="number"
                      placeholder="Введите количество"
                    />
                  </div>
                  <div class="printing-field-group">
                    <div class="calc-title">Технология печати</div>
                    <SelectCalc v-model="printing_technology" :input-data="printingTechnologies" />
                  </div>
                </div>

                <div class="printing-field-group">
                  <div class="calc-title">Материал</div>
                  <SelectGroup
                    class="printing-select"
                    v-model="material_id"
                    :options="materials"
                    placeholder="Выберите материал"
                  />
                </div>

                <div class="printing-field-block">
                  <div class="calc-title">Финишная обработка изделия</div>
                  <CoefficientCover2 v-model="cover_id" :exclude-labels="['Гальваника']" />
                </div>

                <div class="printing-field-block printing-field-block--otk">
                  <div class="calc-title">Вид контроля</div>
                  <CoefficientOtk2 v-model="k_otk" />
                </div>

                <div
                  class="printing-field-block"
                  v-if="profileStore.profile?.username === 'admin'"
                >
                  <SuitableMachines :machines="result?.suitable_machines || []" />
                </div>
              </div>

              <div class="printing-block printing-block--comment">
                <div class="printing-field-block">
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

                <div class="printing-actions">
                  <div class="printing-submit printing-submit--desktop">
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
                  <div class="printing-submit printing-submit--mobile">
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

            <aside class="printing-page__aside">
              <div class="printing-block printing-block--results">
                <CalculateResults :result="result" />

                <div class="printing-docs printing-docs--mobile">
                  <div class="printing-docs__title">Загруженные файлы</div>
                  <DocumentShowByIds2
                    v-model="document_ids"
                    class="printing-docs-list printing-docs-list--mobile"
                  />
                </div>
              </div>

              <div v-if="file_id" class="printing-block printing-block--cad">
                <div class="printing-cad">
                  <CadShowById :key="cadViewerKey" v-model="file_id" />
                </div>
              </div>

              <div class="printing-block printing-block--upload">
                <div class="printing-upload">
                  <div class="printing-upload__title printing-upload__title--desktop">Загрузите файлы</div>
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
                    class="printing-docs-list printing-docs-list--desktop"
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
  gap: 40px;
  min-width: 0;
}

.printing-block--form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.printing-block--comment {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.printing-page__mobile-title {
  display: none;
}

.calc-title__mobile {
  display: none;
}

.printing-docs--mobile {
  display: none;
}

.upload-files--mobile {
  display: none;
}

.calc-quantity-material {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 20px;
  align-items: end;
}

.calc-quantity-material .printing-field-group {
  padding: 0;
}

.calc-quantity-material :deep(.el-select__wrapper) {
  min-height: 48px;
  height: 48px;
  padding: 12px 24px;
  border-radius: 10px;
  background-color: var(--whity);
  box-shadow: none;
  border: none;
  box-sizing: border-box;
}

.printing-select :deep(.el-select__wrapper) {
  min-height: 48px;
  height: 48px;
  padding: 12px 24px;
  border-radius: 10px;
  background-color: var(--whity);
  box-shadow: none;
  border: none;
  box-sizing: border-box;
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

.printing-actions {
  padding-top: 6px;
}

.printing-submit--mobile {
  display: none;
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

.printing-block--results,
.printing-block--cad,
.printing-block--upload {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.printing-block--upload {
  gap: 12px;
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
    padding: 32px 10px 40px;
    background-color: var(--bgcolor);
  }

  .printing-page__row {
    box-sizing: border-box;
  }

  .printing-page__card {
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

  .printing-page__main,
  .printing-page__aside {
    display: contents;
  }

  .printing-block {
    background: #fff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 0 5px #c8cfe3;
    box-sizing: border-box;
    width: 100%;
  }

  .printing-block--upload {
    order: 1;
    gap: 0;
  }

  .printing-block--form {
    order: 2;
    gap: 32px;
  }

  .printing-block--results {
    order: 3;
    gap: 16px;
  }

  .printing-block--comment {
    order: 4;
    gap: 16px;
  }

  .printing-block--cad {
    display: none;
  }

  .printing-page__mobile-title {
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

  .printing-docs--mobile {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .printing-docs__title {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 14px;
    line-height: normal;
    color: #000;
  }

  .printing-docs-list--desktop {
    display: none;
  }

  .upload-files--desktop {
    display: none;
  }

  .upload-files--mobile {
    display: block;
  }

  .printing-upload__title--desktop {
    display: none;
  }

  .printing-upload {
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

  .printing-block--form .calc-title {
    font-size: 14px;
    line-height: normal;
    padding-bottom: 5px;
  }

  .printing-block--comment .calc-title {
    font-size: 14px;
    line-height: normal;
  }

  .calc-quantity-material {
    grid-template-columns: 1fr;
    gap: 20px;
    align-items: stretch;
  }

  .printing-field-group,
  .printing-field-block {
    gap: 8px;
    padding: 0;
  }

  .printing-field-block--otk {
    gap: 10px;
    max-width: 100%;
  }

  .printing-block--form :deep(.input .el-input__wrapper),
  .printing-block--form :deep(.el-select__wrapper) {
    min-height: 40px;
    height: 40px;
    padding: 8px;
    border-radius: 8px;
    background-color: #f2f3f7;
    box-shadow: none;
    border: none;
    box-sizing: border-box;
  }

  .printing-block--form :deep(.input .el-input__inner),
  .printing-block--form :deep(.el-select__placeholder),
  .printing-block--form :deep(.el-select__selected-item) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
    height: auto;
  }

  .printing-block--form :deep(.el-select .el-select__suffix) {
    width: 20px;
    height: 20px;
  }

  .printing-block--form :deep(.coefficient-value) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
  }

  .printing-block--form :deep(.checkbox-item) {
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

  .printing-block--form :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .printing-block--form :deep(.otk-radio-group) {
    row-gap: 8px;
  }

  .printing-block--form :deep(.otk-radio) {
    --radio-size: 20px;
    --radio-border-color: #7d8083;
    --radio-bg-color: #f2f3f7;
    --radio-label-size: 12px;
    --radio-label-padding-left: 8px;
    --radio-white-space: normal;
  }

  .printing-block--results :deep(.price-section) {
    font-size: 16px;
    margin: 0;
  }

  .printing-block--results :deep(.card) {
    margin-bottom: 0;
    padding: 8px;
    border-radius: 10px;
    background-color: #f2f3f7;
  }

  .printing-block--results :deep(.calc-res) {
    font-size: 16px;
    line-height: normal;
  }

  .printing-block--results :deep(.price) {
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
  }

  .printing-block--results :deep(.per-item) {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
  }

  .printing-block--results :deep(.price-line) {
    gap: 10px;
    align-items: flex-end;
  }

  .printing-block--results :deep(.price-disclaimer) {
    margin-top: 10px;
    gap: 0;
    font-size: 10px;
    line-height: normal;
    color: #000;
  }

  .printing-block--results :deep(.price-disclaimer p) {
    margin: 0;
  }

  .printing-docs-list--mobile :deep(.doc-list) {
    gap: 4px;
  }

  .printing-docs-list--mobile :deep(.doc-row) {
    min-height: 0;
    height: auto;
    padding: 8px;
    border-radius: 5px;
    background: #f2f3f7;
    gap: 8px;
  }

  .printing-docs-list--mobile :deep(.doc-content) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .printing-docs-list--mobile :deep(.doc-name) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
  }

  .printing-docs-list--mobile :deep(.doc-date) {
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #000;
  }

  .printing-block--comment :deep(.el-textarea__inner) {
    min-height: 80px !important;
    padding: 8px;
    border-radius: 10px;
    background: #f2f3f7;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    line-height: normal;
  }

  .printing-actions {
    padding-top: 0;
  }

  .printing-submit--desktop {
    display: none;
  }

  .printing-submit--mobile {
    display: block;
  }

  .printing-submit--mobile :deep(.calculate-submit2) {
    flex-direction: column;
    gap: 0;
  }

  .printing-submit--mobile :deep(.auth-tooltip-trigger) {
    width: 100%;
  }

  .printing-submit--mobile :deep(.calculate-submit2 .btn) {
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
