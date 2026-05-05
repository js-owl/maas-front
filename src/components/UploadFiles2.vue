<script lang="ts" setup>
import { computed, ref } from 'vue'
import { uploadDocument, fileToBase64, uploadFile3D } from '../api'
// import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from '../stores/auth.store'
import DialogLogin from './dialog/DialogLogin.vue'
import { ElMessage } from 'element-plus'

const document_ids = defineModel<number[]>({ default: [] })
const props = withDefaults(
  defineProps<{
    color?: string
    stp_id?: number | null
    hideFormatsText?: boolean
  }>(),
  {
    hideFormatsText: false,
  }
)

const emit = defineEmits<{
  (e: 'update:stp_id', value: number | null): void
}>()

const authStore = useAuthStore()
const isLoginDialogVisible = ref(false)
const uploadingCount = ref(0)
const fileInput = ref<HTMLInputElement>()

const isUploading = computed(() => uploadingCount.value > 0)

const isDisabled = () => {
  if (authStore.getToken) return false
  return isUploading.value
}

const processUploadedFile = async (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const isStp = extension === 'stp'

  const base64Data = await fileToBase64(file)

  // Любой STP-файл отправляем в /files и обновляем основной stp_id
  if (isStp) {
    const response = await uploadFile3D(file.name, base64Data, extension || 'stp')
    if (!response?.ok) throw new Error('Upload failed')

    const data = await response.json()
    console.log('STP upload response:', data)
    const id = Number((data as any).id)
    if (!Number.isFinite(id)) return

    emit('update:stp_id', id)
    return
  }

  // Все остальные файлы (включая последующие STP) отправляем как документы
  const response = await uploadDocument(file.name, base64Data, 'technical_spec')
  if (!response?.ok) throw new Error('Upload failed')

  const data = await response.json()
  console.log('Document upload response:', data)
  const id = Number((data as any).document_id)

  if (!Array.isArray(document_ids.value)) document_ids.value = []
  if (!Number.isFinite(id)) return

  if (!document_ids.value.includes(id)) {
    document_ids.value.push(id)
  }
}

const handleFilesUpload = async (files: FileList | File[]) => {
  // if (!authStore.getToken) {
  //   isLoginDialogVisible.value = true
  //   return
  // }

  const list = Array.from(files)

  for (const file of list) {
    uploadingCount.value += 1
    try {
      await processUploadedFile(file)
      ElMessage.success('Документ успешно загружен!')
    } catch (error) {
      console.error('Document upload error:', error)
      ElMessage.error('Ошибка загрузки документа')
    } finally {
      uploadingCount.value -= 1
    }
  }
}

const handleFileChange = (event: Event) => {
  // if (!authStore.getToken) {
  //   isLoginDialogVisible.value = true
  //   return
  // }

  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length) handleFilesUpload(files)
  if (target) target.value = ''
}

const handleUploadClick = () => {
  // if (!authStore.getToken) {
  //   isLoginDialogVisible.value = true
  //   return
  // }

  fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  // if (!authStore.getToken) {
  //   isLoginDialogVisible.value = true
  //   return
  // }
  const files = event.dataTransfer?.files
  if (files && files.length) handleFilesUpload(files)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}
</script>

<template>
  <div>
    <el-tooltip
      content="Необходимо зарегистрироваться"
      placement="top"
      :disabled="true"
    >
      <div
        class="upload"
        :style="{ '--border-color': color }"
        :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
        @click="handleUploadClick"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <div class="custom">
          <!-- <IconDrawing :color="color" style="display: block; width: 30px; height: 30px" /> -->
          <div
            class="el-upload__text montserrat-semibold"
            :style="{ color }"
          >
            {{ isUploading ? 'Загрузка...' : 'Перетащите или выберите файл' }}
          </div>
          <template v-if="!props.hideFormatsText">
            <div class="upload-subtitle">
              Допустимые форматы файлов: STEP, STP, IGES, IGS, SAT, SLDPRT, SLDASM, STL, OBJ, PLY, 3DS, DAE, FBX, BLEND
            </div>
            <div class="upload-subtitle">
              Форматы тех. документации: DWG, DXF, PDF, SVG, AI, EPS
            </div>
          </template>
          <input
            type="file"
            @change="handleFileChange"
            style="display: none"
            ref="fileInput"
            multiple
            aria-label="Загрузка файлов для расчёта"
            :disabled="isDisabled() || isUploading"
          />
        </div>
      </div>
    </el-tooltip>

    <DialogLogin v-model="isLoginDialogVisible" />
  </div>
</template>

<style scoped>
.upload {
  padding: 20px 30px;
  border: 2px dashed var(--border-color, #7d8083);
  background-color: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.upload:hover:not(.is-disabled) {
  border-color: #5f666d;
}

.upload.is-disabled {
  opacity: 0.6;
  cursor: default;
}

.upload.is-uploading {
  opacity: 0.8;
  cursor: wait;
}

.custom {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
}

.custom .el-upload__text {
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  width: 100%;
  max-width: 260px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.upload-subtitle {
  font-family: 'Montserrat-Medium', sans-serif;
  width: 100%;
  font-size: 16px;
  line-height: 1.4;
  color: #3d4146;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 768px) {
  .upload {
    min-height: 150px;
    padding: 20px;
  }

  .custom .el-upload__text {
    font-size: 18px !important;
  }

  .upload-subtitle {
    font-size: 14px;
    line-height: 1.35;
  }
}
</style>
