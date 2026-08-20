<script setup>
import { ref, watch, computed, defineAsyncComponent } from "vue";
import { ElMessage } from "element-plus";
import { fetchWithAuth, fileToBase64 } from "../../api";
import {
  ensureLocalStpCacheReady,
  getLocalStpFileById,
  isServerFileId,
  saveFile3D,
} from "../../helpers/local-stp-files";
import { getFileExtension, resolveCadViewerType } from "../../helpers/model-file-types";

const STLViewer = defineAsyncComponent(() => import("./STLViewer.vue"));
const STPViewer = defineAsyncComponent(() => import("./STPViewer.vue"));

const file_id = defineModel();
const props = defineProps({
  stlOnly: {
    type: Boolean,
    default: false,
  },
});

const detectedType = ref(null);
const isLoading = ref(true);
const isDragOver = ref(false);
const isSavingDrop = ref(false);
const fileInput = ref(null);
let dragDepth = 0;

const showStlDropZone = computed(
  () => props.stlOnly && !file_id.value && !isLoading.value && detectedType.value !== "stl"
);

function fallbackCadType() {
  return props.stlOnly ? "stl" : null;
}

async function detectFileType(id) {
  if (!id) {
    detectedType.value = null;
    isLoading.value = false;
    return;
  }

  if (props.stlOnly) {
    detectedType.value = "stl";
    isLoading.value = false;
    return;
  }

  await ensureLocalStpCacheReady();
  const localFile = getLocalStpFileById(id);
  if (localFile) {
    detectedType.value =
      resolveCadViewerType(localFile.file_type, localFile.file_name) ?? fallbackCadType();
    isLoading.value = false;
    return;
  }

  if (!isServerFileId(id)) {
    detectedType.value = fallbackCadType();
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const res = await fetchWithAuth(`/files/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Failed to fetch file info");
      detectedType.value = fallbackCadType();
      isLoading.value = false;
      return;
    }

    const fileInfo = await res.json();
    detectedType.value =
      resolveCadViewerType(
        fileInfo.file_type,
        fileInfo.original_filename,
        fileInfo.filename,
        fileInfo.name
      ) ?? fallbackCadType();
  } catch (error) {
    console.error("Error detecting file type:", error);
    detectedType.value = fallbackCadType();
  } finally {
    isLoading.value = false;
  }
}

async function saveStlFile(file) {
  const extension = getFileExtension(file.name);
  if (extension !== "stl") {
    ElMessage.warning("Для 3D-печати загрузите STL-файл.");
    return;
  }

  isSavingDrop.value = true;
  try {
    const base64Data = await fileToBase64(file);
    const id = await saveFile3D(file.name, base64Data, "stl");
    file_id.value = id;
  } catch (error) {
    console.error("Error saving STL file:", error);
    ElMessage.error("Ошибка загрузки STL-файла");
  } finally {
    isSavingDrop.value = false;
  }
}

function handleDragEnter(event) {
  if (!props.stlOnly) return;
  event.preventDefault();
  event.stopPropagation();
  dragDepth += 1;
  isDragOver.value = true;
}

function handleDragOver(event) {
  if (!props.stlOnly) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy";
  }
}

function handleDragLeave(event) {
  if (!props.stlOnly) return;
  event.preventDefault();
  event.stopPropagation();
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) {
    isDragOver.value = false;
  }
}

function handleFileDrop(event) {
  if (!props.stlOnly) return;
  event.preventDefault();
  event.stopPropagation();
  dragDepth = 0;
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) saveStlFile(file);
}

function handleFileChange(event) {
  const file = event.target?.files?.[0];
  if (file) saveStlFile(file);
  if (event.target) event.target.value = "";
}

watch(
  () => file_id.value,
  (newFileId) => {
    if (newFileId != null && newFileId !== "") {
      detectFileType(newFileId);
    } else {
      detectedType.value = null;
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="cad-viewer-wrapper"
    :class="{ 'is-stl-drop': stlOnly, 'drag-over': isDragOver }"
    @dragenter.capture="handleDragEnter"
    @dragover.capture="handleDragOver"
    @dragleave.capture="handleDragLeave"
    @drop.capture="handleFileDrop"
  >
    <input
      v-if="stlOnly"
      type="file"
      accept=".stl"
      class="file-input"
      ref="fileInput"
      @change="handleFileChange"
    />

    <div v-if="isLoading || isSavingDrop" class="loading-placeholder">
      <div class="spinner"></div>
      <p>{{ isSavingDrop ? "Загрузка STL-файла..." : "Определение типа файла..." }}</p>
    </div>

    <STLViewer v-else-if="detectedType === 'stl'" v-model="file_id" />

    <div v-else-if="showStlDropZone" class="stl-drop-zone">
      <div class="stl-drop-content">
        <h3>Перетащите STL модель сюда</h3>
        <p>Поддерживаются только файлы .stl</p>
        <button type="button" class="btn-select" @click="fileInput && fileInput.click()">
          Выбрать файл
        </button>
      </div>
    </div>

    <STPViewer v-else-if="detectedType === 'stp' || !file_id" v-model="file_id" />

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

.cad-viewer-wrapper.is-stl-drop {
  position: relative;
}

.cad-viewer-wrapper.drag-over {
  outline: 2px dashed #3d4146;
  outline-offset: -2px;
}

.file-input {
  display: none;
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

.stl-drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: #6c757d;
  text-align: center;
}

.stl-drop-content {
  max-width: 300px;
}

.stl-drop-content h3 {
  margin: 0 0 10px 0;
  color: #495057;
}

.stl-drop-content p {
  margin: 0 0 20px 0;
  color: #6c757d;
}

.btn-select {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #3d4146;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
}

.file-type-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  border: 2px solid var(--gray-footer);
  border-radius: 8px;
  color: #495057;
  font-size: 16px;
  background: #fff;
}

.file-type-placeholder p {
  margin: 0;
}
</style>
