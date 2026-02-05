<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import Select from '../ui/Select.vue'
import Button from '../ui/Button.vue'
import UploadFiles from '../UploadFiles.vue'

const router = useRouter()
const formModel = ref({
  name: '',
  phone: '',
})

const isSubmitting = ref(false)
let document_ids = ref<number[]>([])
const selectedOrderType = ref<string>('')

const orderTypeOptions = [
  { label: 'мехобработка', value: '/milling' },
  { label: '3D-печать', value: '/printing' },
  { label: 'прочее', value: '/other' },
]

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

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
  if (!selectedOrderType.value) return

  isSubmitting.value = true
  router
    .push({
      path: selectedOrderType.value,
      query: {
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
        <div style="font-size: 40px; font-weight: 700;">Производство под вашу потребность</div>
        <p class="lead">
          Проведем расчет стоимости детали по 3D-модели в течении 5 рабочих дней, а также вы
          получите анализ и рекомендации по оптимизации процесса изготовления
        </p>
      </div>

      <div class="calc-right">
        <el-form :model="formModel" class="calc-form" label-position="top">
          <UploadFiles v-model="document_ids" color="#000" />
          <div class="action-row">
            <el-form-item>
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
            <Button :loading="isSubmitting" @click="submit">
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.calc-wrap.mobile {
  grid-template-columns: 1fr;
}
.calc-left{
  padding-right: 60px;
}
.calc-left .lead {
  color: #4c4c4c;
  font-size: 24px;
  margin-bottom: 0;
}

.calc-right {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
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
:deep(.el-input__wrapper) {
  padding: 0;
}
:deep(.el-input__inner) {
  background-color: var(--bgcolor);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  /* color: black; */
  padding: 20px;
}

@media (max-width: 768px) {
  .calc-right {
    padding: 16px;
  }

  .action-row {
    flex-direction: column;
  }
}
</style>
