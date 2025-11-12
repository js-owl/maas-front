<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

type UploadFile = {
  name: string
  size: number
}

const formModel = ref({
  name: '',
  phone: '',
})

const isSubmitting = ref(false)
const selectedFiles = ref<UploadFile[]>([])

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

// const onFilesChange = (files: FileList | null) => {
//   if (!files) return
//   selectedFiles.value = Array.from(files).map(f => ({ name: f.name, size: f.size }))
// }

const submit = () => {
  if (!formModel.value.name || formModel.value.phone.length < 6) return
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
  }, 1000)
}
</script>

<template>
  <section class="section-basic">
    
    <div class="calc-wrap" :class="{ mobile: isMobile }">
      <div class="calc-left">
        <div class="section-title">РАСЧЕТ СТОИМОСТИ ПО ЧЕРТЕЖАМ</div>
        <p class="lead">
          Проведем расчет стоимости детали по вашему чертежу в течение 5 рабочих дней, а также вы
          получите анализ и рекомендации по оптимизации процесса изготовления
        </p>
      </div>

      <div class="calc-right">
        <el-form :model="formModel" class="calc-form" label-position="top">
          <el-form-item>
            <el-input v-model="formModel.name" placeholder="Имя" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formModel.phone" placeholder="Телефон" />
          </el-form-item>
          <UploadDrawings2 color="#fff" />

          <div class="formats">Форматы: TIF, PDF, JPG</div>

          <el-button type="primary" class="submit-btn" :loading="isSubmitting" @click="submit">
            Отправить
          </el-button>

          <ul v-if="selectedFiles.length" class="files-list">
            <li v-for="f in selectedFiles" :key="f.name">{{ f.name }}</li>
          </ul>
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

.submit-btn {
  background: var(--bgcolor);
  border: none;
  padding: 20px 40px;
  font-size: 20px;
  font-weight: 500;
  color: #000;
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
}
</style>
