<script setup>
import { ref, watch, computed } from "vue";
import { API_BASE } from "../api";
import { useAuthStore } from "../stores/auth.store";
// @ts-ignore
import STLViewer from "./STLViewer.vue";
// @ts-ignore
import STPViewer from "./STPViewer.vue";

const authStore = useAuthStore();

const file_id = defineModel();
const fileType = ref<'stl' | 'stp' | null>(null);
const isLoading = ref(true);

// Определяем тип файла по его ID
async function detectFileType(id) {
  if (!id) {
    fileType.value = null;
    isLoading.value = false;
    return;
  }
  
  isLoading.value = true;
  
  try {
    const headers = new Headers();
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: "GET",
      headers: headers,
    });
    
    if (!res.ok) {
      console.error("Failed to fetch file info");
      fileType.value = null;
      isLoading.value = false;
      return;
    }

    const fileInfo = await res.json();
    const filename = fileInfo.filename || fileInfo.name || "";
    const extension = filename.split(".").pop()?.toLowerCase();

    if (extension === "stl") {
      fileType.value = "stl";
    } else if (extension === "stp" || extension === "step") {
      fileType.value = "stp";
    } else {
      fileType.value = null;
    }
  } catch (error) {
    console.error("Error detecting file type:", error);
    fileType.value = null;
  } finally {
    isLoading.value = false;
  }
}

// Отслеживаем изменение file_id
watch(
  () => file_id.value,
  (newFileId) => {
    if (newFileId) {
      detectFileType(newFileId);
    } else {
      fileType.value = null;
      isLoading.value = false;
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="cad-viewer-wrapper">
    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-placeholder">
      <div class="spinner"></div>
      <p>Определение типа файла...</p>
    </div>
    
    <!-- STL Viewer -->
    <STLViewer v-else-if="fileType === 'stl'" v-model="file_id" />
    
    <!-- STP Viewer -->
    <STPViewer v-else-if="fileType === 'stp'" :file-id="file_id" />
    
    <!-- Placeholder для неизвестного типа -->
    <div v-else class="file-type-placeholder">
      <p>Неподдерживаемый формат файла или файл не выбран</p>
    </div>
  </div>
</template>

<style scoped>
.cad-viewer-wrapper {
  width: 100%;
  min-height: 400px;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border: 2px solid var(--left-section-bg);
  border-radius: 8px;
  color: #fff;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-placeholder p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.file-type-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border: 2px solid var(--left-section-bg);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

.file-type-placeholder p {
  margin: 0;
}
</style>
