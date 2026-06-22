<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import Button from '@/components/ui/Button.vue'
import UploadFiles from '@/components/UploadFiles.vue'
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
      'Проведем расчет стоимости детали по 3D-модели или чертежу в течение 5 рабочих дней, а также вы получите анализ и рекомендации по оптимизации процесса изготовления',
  }
)

const router = useRouter()

const isSubmitting = ref(false)
const document_ids = ref<number[]>([])
const stp_id = ref<number | null>(null)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const uploadServiceId = computed(() => props.service_id)
const selectedRoutePath = computed(
  () => orderTypeOptions.find((option) => option.serviceId === props.service_id)?.routePath ?? ''
)

const submit = () => {
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
  <section class="uslugi-calc-section" :class="{ mobile: isMobile }">
    <div class="uslugi-calc-wrap">
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
            class="uslugi-calc-upload-files"
          />
        </div>
        <div class="uslugi-calc-action">
          <Button
            :loading="isSubmitting"
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
  border-radius: 20px;
  box-shadow: 0 11px 7.5px #cbd1d5;
  box-sizing: border-box;
}

.uslugi-calc-wrap {
  display: flex;
  gap: 80px;
  align-items: center;
  width: 100%;
}

.uslugi-calc-section.mobile .uslugi-calc-wrap {
  flex-direction: column;
  gap: 40px;
  align-items: stretch;
}

.uslugi-calc-left {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
}

.uslugi-calc-title {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
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
  gap: 20px;
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
  height: 144px;
  min-height: 144px;
  padding: 20px;
  border: 2px dashed #7d8083;
  border-radius: 10px;
  background-color: #e1e4e6 !important;
  overflow: hidden;
}

.uslugi-calc-upload-files :deep(.upload.has-files) {
  height: auto;
  min-height: 144px;
  overflow: visible;
}

.uslugi-calc-upload-files :deep(.upload:hover:not(.is-disabled)) {
  border-color: #7d8083;
}

.uslugi-calc-upload-files :deep(.custom) {
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
}

.uslugi-calc-upload-files :deep(.el-upload__text) {
  color: #000000 !important;
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: normal !important;
}

.uslugi-calc-upload-files :deep(.upload-subtitle) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  color: #7d8083;
}

.uslugi-calc-upload-files :deep(.upload-subtitle + .upload-subtitle) {
  margin-top: 0;
}

.uslugi-calc-action {
  display: flex;
  justify-content: flex-end;
  width: 100%;
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

@media (max-width: 768px) {
  .uslugi-calc-section {
    border-radius: 0;
    padding: 20px;
  }

  .uslugi-calc-left {
    gap: 24px;
  }

  .uslugi-calc-title {
    font-size: 24px;
  }

  .uslugi-calc-description {
    padding-right: 0;
    font-size: 16px;
  }

  .uslugi-calc-upload-files :deep(.upload) {
    height: auto;
    min-height: 144px;
    padding: 20px;
  }

  .uslugi-calc-upload-files :deep(.el-upload__text) {
    font-size: 18px !important;
  }

  .uslugi-calc-upload-files :deep(.upload-subtitle) {
    font-size: 14px;
  }

  .uslugi-calc-submit-button {
    width: 100% !important;
    font-size: 18px;
  }

  .uslugi-calc-action {
    justify-content: stretch;
  }
}
</style>
