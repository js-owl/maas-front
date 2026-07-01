<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import Select from '../ui/Select.vue'
import Button from '../ui/Button.vue'
import UploadFiles from '../UploadFiles.vue'
import { orderTypeOptions } from '@/helpers/order-type-options'
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
            Мы — комплекс предприятий полного цикла. Производим детали любой сложности по вашим
            чертежам: от единичного экземпляра до серии.
          </p>
          <p class="calc-text calc-text--gap" aria-hidden="true">&#8203;</p>
          <p class="calc-text calc-text--mobile-line">От чертежа до готового изделия - </p>
          <p class="calc-text calc-text--mobile-line">без посредников и лишних звонков.</p>
          <p class="calc-text calc-text--desktop-second">
            От чертежа до готового изделия -<br />
            без посредников и лишних звонков.
          </p>
        </div>
      </div>

      <div class="calc-right">
        <el-form :model="formModel" class="calc-form" label-position="top">
          <div class="calc-upload-zone">
            <h3 class="calc-upload-title">Расчет стоимости изготовления</h3>
            <div v-if="!isMobile || isAuthenticated" class="calc-formats">
              <p class="calc-format-text">
                Допустимые форматы файлов: STEP, STP, IGES, IGS, SAT, SLDPRT, SLDASM, STL, OBJ, PLY,
                3DS, DAE, FBX, BLEND
              </p>
              <div class="calc-format-docs">
                <p class="calc-format-text"> Форматы тех. документации: </p>
                <p class="calc-format-text">DWG, DXF, PDF, SVG, AI, EPS</p>
              </div>
            </div>
            <UploadFiles
              v-model="document_ids"
              color="#e84261"
              v-model:stp_id="stp_id"
              :service_id="uploadServiceId"
              :hide-formats-text="isMobile"
              class="calc-upload-files"
            />
          </div>
          <div class="action-row">
            <el-form-item v-if="!hasExternalServiceId" class="calc-order-type-item">
              <Select
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
            <p v-if="!hasModel" class="calc-submit-warning" role="alert">
              Для отправки необходимо загрузить 3D-модель
            </p>
            <Button
              flat
              :disabled="!hasModel"
              :loading="isSubmitting"
              @click="submit"
              class="calc-submit-button"
            >
              Отправить
            </Button>
          </div>
        </el-form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calc-section.section-basic {
  min-height: auto;
  margin: 0 0 40px;
  padding: 80px 40px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 11px 7.5px #cbd1d5;
  box-sizing: border-box;
}

.calc-wrap {
  display: flex;
  gap: 100px;
  align-items: flex-start;
  width: 100%;
}

.calc-wrap.mobile {
  flex-direction: column;
  gap: 24px;
}

.calc-left {
  display: flex;
  flex-direction: column;
  gap: 80px;
  flex: 0 0 600px;
  max-width: 600px;
  box-sizing: border-box;
}

.calc-title {
  margin: 0;
  max-width: 600px;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 60px;
  font-weight: 900;
  line-height: normal;
  color: #e84261;
  word-break: break-word;
}

.calc-description {
  display: flex;
  flex-direction: column;
  gap: 1em;
  max-width: 500px;
}

.calc-text {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

.calc-text--gap,
.calc-text--mobile-line {
  display: none;
}

.calc-text--desktop-second {
  display: block;
}

.calc-right {
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
}

.calc-form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.calc-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.calc-upload-zone {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
  padding: 40px;
  border: 4px dashed #e84261;
  border-radius: 20px;
  box-sizing: border-box;
  text-align: center;
}

.calc-upload-title {
  margin: 0;
  width: 100%;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.calc-formats {
  display: none;
}

.calc-format-text {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #e84261;
  word-break: break-word;
  width: 100%;
}

.calc-format-docs {
  width: 100%;
}

.calc-upload-files {
  width: 100%;
}

.calc-upload-files :deep(.upload) {
  height: auto;
  min-height: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background-color: transparent !important;
}

.calc-upload-files :deep(.upload:not(.has-files):not(.is-uploading) .el-upload__text) {
  display: none;
}

.calc-upload-files :deep(.custom) {
  flex-direction: column;
  gap: 0;
  align-items: center;
  width: 100%;
}

.calc-upload-files :deep(.upload-subtitle) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  color: #e84261;
}

.calc-upload-files :deep(.upload-subtitle + .upload-subtitle) {
  margin-top: 1em;
}

.calc-upload-files :deep(.has-files .el-upload__text) {
  color: #000000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: normal !important;
}

.action-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.calc-order-type-item {
  width: 100%;
}

.calc-order-type-item :deep(.select-wrapper) {
  --bgcolor: #cbd1d5;
}

.calc-order-type-item :deep(.el-select__wrapper) {
  border-radius: 10px;
  min-height: 69px;
  padding: 20px 30px;
  background-color: #cbd1d5;
  border-color: #cbd1d5;
  box-shadow: none;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0;
}

.calc-order-type-item :deep(.el-select__placeholder),
.calc-order-type-item :deep(.el-select__selected-item),
.calc-order-type-item :deep(.el-select__selection-text) {
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 24px !important;
  font-weight: normal !important;
  line-height: normal !important;
  letter-spacing: 0 !important;
  color: #55585b !important;
}

.calc-submit-warning {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: #e84261;
  text-align: center;
}

.calc-submit-button {
  width: 100%;
  padding: 20px 30px;
  background: #e84261 !important;
  border-radius: 10px;
  color: #ffffff !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  box-shadow: none !important;
}

.calc-submit-button:hover:not(.is-disabled) {
  background: #e84261 !important;
  box-shadow: none !important;
  transform: none;
}

.calc-submit-button:active:not(.is-disabled) {
  transform: none;
  box-shadow: none !important;
}

.home-calc-order-option__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-calc-order-option__chevron {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-left: 20px;
}

.home-calc-order-option__chevron::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 5px;
  width: 7px;
  height: 7px;
  border-top: 1.5px solid #000000;
  border-right: 1.5px solid #000000;
  transform: rotate(45deg);
}

@media (max-width: 1620px) and (min-width: 769px) {
  .calc-section.section-basic {
    padding: 60px 32px;
  }

  .calc-wrap {
    gap: 40px;
  }

  .calc-left {
    flex: 1 1 0;
    min-width: 0;
    max-width: none;
    gap: 40px;
  }

  .calc-title {
    max-width: none;
    font-size: 48px;
  }

  .calc-description {
    max-width: none;
  }

  .calc-formats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;
    text-align: left;
  }

  .calc-upload-zone {
    padding: 32px 24px;
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
    max-width: none;
    width: 100%;
    gap: 16px;
  }

  .calc-title {
    max-width: none;
    font-family: 'Montserrat-SemiBold', sans-serif;
    font-size: 28px;
    font-weight: 700;
    line-height: normal;
    color: #e84261;
  }

  .calc-description {
    gap: 0;
  }

  .calc-text {
    font-size: 14px;
    line-height: normal;
  }

  .calc-text--gap,
  .calc-text--mobile-line {
    display: block;
  }

  .calc-text--desktop-second {
    display: none;
  }

  .calc-text--gap {
    height: 0;
    overflow: hidden;
    line-height: normal;
  }

  .calc-formats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;
    text-align: left;
  }

  .calc-form {
    gap: 16px;
  }

  .calc-upload-zone {
    padding: 16px 32px;
    gap: 16px;
    border-width: 2px;
    border-radius: 8px;
  }

  .calc-upload-title {
    font-size: 16px;
  }

  .calc-upload-files :deep(.upload:not(.has-files):not(.is-uploading):not(.has-guest-message)) {
    height: 0;
    min-height: 0;
    overflow: hidden;
  }

  .calc-upload-files :deep(.upload.has-guest-message) {
    height: auto;
    min-height: 0;
    padding: 0;
    overflow: visible;
  }

  .calc-upload-files :deep(.upload-subtitle) {
    margin: 0;
    font-family: 'Montserrat-Medium', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
    color: #e84261;
    text-align: left;
  }

  .calc-upload-files :deep(.custom) {
    align-items: flex-start;
    text-align: left;
  }

  .action-row {
    gap: 8px;
  }

  .calc-order-type-item :deep(.el-select__wrapper) {
    height: 40px;
    min-height: 40px;
    padding: 0 8px;
    border-radius: 10px;
    font-size: 14px;
  }

  .calc-order-type-item :deep(.el-select__suffix) {
    width: 20px;
    height: 20px;
  }

  .calc-order-type-item :deep(.el-select__suffix .el-icon) {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }

  .calc-order-type-item :deep(.el-select__placeholder),
  .calc-order-type-item :deep(.el-select__selected-item),
  .calc-order-type-item :deep(.el-select__selection-text) {
    font-family: 'Montserrat-SemiBold', sans-serif !important;
    font-size: 14px !important;
    font-weight: normal !important;
    line-height: normal !important;
    letter-spacing: 0 !important;
    color: #000000 !important;
  }

  .calc-submit-button {
    height: 40px;
    min-height: 40px;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 14px;
    text-transform: capitalize;
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
  padding: 20px !important;
  background: #fff !important;
  border: none !important;
  border-radius: 20px !important;
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
  height: 50px;
  padding: 10px 0 !important;
  color: #000 !important;
  background: #fff !important;
  font-family: 'Montserrat-Medium', sans-serif !important;
  font-size: 18px !important;
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
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0;
}

.calc-order-type-item .select-wrapper.full .el-select__placeholder,
.calc-order-type-item .select-wrapper.full .el-select__selection-text,
.calc-order-type-item .select-wrapper.full .el-select__selected-item {
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-weight: normal !important;
  line-height: normal !important;
  letter-spacing: 0 !important;
}

@media (max-width: 768px) {
  .calc-order-type-item .select-wrapper.full .el-select__wrapper {
    font-size: 14px;
  }

  .calc-order-type-item .select-wrapper.full .el-select__placeholder,
  .calc-order-type-item .select-wrapper.full .el-select__selection-text,
  .calc-order-type-item .select-wrapper.full .el-select__selected-item {
    font-size: 14px !important;
    color: #000000 !important;
  }
}

@media (min-width: 769px) {
  .calc-order-type-item .select-wrapper.full .el-select__wrapper {
    font-size: 24px;
  }

  .calc-order-type-item .select-wrapper.full .el-select__placeholder,
  .calc-order-type-item .select-wrapper.full .el-select__selection-text,
  .calc-order-type-item .select-wrapper.full .el-select__selected-item {
    font-size: 24px !important;
    color: #55585b !important;
  }
}
</style>
