<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { req_json_auth } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";

const document_ids = defineModel<number[]>({ default: [] });
const { color = "white" } = defineProps({
  color: String,
});

const authStore = useAuthStore();
const isUploading = ref(false);
const fileInput = ref<HTMLInputElement>();

const isDisabled = () => {
  if (authStore.getToken) {
    return false;
  }
  return true;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data:type;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleFileUpload = async (file: File) => {
  if (!authStore.getToken) {
    return;
  }

  isUploading.value = true;
  
  try {
    const base64Data = await fileToBase64(file);
    
    const response = await req_json_auth('/documents', 'POST', {
      file_name: file.name,
      file_data: base64Data,
      description: 'Document'
    });

    if (response) {
      const data = await response.json();
      console.log("loadDoc", data);
      const id = Number(data?.document_id);
      
      if (!Array.isArray(document_ids.value)) {
        document_ids.value = [];
      }
      if (Number.isFinite(id) && !document_ids.value.includes(id)) {
        document_ids.value.push(id);
        ElMessage.success('Документ успешно загружен');
      }
    }
  } catch (error) {
    console.error('Upload error:', error);
    ElMessage.error('Ошибка при загрузке документа');
  } finally {
    isUploading.value = false;
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    Array.from(files).forEach(file => {
      handleFileUpload(file);
    });
  }
};

const handleUploadClick = () => {
  if (!authStore.getToken) {
    return;
  }
  fileInput.value?.click();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files) {
    Array.from(files).forEach(file => {
      handleFileUpload(file);
    });
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<template>
  <div
    class="upload"
    :style="{ '--border-color': color }"
    :class="{ 'is-disabled': isDisabled(), 'is-uploading': isUploading }"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="handleUploadClick"
  >
    <div class="custom">
      <IconDrawing
        :color="color"
        style="display: block; width: 100px; height: 100px"
      />
      <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
        {{ isUploading ? 'Загрузка...' : 'Чертежи, документация' }}
      </div>
      <input
        type="file"
        accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
        multiple
        @change="handleFileChange"
        style="display: none"
        ref="fileInput"
      />
    </div>
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
