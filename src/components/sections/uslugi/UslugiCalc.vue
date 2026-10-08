<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'
import { ElMessage } from 'element-plus'
import Button from '@/components/ui/Button.vue'
import UploadFiles from '@/components/UploadFiles.vue'
import UploadFiles2 from '@/components/UploadFiles2.vue'
import { getLocalStpFileById, localStpCacheVersion } from '@/helpers/local-stp-files'
import { isAllowedModelFile, isPrintingService } from '@/helpers/model-file-types'
import { orderTypeOptions } from '@/helpers/order-type-options'

const props = withDefaults(
  defineProps<{
    service_id?: string
    title?: string
    description?: string
  }>(),
  {
    service_id: '',
    title: 'Производство под вашу потребность',
    description:
      'Проведем расчет стоимости детали по 3D-модели \nили чертежу в течение 5 рабочих дней, а также вы получите анализ и рекомендации по оптимизации процесса изготовления',
  }
)

const router = useRouter()

const isSubmitting = ref(false)
const document_ids = ref<number[]>([])
const stp_id = ref<number | null>(null)

const { isMobile } = usePageBreakpoints()

const uploadServiceId = computed(() => props.service_id)
const selectedRoutePath = computed(
  () => orderTypeOptions.find((option) => option.serviceId === props.service_id)?.routePath ?? ''
)
const isOtherOrder = computed(() => props.service_id === 'other')
const modelKind = computed<'stl' | 'stp' | null>(() => {
  if (!props.service_id || isOtherOrder.value) return null
  return isPrintingService(props.service_id) ? 'stl' : 'stp'
})
const hasRequiredModel = computed(() => {
  if (modelKind.value == null) return true
  if (stp_id.value == null) return false
  if (modelKind.value !== 'stl') return true

  void localStpCacheVersion.value
  const file = getLocalStpFileById(stp_id.value)
  if (!file) return false
  return file.file_type === 'stl' || isAllowedModelFile(file.file_name, props.service_id)
})
const submitBlocked = computed(() => modelKind.value != null && !hasRequiredModel.value)
const submitWarning = computed(() =>
  modelKind.value === 'stl'
    ? 'Для отправки необходимо загрузить STL-модель'
    : 'Для отправки необходимо загрузить STP-модель'
)

const submit = () => {
  if (submitBlocked.value) {
    ElMessage.warning(
      modelKind.value === 'stl'
        ? 'Загрузите STL-модель для расчёта стоимости'
        : 'Загрузите STP-модель для расчёта стоимости'
    )
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

let mobileSubmitTimer: ReturnType<typeof setTimeout> | null = null

watch(
  [document_ids, stp_id],
  () => {
    if (!isMobile.value || isSubmitting.value || submitBlocked.value) return
    if (stp_id.value == null && !(document_ids.value?.length > 0)) return

    if (mobileSubmitTimer) clearTimeout(mobileSubmitTimer)
    mobileSubmitTimer = setTimeout(() => {
      if (!isMobile.value || isSubmitting.value || submitBlocked.value) return
      if (stp_id.value == null && !(document_ids.value?.length > 0)) return
      submit()
    }, 400)
  },
  { deep: true }
)
</script>

<template>
  <section class="uslugi-calc-section" :class="{ mobile: isMobile }">
    <template v-if="isMobile">
      <UploadFiles2
        v-model="document_ids"
        color="#000"
        :hide-formats-text="true"
        upload-text="Загрузите файлы"
        :service_id="uploadServiceId"
        :allow-any-file-type="isOtherOrder"
        v-model:stp_id="stp_id"
        class="uslugi-calc-upload-files-mobile"
      />
    </template>

    <div v-else class="uslugi-calc-wrap">
      <div class="uslugi-calc-left">
        <h2 class="uslugi-calc-title">{{ title }}</h2>
        <p class="uslugi-calc-description">{{ description }}</p>
      </div>

      <div class="uslugi-calc-right">
        <div class="uslugi-calc-upload-zone">
          <UploadFiles
            v-model="document_ids"
            v-model:stp_id="stp_id"
            color="#000000"
            :service_id="uploadServiceId"
            :allow-any-file-type="isOtherOrder"
            class="uslugi-calc-upload-files"
          />
        </div>
        <div class="uslugi-calc-action">
          <p v-if="submitBlocked" class="uslugi-calc-submit-warning" role="alert">
            {{ submitWarning }}
          </p>
          <Button
            :loading="isSubmitting"
            :disabled="submitBlocked"
            width="auto"
            class="uslugi-calc-submit-button"
            @click="submit"
          >
            Отправить
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.uslugi-calc-section {
  margin: 0 0 40px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
  box-sizing: border-box;
}

.uslugi-calc-wrap {
  display: flex;
  gap: 80px;
  align-items: center;
  width: 100%;
}

.uslugi-calc-left {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 40px;
  min-width: 0;
}

.uslugi-calc-title {
  margin: 0;
  width: 100%;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  color: #000000;
  word-break: break-word;
}

.uslugi-calc-description {
  margin: 0;
  padding-right: 20px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  word-break: break-word;
  white-space: pre-wrap;
}

.uslugi-calc-right {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  min-width: 0;
}

.uslugi-calc-upload-zone {
  width: 100%;
}

.uslugi-calc-upload-files {
  width: 100%;
}

.uslugi-calc-upload-files :deep(.upload) {
  box-sizing: border-box;
  width: 100%;
  height: auto;
  min-height: 0;
  padding: 30px;
  border: 2px dashed #e84261;
  border-radius: 20px;
  background-color: transparent !important;
  overflow: visible;
}

.uslugi-calc-upload-files :deep(.upload.has-files) {
  height: auto;
  min-height: 0;
  overflow: visible;
}

.uslugi-calc-upload-files :deep(.upload:hover:not(.is-disabled)) {
  border-color: #e84261;
}

.uslugi-calc-upload-files :deep(.custom) {
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 20px;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.uslugi-calc-upload-files :deep(.el-upload__text) {
  color: #000000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
}

.uslugi-calc-upload-files :deep(.upload-subtitle) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
  text-align: center;
  color: #e84261;
}

.uslugi-calc-upload-files :deep(.upload-subtitle + .upload-subtitle) {
  margin-top: -12px;
}

.uslugi-calc-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
}

.uslugi-calc-submit-warning {
  margin: 0;
  width: 100%;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  color: #e84261;
  text-align: right;
}

.uslugi-calc-submit-button {
  padding: 12px 24px !important;
  background: #cbd1d5 !important;
  border-radius: 30px !important;
  color: #000000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  box-shadow: none !important;
}

.uslugi-calc-submit-button:hover:not(.is-disabled) {
  background: #cbd1d5 !important;
  box-shadow: none !important;
  transform: none;
}

.uslugi-calc-submit-button:active:not(.is-disabled) {
  transform: none;
  box-shadow: none !important;
}

.uslugi-calc-submit-button.is-disabled,
.uslugi-calc-submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.uslugi-calc-upload-files-mobile {
  width: 100%;
}

.uslugi-calc-upload-files-mobile :deep(.upload) {
  min-height: 0;
  padding: 16px 32px;
  border-radius: 8px;
  border: 2px dashed var(--button-bg);
  background-color: transparent !important;
}

.uslugi-calc-upload-files-mobile :deep(.custom .el-upload__text) {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px !important;
  font-weight: 600;
  line-height: normal;
  max-width: none;
  color: #000 !important;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .uslugi-calc-wrap {
    gap: 40px;
  }

  .uslugi-calc-description {
    padding-right: 0;
  }
}

@media (max-width: 768px) {
  .uslugi-calc-section.mobile {
    margin: 0;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 0 5px #c8cfe3;
  }
}
</style>
