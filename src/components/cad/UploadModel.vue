<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { req_json_auth } from '../../api'
import Icon3D from '../../icons/Icon3D.vue'
import { useAuthStore } from '../../stores/auth.store'
import DialogLogin from '../dialog/DialogLogin.vue'

const file_id = defineModel<number>()
const { color = 'white' } = defineProps({
  color: String,
})

const authStore = useAuthStore()
const isLoginDialogVisible = ref(false)
const isUploading = ref(false)

const isAuthorized = computed(() => Boolean(authStore.getToken))

const isDisabled = () => {
  if (authStore.getToken) {
    return false
  }
  return true
}

const fileInput = ref<HTMLInputElement>()

const handleUploadClick = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }
  fileInput.value?.click()
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      // Remove data:type;base64, prefix
      const base64Data = base64.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleFileUpload = async (file: File) => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }

  isUploading.value = true
  
  try {
    const base64Data = await fileToBase64(file)
    const ext = file.name.split('.').pop()?.toLowerCase()
    const fileType = ext === 'stl' || ext === 'stp' || ext === 'step' ? ext : undefined
    
    const response = await req_json_auth('/files', 'POST', {
      file_name: file.name,
      file_type: fileType,
      file_data: base64Data,
      description: '3D Model'
    })

    if (response) {
      const data = await response.json()
      console.log({ response: data })
      file_id.value = data.file_id
      ElMessage.success('Файл успешно загружен')
    }
  } catch (error) {
    console.error('Upload error:', error)
    ElMessage.error('Ошибка при загрузке файла')
  } finally {
    isUploading.value = false
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFileUpload(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    handleFileUpload(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}
</script>

<template>
  <div>
    <el-tooltip content="Необходимо зарегистрироваться" placement="top" :disabled="isAuthorized">
      <div
        class="upload"
        :style="{ '--border-color': color }"
        :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @click="handleUploadClick"
      >
        <div class="custom">
          <Icon3D :color="color" style="display: block; width: 100px; height: 100px" />
          <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
            {{ isUploading ? 'Загрузка...' : '3D-модель (STEP/STP)' }}
          </div>
          <input
            type="file"
            accept=".stp,.step,.stl"
            @change="handleFileChange"
            style="display: none"
            ref="fileInput"
          />
        </div>
      </div>
    </el-tooltip>

    <DialogLogin v-model="isLoginDialogVisible" />
  </div>
</template>

<style scoped>
.upload {
  padding: 10px;
  border: 1px solid var(--border-color);
  background-color: var(--left-section-bg) !important;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload:hover:not(.is-disabled) {
  border-color: #409eff;
}

.upload.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload.is-uploading {
  opacity: 0.8;
  cursor: wait;
}

.custom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 120px;
}
</style>
