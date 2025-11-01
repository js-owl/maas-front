<script lang="ts" setup>
import { ref } from "vue";
import { API_BASE } from "../../api";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useAuthStore } from "../../stores/auth.store";

const authStore = useAuthStore();

type Props = {
  fileId: number;
};

const props = defineProps<Props>();

const previewImage = ref<string>("");
const isLoading = ref(false);

// OCCT для STP файлов
let occt: any = null;
let occtLoadingPromise: Promise<void> | null = null;

// Загрузка OCCT библиотеки
async function loadOCCTLibrary(): Promise<void> {
  if (occt) return;

  if (occtLoadingPromise) {
    return occtLoadingPromise;
  }

  occtLoadingPromise = (async () => {
    try {
      // @ts-ignore - occt-import-js не имеет типов
      const occtimportjs = (await import("occt-import-js")).default;
      occt = await occtimportjs({
        locateFile: (path: string) => {
          if (path.endsWith(".wasm")) {
            return `${import.meta.env.VITE_BASE_PATH || "/"}occt-import-js.wasm`;
          }
          return path;
        },
      });
    } catch (e) {
      console.error("OCCT library loading failed:", e);
      throw e;
    }
  })();

  return occtLoadingPromise;
}

// Определение типа файла
async function detectFileType(fileId: number): Promise<string | null> {
  try {
    const headers = new Headers();
    if (authStore.getToken) {
      headers.append("Authorization", `Bearer ${authStore.getToken}`);
    }

    const res = await fetch(`${API_BASE}/files/${fileId}`, {
      method: "GET",
      headers: headers,
    });

    if (!res.ok) {
      return null;
    }

    const fileInfo = await res.json();
    const filename = fileInfo.filename || fileInfo.name || "";
    const extension = filename.split(".").pop()?.toLowerCase();

    if (extension === "stl") {
      return "stl";
    } else if (extension === "stp" || extension === "step") {
      return "stp";
    }

    return null;
  } catch (error) {
    console.error("Error detecting file type:", error);
    return null;
  }
}

// Загрузка STP файла и создание геометрии
async function loadSTPGeometry(arrayBuffer: ArrayBuffer): Promise<THREE.BufferGeometry> {
  if (!occt) {
    await loadOCCTLibrary();
  }

  const fileBuffer = new Uint8Array(arrayBuffer);
  const result = occt.ReadStepFile(fileBuffer);

  if (!result.success || !result.meshes || result.meshes.length === 0) {
    throw new Error("Failed to parse STEP file or no meshes found");
  }

  // Если один меш, возвращаем его напрямую
  if (result.meshes.length === 1) {
    const meshInfo = result.meshes[0];
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(meshInfo.attributes.position.array);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    if (meshInfo.attributes.normal) {
      const normals = new Float32Array(meshInfo.attributes.normal.array);
      geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    } else {
      geometry.computeVertexNormals();
    }

    if (meshInfo.index) {
      const indices = new Uint32Array(meshInfo.index.array);
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    return geometry;
  }

  // Для нескольких мешей объединяем их в одну геометрию
  const allPositions: number[] = [];
  const allNormals: number[] = [];
  const allIndices: number[] = [];
  let vertexOffset = 0;

  for (const meshInfo of result.meshes) {
    const positions = meshInfo.attributes.position.array as number[] | Float32Array;
    const positionsArray = Array.from(positions);
    allPositions.push(...positionsArray);

    if (meshInfo.attributes.normal) {
      const normals = meshInfo.attributes.normal.array as number[] | Float32Array;
      allNormals.push(...Array.from(normals));
    }

    if (meshInfo.index) {
      const indices = meshInfo.index.array as number[] | Uint32Array;
      const indicesArray = Array.from(indices).map((idx) => Number(idx) + vertexOffset);
      allIndices.push(...indicesArray);
    } else {
      // Если нет индексов, создаем их последовательно
      const vertexCount = positions.length / 3;
      for (let i = 0; i < vertexCount; i += 3) {
        allIndices.push(
          vertexOffset + i,
          vertexOffset + i + 1,
          vertexOffset + i + 2
        );
      }
    }

    vertexOffset += positions.length / 3;
  }

  const mergedGeometry = new THREE.BufferGeometry();
  mergedGeometry.setAttribute("position", new THREE.Float32BufferAttribute(allPositions, 3));

  if (allNormals.length > 0) {
    mergedGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(allNormals, 3));
  } else {
    mergedGeometry.computeVertexNormals();
  }

  if (allIndices.length > 0) {
    mergedGeometry.setIndex(allIndices);
  }

  return mergedGeometry;
}

// Создание превью из геометрии
function createPreviewFromGeometry(geometry: THREE.BufferGeometry): void {
  const canvas = document.createElement("canvas");
  canvas.width = 80;
  canvas.height = 60;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 80 / 60, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  // Освещение
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Материал и модель
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x888888, // Базовый серый цвет металла
    metalness: 0.9, // Высокая металличность
    roughness: 0.1, // Низкая шероховатость для блеска
    clearcoat: 1.0, // Прозрачное покрытие
    clearcoatRoughness: 0.1, // Шероховатость покрытия
    reflectivity: 1.0, // Высокая отражательная способность
    envMapIntensity: 1.0, // Интенсивность отражения окружения
  });

  const model = new THREE.Mesh(geometry, material);
  scene.add(model);

  // Создаем карту окружения для отражений
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const envMap = pmremGenerator.fromScene(environment, 0.04).texture;
  scene.environment = envMap;
  material.envMap = envMap;
  pmremGenerator.dispose();

  // Центрируем и позиционируем камеру для изометрического вида
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;
  if (boundingBox) {
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    model.position.copy(center.negate());

    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Изометрическая позиция камеры
    const distance = maxDim * 1.5;
    const isometricAngle = Math.PI / 4; // 45 градусов
    camera.position.set(
      distance * Math.cos(isometricAngle),
      distance * Math.sin(isometricAngle),
      distance * Math.sin(isometricAngle)
    );
    camera.lookAt(0, 0, 0);
  }

  // Рендерим один кадр
  renderer.render(scene, camera);

  // Конвертируем в data URL
  previewImage.value = canvas.toDataURL("image/png");

  // Очищаем ресурсы
  renderer.dispose();
  geometry.dispose();
  material.dispose();
}

// Создаем превью изображение
async function generatePreview(): Promise<void> {
  if (!props.fileId) return;

  isLoading.value = true;
  try {
    // Определяем тип файла
    const fileType = await detectFileType(props.fileId);
    if (!fileType) {
      throw new Error("Unable to detect file type");
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/octet-stream");

    // Add auth header only if user is authenticated
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
    let geometry: THREE.BufferGeometry;

    // Загружаем геометрию в зависимости от типа файла
    if (fileType === "stl") {
      geometry = new STLLoader().parse(arrayBuffer);
    } else if (fileType === "stp") {
      geometry = await loadSTPGeometry(arrayBuffer);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Создаем превью из геометрии
    createPreviewFromGeometry(geometry);
  } catch (error) {
    console.error("Error generating preview:", error);
    // Fallback изображение
    previewImage.value =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjVmN2ZhIiBzdHJva2U9IiNkZGQiLz4KPHN2ZyB4PSIyMCIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTk5Ij4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIi8+Cjwvc3ZnPgo8L3N2Zz4K";
  } finally {
    isLoading.value = false;
  }
}

// Генерируем превью при монтировании
generatePreview();
</script>

<template>
  <div class="cad-preview-container">
    <div class="stl-preview">
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
