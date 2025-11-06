<script lang="ts" setup>
import { ref } from "vue";
import { uploadDocument, fileToBase64 } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";
import DialogLogin from "./dialog/DialogLogin.vue";
import { ElMessage } from "element-plus";

const document_ids = defineModel<number[]>({ default: [] });
const { color = "white" } = defineProps({
  color: String,
});

const authStore = useAuthStore();
const isLoginDialogVisible = ref(false);
const isUploading = ref(false);
const fileInput = ref<HTMLInputElement>();

const isDisabled = () => {
  if (authStore.getToken) {
    return false;
  }
  return true;
};

const uploadSingle = async (file: File) => {
  // Convert file to base64 and upload
  try {
    const base64Data = await fileToBase64(file);
    const response = await uploadDocument(file.name, base64Data, 'technical_spec');

    if (response?.ok) {
      const data = await response.json();
      console.log('Document upload response:', data);
      const id = Number(data.document_id);
      if (!Array.isArray(document_ids.value)) document_ids.value = [];
      if (Number.isFinite(id) && !document_ids.value.includes(id)) {
        document_ids.value.push(id);

        const documentInfo = { id, original_filename: file.name };
        try {
          const stored = localStorage.getItem('uploaded_documents');
          const documents = stored ? JSON.parse(stored) : [];
          if (!documents.find((d: any) => d.id === id)) {
            documents.push(documentInfo);
            localStorage.setItem('uploaded_documents', JSON.stringify(documents));
          }
        } catch (e) {
          console.error('Error saving document to storage:', e);
        }
      }

      ElMessage.success('Документ успешно загружен!');
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Document upload error:', error);
    ElMessage.error('Ошибка загрузки документа');
  }
};

// single-file handler kept via uploadSingle; batch handler below is used by UI

const handleFilesUpload = async (files: FileList | File[]) => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }
  isUploading.value = true;
  try {
    const list = Array.from(files);
    for (const file of list) await uploadSingle(file);
  } finally {
    isUploading.value = false;
  }
};

const handleFileChange = (event: Event) => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length) handleFilesUpload(files);
  if (target) target.value = "";
};

const handleUploadClick = () => {
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }
  fileInput.value?.click();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (!authStore.getToken) {
    isLoginDialogVisible.value = true;
    return;
  }
  const files = event.dataTransfer?.files;
  if (files && files.length) handleFilesUpload(files);
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

</script>

<template>
  <div>
    <div
      class="upload"
      :style="{ '--border-color': color }"
      :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
      @click="handleUploadClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
    >
      <div class="custom">
        <IconDrawing :color="color" style="display: block; width: 100px; height: 100px" />
        <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
          {{ isUploading ? 'Загрузка...' : 'Чертежи, документация' }}
        </div>
        <input
          type="file"
          @change="handleFileChange"
          style="display: none"
          ref="fileInput"
          multiple
          :disabled="isDisabled() || isUploading"
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 120px;
}
</style>
