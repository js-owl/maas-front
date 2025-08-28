<script setup>
import { API_BASE } from "../api";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();

const file_id = defineModel();

let geometry = ref();
const container = ref(null);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
let model = null;
let animationId = null;
let controls = null;

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

onMounted(async () => {
  geometry = await getModel();
  renderModel();
});

watch(
  () => file_id.value,
  async (newVal) => {
    console.log(`${newVal}`);
    geometry = await getModel();

    if (model) scene.remove(model);
    if (!geometry) return;

    renderModel();
  }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", updateRendererSize);
  renderer.dispose();
});

function updateRendererSize() {
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  // controls.update(); // Убираем, так как не используем OrbitControls
  renderer.render(scene, camera);
}

async function getModel() {
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
    const geometry = new STLLoader().parse(arrayBuffer);

    return geometry;
  } catch (error) {
    console.error({ error });
  }
}

function renderModel() {
  const material = new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    specular: 0x111111,
    shininess: 200,
  });

  model = new THREE.Mesh(geometry, material);

  // Центрируем модель
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  const center = new THREE.Vector3();
  boundingBox.getCenter(center);
  model.position.copy(center.negate());

  scene.add(model);

  scene.background = new THREE.Color(0xffffff);
  updateRendererSize();
  container.value.appendChild(renderer.domElement);

  // Настройка изометрической камеры
  const distance = 200;
  const isometricAngle = Math.PI / 4; // 45 градусов
  
  // Позиция камеры для изометрического вида
  camera.position.set(
    distance * Math.cos(isometricAngle),
    distance * Math.sin(isometricAngle),
    distance * Math.sin(isometricAngle)
  );
  
  // Камера смотрит на центр сцены
  camera.lookAt(0, 0, 0);
  
  // Отключаем OrbitControls для фиксированного изометрического вида
  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.05;
  // controls.minDistance = 100;
  // controls.maxDistance = 300;

  window.addEventListener("resize", updateRendererSize);

  // Инициализация анимации
  animate();
}
</script>

<template>
  <div ref="container" class="stl-container"></div>
</template>

<style scoped>
.stl-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
