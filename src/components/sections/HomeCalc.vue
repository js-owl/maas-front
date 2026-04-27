<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import Select from '../ui/Select.vue'
import Button from '../ui/Button.vue'
import UploadFiles from '../UploadFiles.vue'
import { useAuthStore } from '../../stores/auth.store'

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

const orderTypeOptions = [
  { label: 'мехобработка', value: '/milling', service_id: 'cnc-milling' },
  { label: '3D-печать', value: '/printing', service_id: 'printing' },
  { label: 'прочее', value: '/other', service_id: 'other' },
]

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const hasToken = computed(() => Boolean(authStore.getToken))
const hasExternalServiceId = computed(() => Boolean(props.service_id))
const selectedServiceId = computed(
  () => orderTypeOptions.find((option) => option.value === selectedOrderType.value)?.service_id ?? ''
)
const uploadServiceId = computed(() => props.service_id || selectedServiceId.value)
const selectedRoutePath = computed(() => {
  if (selectedOrderType.value) return selectedOrderType.value
  if (!props.service_id) return ''
  return orderTypeOptions.find((option) => option.service_id === props.service_id)?.value ?? ''
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
  <section class="section-basic">
    
    <div class="calc-wrap" :class="{ mobile: isMobile }">
      <div class="calc-left">
        <div class="maas-title">Производство под вашу потребность</div>
        <p class="maas-text">
          Проведем расчет стоимости детали по 3Д-модели или чертежу в течении 5 рабочих дней, а также вы получите анализ и рекомендации по оптимизации процесса изготовления
        </p>
      </div>

      <div class="calc-right">
        <el-form :model="formModel" class="calc-form" label-position="top">
          <UploadFiles
            v-model="document_ids"
            color="#000"
            v-model:stp_id="stp_id"
            :service_id="uploadServiceId"
            class="upload-files-bordered"
          />
          <div class="action-row">
            <el-form-item v-if="!hasExternalServiceId">
              <Select
                v-model="selectedOrderType"
                placeholder="Тип обработки"
                width="100%"
                @change="handleOrderTypeChange"
              >
                <el-option
                  v-for="option in orderTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </Select>
            </el-form-item>
            <Button :loading="isSubmitting" :disabled="!hasToken" @click="submit" class="calc-submit-button">
              Отправить
            </Button>
          </div>
        </el-form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calc-wrap {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  /* height: 500px; */
}

.calc-wrap.mobile {
  flex-direction: column;
}

.calc-left {
  padding-right: 10px;
  width: calc((100% - 20px) / 2);
  box-sizing: border-box;
}
.calc-left .lead {
  color: #4c4c4c;
  font-size: 18px;
  margin-bottom: 0;
  padding-top: 10px;
}

.calc-right {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: calc((100% - 20px) / 2);
  box-sizing: border-box;
  /* padding: 20px; */
  /* flex: 1 1 50%; */
}

.calc-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.calc-form :deep(.el-form-item.asterisk-left.el-form-item--label-top) {
  margin-bottom: 0;
}

.action-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  align-items: stretch;
  justify-content: flex-end;
}

.action-row > * {
  flex: 1 1 50%;
}

.upload-row {
  margin-top: 8px;
}

.upload-btn {
  display: block;
  background: #ce132f;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  cursor: pointer;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.formats {
  color: var(--gray-footer);
  font-size: 20px;
  font-weight: 500;
  margin: 10px 0 14px 2px;
}

.files-list {
  margin-top: 12px;
  font-size: 12px;
  color: #666;
}
.upload-files-bordered :deep(.upload) {
  border: 2px dashed #7d8083;
  border-radius: 10px;
  /* background-color: transparent !important; */
  /* background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
    url('/homePage/about.webp'); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.calc-submit-button {
  --bgcolor: #cbd1d5;
  flex: 0 1 calc(50% - 90px);
  font-family: 'Montserrat-SemiBold', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  min-height: 56px;
  border-radius: 24px;
}

@media (max-width: 768px) {
  .calc-left{
    padding-right: 0px;
    width: 100%;
  }

  .calc-right {
    width: 100%;
    padding: 16px;
  }

  .action-row {
    flex-direction: column;
  }

  .calc-submit-button {
    flex-basis: auto;
  }
}
</style>
