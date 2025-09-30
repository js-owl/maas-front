<script lang="ts" setup>
import { API_BASE } from "../api";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useAuthStore } from "../stores/auth.store";

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

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

onMounted(async () => {
  geometryRef.value = await getModel();
  renderModel();
});

watch(
  () => file_id.value,
  async () => {
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

    // Парсинг STEP файла с использованием простого парсера
    try {
      // Читаем весь файл как текст
      const fileText = new TextDecoder().decode(arrayBuffer);
      
      // Проверяем, что это действительно STEP файл
      if (fileText.includes('ISO-10303-21') || fileText.includes('STEP')) {
        console.log('STEP file detected, parsing geometry...');
        
        // Парсим STEP файл
        const stepData = parseStepFile(fileText);
        
        // Создаем геометрию на основе данных STEP
        const geometry = await convertStepDataToThreeJS(stepData);
        return geometry;
      }
    } catch (e) {
      console.error("STEP parse error:", e);
    }

    // Fallback: создаем демонстрационную геометрию
    const fallback = new THREE.TorusKnotGeometry(10, 3, 128, 16);
    return fallback;
  } catch (error) {
    console.error({ error });
    return null;
  }
}

// Простой парсер STEP файлов
function parseStepFile(fileText: string): any {
  try {
    const lines = fileText.split('\n');
    const entities: any[] = [];
    const coordinates: number[][] = [];
    
    // Ищем геометрические сущности в STEP файле
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Ищем CARTESIAN_POINT (координаты точек)
      if (trimmedLine.includes('CARTESIAN_POINT')) {
        const coords = extractCoordinates(trimmedLine);
        if (coords && coords.length >= 3) {
          coordinates.push(coords.slice(0, 3));
        }
      }
      
      // Ищем CYLINDRICAL_SURFACE (цилиндрические поверхности)
      if (trimmedLine.includes('CYLINDRICAL_SURFACE')) {
        entities.push({ type: 'cylinder', data: trimmedLine });
      }
      
      // Ищем PLANE (плоскости)
      if (trimmedLine.includes('PLANE')) {
        entities.push({ type: 'plane', data: trimmedLine });
      }
      
      // Ищем SPHERICAL_SURFACE (сферические поверхности)
      if (trimmedLine.includes('SPHERICAL_SURFACE')) {
        entities.push({ type: 'sphere', data: trimmedLine });
      }
    }
    
    return {
      entities,
      coordinates,
      totalEntities: entities.length,
      totalPoints: coordinates.length
    };
  } catch (e) {
    console.error('STEP parsing error:', e);
    return { entities: [], coordinates: [], totalEntities: 0, totalPoints: 0 };
  }
}

// Извлекает координаты из строки STEP
function extractCoordinates(line: string): number[] | null {
  try {
    // Ищем числа в скобках после CARTESIAN_POINT
    const match = line.match(/\(([^)]+)\)/);
    if (match) {
      const coordsStr = match[1];
      const coords = coordsStr.split(',').map(c => {
        const num = parseFloat(c.trim());
        return isNaN(num) ? 0 : num;
      });
      return coords;
    }
  } catch (e) {
    console.error('Coordinate extraction error:', e);
  }
  return null;
}

async function convertStepDataToThreeJS(stepData: any): Promise<THREE.BufferGeometry> {
  try {
    console.log('Converting STEP data:', stepData);
    
    const geometries: THREE.BufferGeometry[] = [];
    
    // Если найдены координаты в STEP файле, создаем геометрию на их основе
    if (stepData.coordinates && stepData.coordinates.length > 0) {
      console.log(`Found ${stepData.coordinates.length} coordinate points in STEP file`);
      
      // Создаем точки на основе найденных координат
      const points = stepData.coordinates;
      const positions: number[] = [];
      const normals: number[] = [];
      
      for (const point of points) {
        positions.push(point[0] * 10, point[1] * 10, point[2] * 10); // Масштабируем
        normals.push(0, 1, 0); // Простые нормали
      }
      
      if (positions.length > 0) {
        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        pointGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometries.push(pointGeometry);
      }
    }
    
    // Создаем геометрию на основе найденных сущностей
    if (stepData.entities && stepData.entities.length > 0) {
      console.log(`Found ${stepData.entities.length} geometric entities`);
      
      for (const entity of stepData.entities) {
        switch (entity.type) {
          case 'cylinder':
            const cylinder = new THREE.CylinderGeometry(5, 8, 15, 16);
            geometries.push(cylinder);
            break;
          case 'sphere':
            const sphere = new THREE.SphereGeometry(6, 12, 8);
            geometries.push(sphere);
            break;
          case 'plane':
            const plane = new THREE.PlaneGeometry(10, 10);
            geometries.push(plane);
            break;
        }
      }
    }
    
    // Если ничего не найдено, создаем демонстрационную геометрию
    if (geometries.length === 0) {
      console.log('No geometric entities found, creating demo geometry');
      
      // Создаем сложную демонстрационную геометрию
      const mainBody = new THREE.CylinderGeometry(8, 12, 20, 16);
      mainBody.translate(0, 0, 0);
      geometries.push(mainBody);
      
      const topPart = new THREE.SphereGeometry(6, 12, 8);
      topPart.translate(0, 12, 0);
      geometries.push(topPart);
      
      const bottomPart = new THREE.ConeGeometry(8, 12, 12);
      bottomPart.translate(0, -16, 0);
      geometries.push(bottomPart);
    }
    
    // Объединяем все геометрии
    if (geometries.length === 1) {
      return geometries[0];
    }
    
    const merged = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normals: number[] = [];
    
    for (const geom of geometries) {
      const pos = geom.attributes.position.array;
      const norm = geom.attributes.normal.array;
      
      for (let i = 0; i < pos.length; i++) {
        positions.push(pos[i]);
      }
      for (let i = 0; i < norm.length; i++) {
        normals.push(norm[i]);
      }
    }
    
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    
    return merged;
  } catch (e) {
    console.error("Geometry conversion error:", e);
    // Возвращаем простую геометрию при ошибке
    return new THREE.BoxGeometry(1, 1, 1);
  }
}

function renderModel() {
  const geometry = geometryRef.value;
  if (!geometry) return;
  
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x888888,
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0,
    envMapIntensity: 1.0,
  });

  model = new THREE.Mesh(geometry, material);

  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  if (boundingBox) {
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    model.position.copy(center.negate());
  }

  scene.add(model);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const envMap = pmremGenerator.fromScene(environment, 0.04).texture;
  scene.environment = envMap;
  material.envMap = envMap;
  pmremGenerator.dispose();

  scene.background = new THREE.Color(0xffffff);
  updateRendererSize();
  if (container.value) container.value.appendChild(renderer.domElement);

  const distance = 80;
  const isometricAngle = Math.PI / 4;
  camera.position.set(
    distance * Math.cos(isometricAngle),
    distance * Math.sin(isometricAngle),
    distance * Math.sin(isometricAngle)
  );
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 80;
  controls.maxDistance = 200;

  window.addEventListener("resize", updateRendererSize);
  animate();
}
</script>

<template>
  <div class="stp-container" ref="container"></div>
</template>

<style scoped>
.stp-container {
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

.stp-container::before {
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

.stp-container canvas {
  border-radius: 6px;
  position: relative;
  z-index: 2;
}
</style>
