<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import Select from '../ui/Select.vue'
import Button from '../ui/Button.vue'
import UploadFiles from '../UploadFiles.vue'
import { orderTypeOptions } from '@/helpers/order-type-options'
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
// const authStore = useAuthStore()

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

// const hasToken = computed(() => Boolean(authStore.getToken))
const hasExternalServiceId = computed(() => Boolean(props.service_id))
const selectedServiceId = computed(
  () =>
    orderTypeOptions.find((option) => option.value === selectedOrderType.value)?.serviceId ?? ''
)
const uploadServiceId = computed(() => props.service_id || selectedServiceId.value)
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
  // if (!formModel.value.name || formModel.value.phone.length < 6) return
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
        <h2 class="calc-title">
          <span class="calc-title-line">Комплекс</span>
          <span class="calc-title-line">предприятий</span>
          <span class="calc-title-line">полного цикла</span>
        </h2>
        <div class="calc-description">
          <p class="calc-text">
            Мы — комплекс предприятий полного цикла. Производим детали любой сложности по вашим
            чертежам: от единичного экземпляра до серии.
          </p>
          <p class="calc-text">
            От чертежа до готового изделия - без посредников и лишних звонков.
          </p>
        </div>
      </div>

      <div class="calc-right">
        <el-form :model="formModel" class="calc-form" label-position="top">
          <div class="calc-upload-zone">
            <h3 class="calc-upload-title">Расчет стоимости изготовления</h3>
            <UploadFiles
              v-model="document_ids"
              color="#d4354f"
              v-model:stp_id="stp_id"
              :service_id="uploadServiceId"
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
            <Button
              flat
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
  gap: 40px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 64px;
  font-weight: 900;
  line-height: normal;
  color: #000000;
}

.calc-title-line {
  display: block;
  width: fit-content;
  text-decoration-line: underline;
  text-decoration-color: #d4354f;
  text-decoration-thickness: 9%;
  text-underline-offset: 0.14em;
  text-decoration-skip-ink: none;
}

.calc-description {
  display: flex;
  flex-direction: column;
  gap: 0;
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
  gap: 40px;
  align-items: center;
  width: 100%;
  padding: 40px;
  border: 4px dashed #d4354f;
  border-radius: 20px;
  box-sizing: border-box;
  text-align: center;
}

.calc-upload-title {
  margin: 0;
  width: 100%;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
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
  color: #d4354f;
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
  gap: 16px;
  width: 100%;
}

.calc-order-type-item {
  width: 100%;
}

.calc-order-type-item :deep(.el-select__wrapper) {
  border-radius: 10px;
  min-height: 69px;
}

.calc-submit-button {
  width: 100%;
  padding: 20px 30px;
  background: #d4354f !important;
  border-radius: 10px;
  color: #ffffff !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 24px;
  font-weight: 600;
  line-height: normal;
  text-transform: uppercase;
  box-shadow: none !important;
}

.calc-submit-button:hover:not(.is-disabled) {
  background: #d4354f !important;
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

@media (max-width: 768px) {
  .calc-section.section-basic {
    border-radius: 0;
    padding: 20px;
  }

  .calc-wrap {
    gap: 40px;
  }

  .calc-left {
    flex: none;
    max-width: none;
    width: 100%;
    gap: 24px;
  }

  .calc-title {
    font-size: 32px;
  }

  .calc-text {
    font-size: 18px;
  }

  .calc-upload-zone {
    padding: 24px 20px;
    gap: 24px;
  }

  .calc-upload-title {
    font-size: 24px;
  }

  .calc-upload-files :deep(.upload-subtitle) {
    font-size: 16px;
  }

  .calc-submit-button {
    font-size: 20px;
    padding: 16px 24px;
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
</style>
