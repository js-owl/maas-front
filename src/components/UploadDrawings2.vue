<script lang="ts" setup>
import { ref } from "vue";
import { uploadDocument, fileToBase64 } from "../api";
import IconDrawing from "../icons/IconDrawing.vue";
import { useAuthStore } from "../stores/auth.store";
import { ElMessage } from "element-plus";

const document_ids = defineModel<number[]>({ default: [] });
const { color = "white", bgColor = "var(--bgcolor)" } = defineProps({
  color: String,
});

const authStore = useAuthStore();
const isUploading = ref(false);

const isDisabled = () => {
  // if (authStore.getToken) {
    return false;
  // }
  // return true;
};

const handleFileChange = async (file: File) => {
  if (!authStore.getToken) {
    return false;
  }

  isUploading.value = true;
  
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Upload document using new API
    const response = await uploadDocument(file.name, base64Data, 'technical_spec');
    
    if (response?.ok) {
      const data = await response.json();
      console.log('Document upload response:', data);
      
      // Update document_ids with the new response format
      const id = Number(data.document_id);
      if (!Array.isArray(document_ids.value)) {
        document_ids.value = [];
      }
      if (Number.isFinite(id) && !document_ids.value.includes(id)) {
        document_ids.value.push(id);
        
        // Save document info to localStorage for persistence
        const documentInfo = {
          id: id,
          original_filename: file.name
        };
        
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
  } finally {
    isUploading.value = false;
  }
  
  return false; // Prevent default upload behavior
};

</script>

<template>
  <el-upload
    class="upload"
    :style="{ '--border-color': color }"
    drag
    :before-upload="handleFileChange"
    :disabled="isDisabled() || isUploading"
  >
    <div class="custom">
      <IconDrawing
        :color="color"
        style="display: block; width: 30px; height: 30px"
      />
      <div class="el-upload__text" :style="{ color }" style="font-size: 20px">
        {{ isUploading ? 'Загрузка...' : 'Чертежи, документация' }}
      </div>
    </div>
  </el-upload>
</template>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 10px;
  border: 1px solid var(--bgcolor);
  background-color: var(--bgcolor) !important;
}
:deep(.el-upload.is-disabled .el-upload-dragger) {
  background-color: var(--bgcolor) !important;
  padding: 10px;
  border: 1px solid var(--bgcolor);
}
.custom {
  display: flex;
  gap: 10px;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}
</style>
