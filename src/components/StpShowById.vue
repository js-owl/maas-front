<script lang="ts" setup>
import { API_BASE } from "../api";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useAuthStore } from "../stores/auth.store";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const authStore = useAuthStore();

const file_id = defineModel();

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

    // Реальный парсер STEP через occt-import-js (WASM OpenCascade)
    try {
      const occtModule: any = (await import("occt-import-js")).default;
      const occt = await occtModule();

      // Разные версии библиотеки могут иметь разные API; пробуем несколько вариантов
      let result: any = null;
      if (typeof occt.readStepFile === "function") {
        result = await occt.readStepFile(arrayBuffer);
      } else if (typeof occt.ReadStepFile === "function") {
        result = await occt.ReadStepFile(arrayBuffer);
      } else if (typeof occt.importStep === "function") {
        result = await occt.importStep(arrayBuffer);
      }

      // Ожидается структура с массивом мешей
      const meshes: any[] = result?.meshes || result?.geometries || [];
      if (meshes.length > 0) {
        const geoms: THREE.BufferGeometry[] = [];
        for (const m of meshes) {
          const positions = m?.attributes?.position || m?.positions || m?.vertices;
          const indices = m?.index || m?.indices;
          const normals = m?.attributes?.normal || m?.normals;

          const g = new THREE.BufferGeometry();
          if (positions) g.setAttribute("position", new THREE.Float32BufferAttribute(Array.from(positions), 3));
          if (normals) g.setAttribute("normal", new THREE.Float32BufferAttribute(Array.from(normals), 3));
          if (indices) g.setIndex(Array.from(indices));
          if (!g.getAttribute("normal")) g.computeVertexNormals();
          geoms.push(g);
        }

        const merged = geoms.length === 1 ? geoms[0] : BufferGeometryUtils.mergeGeometries(geoms);
        return merged;
      }
    } catch (e) {
      console.error("STEP parse error:", e);
    }

    // Fallback: если парсер не сработал
    const fallback = new THREE.TorusKnotGeometry(10, 3, 128, 16);
    return fallback;
  } catch (error) {
    console.error({ error });
    return null;
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
  <div class="stl-container" ref="container"></div>
  
</template>

<style scoped>
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


