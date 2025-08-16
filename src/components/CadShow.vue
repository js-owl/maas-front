<template>
  <div ref="container" class="stl-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const props = defineProps({
  geometry: THREE.BufferGeometry, // Получаем геометрию из UploadModel
});

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

onMounted(() => {
  scene.background = new THREE.Color(0xffffff);
  updateRendererSize();
  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 50;
  controls.maxDistance = 300;

  window.addEventListener("resize", updateRendererSize);

  // Инициализация камеры и анимации
  camera.position.z = 50;
  animate();
});

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
  controls.update();
  renderer.render(scene, camera);
}

// Обновляем модель при изменении props.geometry
watch(
  () => props.geometry,
  (newGeometry) => {
    if (model) scene.remove(model);
    if (!newGeometry) return;

    const material = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      specular: 0x111111,
      shininess: 200,
    });

    model = new THREE.Mesh(newGeometry, material);

    // Центрируем модель
    newGeometry.computeBoundingBox();
    const boundingBox = newGeometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    model.position.copy(center.negate());

    scene.add(model);

    // Настройка камеры
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.set(0, 0, maxDim * 1.5);
    controls.target.set(0, 0, 0);
    controls.update();
  },
  { immediate: true } // Вызываем при монтировании компонента
);
</script>

<style scoped>
.stl-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
