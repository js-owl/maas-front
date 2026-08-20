<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import Select from '../ui/Select.vue'
import HomeCalcOrderTypeMobile from '../ui/HomeCalcOrderTypeMobile.vue'
import Button from '../ui/Button.vue'
import UploadFiles from '../UploadFiles.vue'
import { orderTypeOptions } from '@/helpers/order-type-options'
import { getLocalStpFileById } from '@/helpers/local-stp-files'
import {
  getGuestModelOnlyMessage,
  getIncompatibleModelMessage,
  getModelFormatsLabel,
  isAllowedModelFile,
  isPrintingService,
} from '@/helpers/model-file-types'
import { useAuthStore } from '@/stores/auth.store'
// import { useAuthStore } from '../../stores/auth.store'

const props = withDefaults(
  defineProps<{
    service_id?: string
  }>(),
  {
    service_id: '',
  }
)

const router = useRouter()
const authStore = useAuthStore()

const formModel = ref({
  name: '',
  phone: '',
})

const isSubmitting = ref(false)
let document_ids = ref<number[]>([])
const stp_id = ref<number | null>(null)
const selectedOrderType = ref<string>('')

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isAuthenticated = computed(() => Boolean(authStore.getToken))

// const hasToken = computed(() => Boolean(authStore.getToken))
const hasExternalServiceId = computed(() => Boolean(props.service_id))
const selectedServiceId = computed(
  () =>
    orderTypeOptions.find((option) => option.value === selectedOrderType.value)?.serviceId ?? ''
)
const uploadServiceId = computed(() => props.service_id || selectedServiceId.value)
const hasModel = computed(() => stp_id.value != null)
const modelFormatsLabel = computed(() => getModelFormatsLabel(uploadServiceId.value))
const guestOnlyMessage = computed(() => getGuestModelOnlyMessage(uploadServiceId.value))
const showDocsFormats = computed(() => !isPrintingService(uploadServiceId.value))
const selectedRoutePath = computed(() => {
  if (selectedOrderType.value) {
    return orderTypeOptions.find((option) => option.value === selectedOrderType.value)?.routePath ?? ''
  }
  if (!props.service_id) return ''
  return orderTypeOptions.find((option) => option.serviceId === props.service_id)?.routePath ?? ''
})

const handleOrderTypeChange = (value: string | number | boolean | object) => {
  if (!value) return
  selectedOrderType.value = String(value)
}

watch(uploadServiceId, (serviceId) => {
  if (stp_id.value == null) return

  const localFile = getLocalStpFileById(stp_id.value)
  if (!localFile) return

  if (isAllowedModelFile(localFile.file_name, serviceId)) return

  stp_id.value = null
  ElMessage.warning(getIncompatibleModelMessage(serviceId))
})

// const onFilesChange = (files: FileList | null) => {
//   if (!files) return
//   selectedFiles.value = Array.from(files).map(f => ({ name: f.name, size: f.size }))
// }

const submit = () => {
  if (!hasModel.value) {
    ElMessage.warning('Загрузите 3D-модель для расчёта стоимости')
    return
  }
  if (!selectedRoutePath.value) return

  isSubmitting.value = true
  router
    .push({
      path: selectedRoutePath.value,
      query: {
        stp: stp_id.value != null ? String(stp_id.value) : undefined,
        files: JSON.stringify(document_ids.value ?? []),
      },
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>

<template>
  <section class="section-basic calc-section">
    <div class="calc-wrap" :class="{ mobile: isMobile }">
      <div class="calc-left">
        <h2 class="calc-title">Комплекс предприятий полного цикла</h2>
        <div class="calc-description">
          <p class="calc-text">
            Нужна деталь, которую сложно найти или долго ждать? MaaS изготовит её по вашему чертежу
            или 3D-модели — от единичного экземпляра до серии.
          </p>
          <p class="calc-text">
            Выберите материал и технологию, получите расчёт стоимости и оформите заказ онлайн.
            Регистрация откроет полный доступ к сервису.
          </p>
        </div>
      </div>

      <div class="calc-right">
        <el-form :model="formModel" class="calc-form" label-position="top">
          <div class="calc-upload-zone">
            <h3 class="calc-upload-title">Расчет стоимости изготовления</h3>
            <div class="calc-formats">
              <div
                class="calc-formats-auth"
                :class="{ 'is-hidden': !isAuthenticated }"
                :aria-hidden="!isAuthenticated"
              >
                <p class="calc-format-text">
                  {{ modelFormatsLabel }}
                </p>
                <div v-if="showDocsFormats" class="calc-format-docs">
                  <p class="calc-format-text"> Форматы тех. документации: </p>
                  <p class="calc-format-text">DWG, DXF, PDF, SVG, AI, EPS</p>
                </div>
              </div>
              <p
                class="calc-format-text calc-formats-guest"
                :class="{ 'is-hidden': isAuthenticated }"
                :aria-hidden="isAuthenticated"
              >
                {{ guestOnlyMessage }}
              </p>
            </div>
            <UploadFiles
              v-model="document_ids"
              color="#e84261"
              v-model:stp_id="stp_id"
              :service_id="uploadServiceId"
              :hide-formats-text="true"
              class="calc-upload-files"
            />
          </div>
          <div class="action-row">
            <p v-if="!hasModel" class="calc-submit-warning" role="alert">
              Для отправки необходимо загрузить 3D-модель
            </p>
            <div class="action-controls">
              <el-form-item v-if="!hasExternalServiceId" class="calc-order-type-item">
                <HomeCalcOrderTypeMobile
                  v-if="isMobile"
                  v-model="selectedOrderType"
                  @change="handleOrderTypeChange"
                />
                <Select
                  v-else
                  v-model="selectedOrderType"
                  placeholder="Тип обработки"
                  aria-label="Тип обработки"
                  width="100%"
                  dropdown-class="home-calc-order-select-dropdown"
                  @change="handleOrderTypeChange"
                >
                  <el-option
                    v-for="option in orderTypeOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  >
                    <span class="home-calc-order-option__label">{{ option.label }}</span>
                    <span class="home-calc-order-option__chevron" aria-hidden="true" />
                  </el-option>
                </Select>
              </el-form-item>
              <Button
                flat
                :width="isMobile ? '100%' : 'auto'"
                :disabled="!hasModel"
                :loading="isSubmitting"
                @click="submit"
                class="calc-submit-button"
              >
                Отправить
              </Button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calc-section.section-basic {
  min-height: auto;
  margin: 0 0 2.5rem;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 2.5rem;
  box-shadow: 0 0.375rem 0.9375rem rgba(224, 227, 237, 0.5);
  box-sizing: border-box;
}

.calc-wrap {
  display: flex;
  gap: 5.625rem;
  align-items: stretch;
  width: 100%;
}

.calc-wrap.mobile {
  flex-direction: column;
  gap: 1.5rem;
}

.calc-left {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
}

.calc-title {
  margin: 0;
  max-width: 100%;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 2.875rem;
  font-weight: 800;
  line-height: normal;
  color: #e84261;
  word-break: break-word;
}

.calc-description {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding-right: 2.5rem;
  box-sizing: border-box;
}

.calc-text {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

.calc-right {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
}

.calc-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  height: 100%;
  flex: 1;
}

.calc-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.calc-upload-zone {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: 0;
  align-items: center;
  width: 100%;
  padding: 1.25rem;
  border: 0.125rem dashed #e84261;
  border-radius: 1.25rem;
  box-sizing: border-box;
  text-align: center;
}

.calc-upload-title {
  margin: 0;
  width: 100%;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: #000000;
  overflow-wrap: break-word;
}

.calc-formats {
  display: grid;
  grid-template-rows: 1fr;
  flex: 1 1 auto;
  align-items: stretch;
  width: 100%;
  padding: 0.625rem 0 0;
  box-sizing: border-box;
  text-align: center;
}

.calc-formats-auth,
.calc-formats-guest {
  grid-area: 1 / 1;
}

.calc-formats-auth {
  display: flex;
  flex-direction: column;
  align-self: start;
  width: 100%;
}

.calc-formats-guest {
  align-self: center;
}

.calc-formats .is-hidden {
  visibility: hidden;
  pointer-events: none;
}

.calc-format-text {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: normal;
  color: #e84261;
  word-break: break-word;
  width: 100%;
}

.calc-format-docs {
  width: 100%;
  margin-top: 1.25rem;
}

.calc-upload-files {
  width: 100%;
}

.calc-upload-files:not(:has(.has-files, .is-uploading)) {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.calc-upload-files :deep(.upload) {
  height: auto;
  min-height: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background-color: transparent !important;
}

.calc-upload-files :deep(.upload:not(.has-files):not(.is-uploading)) {
  width: 100%;
  height: 100%;
  min-height: 100%;
  cursor: pointer;
}

.calc-upload-files :deep(.upload:not(.has-files):not(.is-uploading) .el-upload__text),
.calc-upload-files :deep(.upload-subtitle) {
  display: none;
}

.calc-upload-files :deep(.custom) {
  flex-direction: column;
  gap: 0;
  align-items: center;
  width: 100%;
}

.calc-upload-files :deep(.has-files .el-upload__text) {
  color: #000000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  line-height: normal !important;
}

.action-row {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 0.625rem;
  width: 100%;
}

.action-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
}

.calc-order-type-item {
  flex: 1 1 0;
  min-width: 0;
  width: auto;
  margin-bottom: 0;
}

.calc-order-type-item :deep(.select-wrapper) {
  --bgcolor: #cbd1d5;
}

.calc-order-type-item :deep(.el-select__wrapper) {
  border-radius: 0.625rem;
  min-height: 2.75rem;
  max-height: 2.75rem;
  padding: 0.75rem 1.5rem;
  background-color: #cbd1d5;
  border-color: #cbd1d5;
  box-shadow: none;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0;
}

.calc-order-type-item :deep(.el-select__placeholder),
.calc-order-type-item :deep(.el-select__selected-item),
.calc-order-type-item :deep(.el-select__selection-text) {
  font-family: 'Montserrat-Medium', sans-serif !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  line-height: normal !important;
  letter-spacing: 0 !important;
  color: #000000 !important;
}

.calc-submit-warning {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: normal;
  color: #e84261;
  text-align: center;
}

.calc-submit-button {
  flex-shrink: 0;
  min-height: 2.75rem;
  height: 2.75rem;
  padding: 0.75rem 1.5rem;
  background: #cbd1d5 !important;
  border-radius: 0.625rem;
  color: #000000 !important;
  font-family: 'Montserrat-Medium', sans-serif !important;
  font-size: 1rem;
  font-weight: 500;
  line-height: normal;
  text-transform: none;
  box-shadow: none !important;
}

.calc-submit-button:hover:not(.is-disabled) {
  background: #cbd1d5 !important;
  box-shadow: none !important;
  transform: none;
}

.calc-submit-button:active:not(.is-disabled) {
  transform: none;
  box-shadow: none !important;
}

.calc-submit-button.is-disabled,
.calc-submit-button:disabled {
  opacity: 0.7;
}

.home-calc-order-option__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-calc-order-option__chevron {
  position: relative;
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  margin-left: 1.25rem;
}

.home-calc-order-option__chevron::before {
  content: '';
  position: absolute;
  top: 0.25rem;
  left: 0.3125rem;
  width: 0.4375rem;
  height: 0.4375rem;
  border-top: 0.09375rem solid #000000;
  border-right: 0.09375rem solid #000000;
  transform: rotate(45deg);
}

@media (max-width: 1300px) and (min-width: 769px) {
  .calc-wrap {
    gap: clamp(1.5rem, 4vw, 5.625rem);
  }

  .calc-description {
    padding-right: 0;
  }

  .calc-upload-zone {
    gap: 1.25rem;
  }

  .calc-formats {
    padding: 0;
  }

  .calc-format-docs {
    margin-top: 1.25rem;
  }

  .action-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.625rem;
  }

  .calc-order-type-item {
    width: 100%;
    flex: none;
  }
}

@media (max-width: 768px) {
  .calc-section.section-basic {
    margin-bottom: 0;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 0 5px #c8cfe3;
  }

  .calc-wrap {
    gap: 24px;
  }

  .calc-left {
    flex: none;
    width: 100%;
    gap: 16px;
  }

  .calc-title {
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 28px;
    font-weight: 700;
  }

  .calc-description {
    gap: 14px;
    padding-right: 0;
  }

  .calc-text {
    font-size: 14px;
  }

  .calc-formats {
    gap: 8px;
    align-items: flex-start;
    padding: 0;
    text-align: left;
  }

  .calc-format-text {
    font-size: 12px;
  }

  .calc-format-docs {
    margin-top: 0;
  }

  .calc-form {
    gap: 16px;
    height: auto;
  }

  .calc-upload-zone {
    padding: 16px;
    gap: 16px;
    border-radius: 8px;
  }

  .calc-upload-title {
    font-size: 16px;
    line-height: normal;
  }

  .calc-upload-files :deep(.custom) {
    align-items: flex-start;
    text-align: left;
  }

  .action-row {
    gap: 8px;
  }

  .action-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .calc-order-type-item {
    width: 100%;
    flex: none;
  }

  .calc-submit-button {
    width: 100%;
    height: 41px;
    min-height: 41px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
  }

  .calc-submit-warning {
    font-size: 12px;
    text-align: left;
  }
}
</style>

<style>
.home-calc-order-select-dropdown.el-popper {
  box-sizing: border-box;
  padding: 1.25em !important;
  background: #fff !important;
  border: none !important;
  border-radius: 1.25em !important;
  box-shadow: none !important;
}

.home-calc-order-select-dropdown .el-select-dropdown {
  background: transparent;
}

.home-calc-order-select-dropdown .el-select-dropdown__wrap {
  max-height: none;
}

.home-calc-order-select-dropdown .el-select-dropdown__list {
  padding: 0 !important;
}

.home-calc-order-select-dropdown .el-select-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.778em;
  padding: 0.556em 0 !important;
  color: #000 !important;
  background: #fff !important;
  font-family: 'Montserrat-Medium', sans-serif !important;
  font-size: 1.125em !important;
  font-weight: 500 !important;
  line-height: 1 !important;
}

.home-calc-order-select-dropdown .el-select-dropdown__item.is-selected {
  font-weight: 500 !important;
}

.home-calc-order-select-dropdown .el-popper__arrow {
  display: none;
}

.calc-order-type-item .select-wrapper.full .el-select__wrapper {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0;
}

.calc-order-type-item .select-wrapper.full .el-select__placeholder,
.calc-order-type-item .select-wrapper.full .el-select__selection-text,
.calc-order-type-item .select-wrapper.full .el-select__selected-item {
  font-family: 'Montserrat-Medium', sans-serif !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  line-height: normal !important;
  letter-spacing: 0 !important;
  color: #000000 !important;
}
</style>
