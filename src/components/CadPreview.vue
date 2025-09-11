<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { API_BASE } from "../api";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useAuthStore } from "../stores/auth.store";
import { ElDialog } from "element-plus";

const authStore = useAuthStore();

type Props = {
  fileId: number;
  showFullView?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFullView: false
})

const container = ref<HTMLElement>();
const fullViewContainer = ref<HTMLElement>();
const fullViewVisible = ref(false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const fullViewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

let model: THREE.Mesh | null = null;
let fullViewModel: THREE.Mesh | null = null;
let animationId: number | null = null;
let fullViewAnimationId: number | null = null;
let controls: OrbitControls | null = null;
let fullViewControls: OrbitControls | null = null;

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

onMounted(async () => {
  if (props.fileId) {
    await loadModel();
  }
});

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (fullViewAnimationId) cancelAnimationFrame(fullViewAnimationId);
  window.removeEventListener("resize", updateRendererSize);
  renderer.dispose();
  fullViewRenderer.dispose();
});

watch(() => props.fileId, async () => {
  if (props.fileId) {
    await loadModel();
  }
});

async function loadModel() {
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

    renderModel(geometry);
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

function renderModel(geometry: THREE.BufferGeometry) {
  // Удаляем старую модель
  if (model) {
    scene.remove(model);
  }

  // Создаем материал
  const material = new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    specular: 0x111111,
    shininess: 200,
  });

  model = new THREE.Mesh(geometry, material);

  // Центрируем модель
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  if (boundingBox) {
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    model.position.copy(center.negate());
  }

  scene.add(model);

  // Настройка рендерера
  scene.background = new THREE.Color(0xf0f0f0);
  updateRendererSize();
  if (container.value) {
    container.value.appendChild(renderer.domElement);
  }

  // Настройка камеры
  if (boundingBox) {
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(0, 0, maxDim * 1.5);
  }
  
  // Создаем контроллеры
  if (container.value) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    if (boundingBox) {
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      controls.minDistance = maxDim * 0.8;
      controls.maxDistance = maxDim * 3;
    }
    controls.target.set(0, 0, 0);
    controls.update();
  }

  window.addEventListener("resize", updateRendererSize);
  animate();
}

function updateRendererSize() {
  if (container.value) {
    const width = container.value.clientWidth;
    const height = container.value.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}

function showFullView() {
  if (!model || !props.showFullView) return;
  
  fullViewVisible.value = true;
  
  // Клонируем модель для полноэкранного просмотра
  setTimeout(() => {
    if (fullViewContainer.value && model) {
      const clonedGeometry = model.geometry.clone();
      const clonedMaterial = Array.isArray(model.material) 
        ? model.material.map(mat => mat.clone())
        : model.material.clone();
      fullViewModel = new THREE.Mesh(clonedGeometry, clonedMaterial);
      fullViewModel.position.copy(model.position);
      
      const fullViewScene = new THREE.Scene();
      fullViewScene.background = new THREE.Color(0xffffff);
      fullViewScene.add(fullViewModel);
      
      // Добавляем освещение
      const fullViewAmbientLight = new THREE.AmbientLight(0x404040, 0.4);
      fullViewScene.add(fullViewAmbientLight);
      
      const fullViewDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
      fullViewDirectionalLight.position.set(5, 5, 5);
      fullViewScene.add(fullViewDirectionalLight);
      
      const fullViewCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      fullViewModel.geometry.computeBoundingBox();
      const boundingBox = fullViewModel.geometry.boundingBox;
      if (boundingBox) {
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        fullViewCamera.position.set(0, 0, maxDim * 1.5);
      }
      
      fullViewRenderer.setSize(800, 600);
      fullViewContainer.value.appendChild(fullViewRenderer.domElement);
      
      fullViewControls = new OrbitControls(fullViewCamera, fullViewRenderer.domElement);
      fullViewControls.enableDamping = true;
      fullViewControls.dampingFactor = 0.05;
      if (boundingBox) {
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        fullViewControls.minDistance = maxDim * 0.8;
        fullViewControls.maxDistance = maxDim * 3;
      }
      fullViewControls.target.set(0, 0, 0);
      fullViewControls.update();
      
      function fullViewAnimate() {
        fullViewAnimationId = requestAnimationFrame(fullViewAnimate);
        if (fullViewControls) fullViewControls.update();
        fullViewRenderer.render(fullViewScene, fullViewCamera);
      }
      
      fullViewAnimate();
    }
  }, 100);
}

function closeFullView() {
  fullViewVisible.value = false;
  if (fullViewAnimationId) {
    cancelAnimationFrame(fullViewAnimationId);
    fullViewAnimationId = null;
  }
  if (fullViewContainer.value) {
    fullViewContainer.value.innerHTML = '';
  }
  fullViewRenderer.dispose();
}
</script>

<template>
  <div class="cad-preview-container">
    <div ref="container" class="stl-preview" @click="showFullView"></div>
    
    <el-dialog
      v-model="fullViewVisible"
      title="3D Модель"
      width="90%"
      @close="closeFullView"
    >
      <div ref="fullViewContainer" class="stl-full-view"></div>
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
}

.stl-preview:hover {
  border-color: #577aad;
  box-shadow: 0 2px 8px rgba(87, 122, 173, 0.3);
  transform: scale(1.05);
}

.stl-full-view {
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
