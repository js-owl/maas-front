<script lang="ts" setup>
import { API_BASE } from "../api";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useAuthStore } from "../stores/auth.store";
import { loadGeometry, getFileTypeInfo } from "../utils/fileUtils";

const authStore = useAuthStore();

const file_id = defineModel<number>();

const geometryRef = ref<THREE.BufferGeometry | null>(null);
const container = ref<HTMLDivElement | null>(null);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
let model: THREE.Mesh | null = null;
let animationId: number | null = null;
let controls: OrbitControls | null = null;
const fileTypeInfo = ref(getFileTypeInfo('unknown'));

// Освещение для металлического эффекта
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Основной направленный свет
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Дополнительный свет для лучшего освещения
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-5, 3, -5);
scene.add(directionalLight2);

// Точечный свет для акцентов
const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

onMounted(async () => {
  geometryRef.value = await getModel();
  renderModel();
});

watch(
  () => file_id.value,
  async (newVal) => {
    console.log(`${newVal}`);
    geometryRef.value = await getModel();

    if (model) scene.remove(model);
    if (!geometryRef.value) return;

    renderModel();
  }
);

onBeforeUnmount(() => {
  if (animationId !== null) cancelAnimationFrame(animationId);
  window.removeEventListener("resize", updateRendererSize);
  renderer.dispose();
});

function updateRendererSize() {
  if (!container.value) return;
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  controls?.update();
  renderer.render(scene, camera);
}

async function getModel(): Promise<THREE.BufferGeometry | null> {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/octet-stream");
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const res = await fetch(`${API_BASE}/files/${file_id.value}/download`, {
      method: "GET",
      headers: headers,
    });
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Определяем тип файла по содержимому/заголовку
    let fileType: 'stl' | 'stp' | 'step' = 'stl';
    try {
      const headerBytes = arrayBuffer.slice(0, Math.min(512, arrayBuffer.byteLength));
      const headerText = new TextDecoder().decode(headerBytes);
      // STEP-файлы обычно содержат маркер ISO-10303-21 в первых строках
      if (headerText.includes('ISO-10303-21')) fileType = 'step';
    } catch (_) {}

    fileTypeInfo.value = getFileTypeInfo(fileType);

    // Загружаем геометрию в зависимости от типа файла
    const geometry = await loadGeometry(arrayBuffer, fileType);
    
    if (!geometry) {
      throw new Error(`Не удалось загрузить файл типа ${fileType}`);
    }

    return geometry;
  } catch (error) {
    console.error({ error });
    return null;
  }
}

function renderModel() {
  const geometry = geometryRef.value;
  if (!geometry) return;
  // Создаем металлический материал
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x888888, // Базовый серый цвет металла
    metalness: 0.9, // Высокая металличность
    roughness: 0.1, // Низкая шероховатость для блеска
    clearcoat: 1.0, // Прозрачное покрытие
    clearcoatRoughness: 0.1, // Шероховатость покрытия
    reflectivity: 1.0, // Высокая отражательная способность
    envMapIntensity: 1.0, // Интенсивность отражения окружения
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

  // Создаем карту окружения для отражений (корректно)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const envMap = pmremGenerator.fromScene(environment, 0.04).texture;
  scene.environment = envMap;
  material.envMap = envMap;
  pmremGenerator.dispose();

  // Устанавливаем фон сцены
  scene.background = new THREE.Color(0xffffff); // Темно-синий фон для контраста
  updateRendererSize();
  if (container.value) container.value.appendChild(renderer.domElement);

  // Настройка изометрической камеры
  const distance = 80;
  const isometricAngle = Math.PI / 4; // 45 градусов

  // Позиция камеры для изометрического вида
  camera.position.set(
    distance * Math.cos(isometricAngle),
    distance * Math.sin(isometricAngle),
    distance * Math.sin(isometricAngle)
  );

  // Камера смотрит на центр сцены
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 80;
  controls.maxDistance = 200;

  window.addEventListener("resize", updateRendererSize);

  // Инициализация анимации
  animate();
}
</script>

<template>
  <div class="cad-viewer-wrapper">
    <div class="file-info" v-if="fileTypeInfo.name !== 'Неизвестный'">
      <div 
        class="file-type-badge"
        :style="{ backgroundColor: fileTypeInfo.color }"
      >
        {{ fileTypeInfo.name }}
      </div>
      <div class="file-description">{{ fileTypeInfo.description }}</div>
    </div>
    <div ref="container" class="stl-container"></div>
  </div>
</template>

<style scoped>
.cad-viewer-wrapper {
  width: 100%;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 4px 0;
}

.file-type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.file-description {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.stl-container {
  width: 100%;
  height: 400px;
  border: 2px solid var(--left-section-bg);
  border-radius: 8px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
}

.stl-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
  z-index: 1;
}

.stl-container canvas {
  border-radius: 6px;
  position: relative;
  z-index: 2;
}
</style>
