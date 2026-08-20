<script lang="ts" setup>
import { computed, ref } from 'vue'
import { req_json_auth } from '../../api'
import Icon3D from '../../icons/Icon3D.vue'
import { useAuthStore } from '../../stores/auth.store'
import DialogLogin from '../dialog/DialogLogin.vue'
import { ElMessage } from 'element-plus'

const file_id = defineModel<number>()
const props = withDefaults(
  defineProps<{
    color?: string
    accept?: string
  }>(),
  {
    color: 'white',
    accept: '.stp,.step,.stl',
  }
)

const isStlOnly = computed(() => props.accept === '.stl')

const authStore = useAuthStore()
const isLoginDialogVisible = ref(false)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement>()

const isDisabled = () => {
  if (authStore.getToken) {
    return false
  }
  return true
}


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
    const ext = file.name.split('.').pop()?.toLowerCase()
    const allowed = props.accept
      .split(',')
      .map((item) => item.trim().replace(/^\./, '').toLowerCase())
      .filter(Boolean)

    if (!ext || !allowed.includes(ext)) {
      ElMessage.warning(
        isStlOnly.value ? 'Для 3D-печати загрузите STL-файл.' : 'Неподдерживаемый формат файла'
      )
      isUploading.value = false
      return
    }

    const base64Data = await fileToBase64(file)
    const fileType = ext === 'stl' || ext === 'stp' || ext === 'step' ? ext : undefined

    const response = await req_json_auth('/files', 'POST', {
      file_name: file.name,
      file_type: fileType,
      file_data: base64Data,
    })

    if (response) {
      const data = await response.json()
      console.log({ response: data })
      file_id.value = data.id
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
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFileUpload(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true
    return
  }
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
    <div
      class="upload"
      :style="{ '--border-color': props.color }"
      :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
      @click="handleUploadClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
    >
      <div class="custom">
        <Icon3D :color="props.color" style="display: block; width: 30px; height: 30px" />
        <div class="el-upload__text" :style="{ color: props.color }" style="font-size: 20px">
          {{ isUploading ? 'Загрузка...' : isStlOnly ? '3D-модель (STL)' : '3D-модель (STEP/STP)' }}
        </div>
        <input
          type="file"
          :accept="props.accept"
          @change="handleFileChange"
          style="display: none"
          ref="fileInput"
        />
      </div>
    </div>

    <DialogLogin v-model="isLoginDialogVisible" />
  </div>
</template>

<style scoped>
.upload {
  padding: 10px;
  border: 1px solid var(--bgcolor);
  background-color: var(--bgcolor) !important;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload:hover:not(.is-disabled) {
  border-color: #409eff;
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
}
</style>
