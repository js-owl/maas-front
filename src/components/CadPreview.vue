<script lang="ts" setup>
import { ref } from "vue";
import { API_BASE } from "../api";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { useAuthStore } from "../stores/auth.store";
import { ElDialog } from "element-plus";
import CadShowById from "./CadShowById.vue";

const authStore = useAuthStore();

type Props = {
  fileId: number;
  showFullView?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFullView: false
})

const fullViewVisible = ref(false);
const previewImage = ref<string>("");
const isLoading = ref(false);

// Создаем превью изображение
async function generatePreview() {
  if (!props.fileId) return;
  
  isLoading.value = true;
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/octet-stream");
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const res = await fetch(`${API_BASE}/files/${props.fileId}/download`, {
      method: "GET",
      headers: headers,
    });
    
    if (!res.ok) {
      console.error("Failed to load model");
      return;
    }
    
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const geometry = new STLLoader().parse(arrayBuffer);

    // Создаем миниатюру
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 60;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 80/60, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Материал и модель
    const material = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      specular: 0x111111,
      shininess: 200,
    });
    
    const model = new THREE.Mesh(geometry, material);
    scene.add(model);
    
    // Центрируем и позиционируем камеру
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    if (boundingBox) {
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      model.position.copy(center.negate());
      
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(0, 0, maxDim * 1.5);
    }
    
    // Рендерим один кадр
    renderer.render(scene, camera);
    
    // Конвертируем в data URL
    previewImage.value = canvas.toDataURL('image/png');
    
    // Очищаем ресурсы
    renderer.dispose();
    
  } catch (error) {
    console.error("Error generating preview:", error);
    // Fallback изображение
    previewImage.value = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjVmN2ZhIiBzdHJva2U9IiNkZGQiLz4KPHN2ZyB4PSIyMCIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5Ij4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIi8+Cjwvc3ZnPgo8L3N2Zz4K";
  } finally {
    isLoading.value = false;
  }
}

function showFullView() {
  if (!props.showFullView) return;
  fullViewVisible.value = true;
}

function closeFullView() {
  fullViewVisible.value = false;
}

// Генерируем превью при монтировании
generatePreview();
</script>

<template>
  <div class="cad-preview-container">
    <div class="stl-preview" @click="showFullView">
      <div v-if="isLoading" class="loading-placeholder">
        <div class="spinner"></div>
      </div>
      <img 
        v-else-if="previewImage" 
        :src="previewImage" 
        alt="3D Model Preview"
        class="preview-image"
      />
    </div>
    
    <el-dialog
      v-model="fullViewVisible"
      title="3D Модель"
      width="90%"
      @close="closeFullView"
    >
      <div class="full-view-content">
        <CadShowById :file-id="fileId" />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.cad-preview-container {
  width: 100%;
  height: 100%;
}

.stl-preview {
  width: 80px;
  height: 60px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stl-preview:hover {
  border-color: #577aad;
  box-shadow: 0 2px 8px rgba(87, 122, 173, 0.3);
  transform: scale(1.05);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 3px;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #577aad;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.full-view-content {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
