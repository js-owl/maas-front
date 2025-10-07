<template>
  <!-- Your existing template remains unchanged -->
  <div class="stp-viewer">
    <!-- Header -->
    <header class="viewer-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="viewer-title">
            <span class="icon">📐</span>
            STP File Viewer
          </h1>
          <p class="viewer-subtitle">
            Upload and visualize STP/STEP files in your browser
          </p>
        </div>
        <div class="header-right">
          <div class="file-info" v-if="modelInfo">
            <span class="file-type">{{ fileType }}</span>
            <span class="file-size">{{ modelInfo.fileSize }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Controls -->
    <div class="controls-panel">
      <div class="file-controls">
        <input
          type="file"
          @change="handleFileUpload"
          accept=".stp,.step"
          ref="fileInput"
          class="file-input"
        />
        <button @click="fileInputRef.value?.click()" class="btn btn-primary">
          <span class="icon">📁</span>
          Choose STP File
        </button>
        <div class="drag-hint" v-if="!hasModel">
          <span>or drag & drop your file here</span>
        </div>
      </div>

      <div class="view-controls" v-if="hasModel">
        <button @click="resetCamera" class="btn btn-outline">
          <span class="icon">🎯</span>
          Reset View
        </button>
        <button @click="toggleWireframe" class="btn btn-outline">
          <span class="icon">{{ wireframe ? "🔲" : "⬜" }}</span>
          {{ wireframe ? "Solid" : "Wireframe" }}
        </button>
        <button @click="toggleGrid" class="btn btn-outline">
          <span class="icon">{{ showGrid ? "⊞" : "⊠" }}</span>
          {{ showGrid ? "Hide Grid" : "Show Grid" }}
        </button>
        <select
          v-model="selectedMesh"
          @change="focusOnMesh"
          class="mesh-select"
          v-if="meshes.length > 1"
        >
          <option value="">All Parts</option>
          <option v-for="(mesh, index) in meshes" :key="index" :value="index">
            {{ mesh.name || `Part ${index + 1}` }}
          </option>
        </select>
      </div>
    </div>

    <!-- 3D Canvas Container -->
    <div
      ref="canvasContainer"
      class="canvas-container"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleFileDrop"
      :class="{ 'drag-over': isDragOver }"
    >
      <!-- Loading Overlay -->
      <div v-if="loading" class="overlay loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <h3>Loading STP File</h3>
          <p>{{ loadingStatus }}</p>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: loadingProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error Overlay -->
      <div v-if="error" class="overlay error-overlay">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>Error Loading File</h3>
          <p>{{ error }}</p>
          <button @click="clearError" class="btn btn-danger">Try Again</button>
        </div>
      </div>

      <!-- Drop Zone -->
      <div v-if="!hasModel && !loading && !error" class="overlay drop-zone">
        <div class="drop-content">
          <div class="drop-icon">📁</div>
          <h3>Drop your STP file here</h3>
          <p>Supports .stp and .step files</p>
          <button
            @click="fileInputRef.value?.click()"
            class="btn btn-primary large"
          >
            <span class="icon">📁</span>
            Browse Files
          </button>
        </div>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="info-panel" v-if="modelInfo">
      <div class="info-header">
        <h3>
          <span class="icon">ℹ️</span>
          Model Information
        </h3>
        <button @click="toggleInfoPanel" class="toggle-btn">
          {{ showInfoPanel ? "▼" : "▲" }}
        </button>
      </div>

      <div v-show="showInfoPanel" class="info-content">
        <div class="info-grid">
          <div class="info-card">
            <div class="info-label">File Type</div>
            <div class="info-value">{{ fileType }}</div>
          </div>
          <div class="info-card">
            <div class="info-label">File Size</div>
            <div class="info-value">{{ modelInfo.fileSize }}</div>
          </div>
          <div class="info-card">
            <div class="info-label">Parts</div>
            <div class="info-value">{{ modelInfo.meshCount || 1 }}</div>
          </div>
          <div class="info-card">
            <div class="info-label">Vertices</div>
            <div class="info-value">
              {{ modelInfo.totalVertices.toLocaleString() }}
            </div>
          </div>
          <div class="info-card">
            <div class="info-label">Faces</div>
            <div class="info-value">
              {{ modelInfo.totalFaces.toLocaleString() }}
            </div>
          </div>
        </div>

        <div v-if="meshes.length > 1" class="mesh-details">
          <h4>Part Details</h4>
          <div class="mesh-list">
            <div v-for="(mesh, index) in meshes" :key="index" class="mesh-item">
              <div
                class="mesh-color"
                :style="{ backgroundColor: mesh.colorHex }"
              ></div>
              <div class="mesh-info">
                <div class="mesh-name">
                  {{ mesh.name || `Part ${index + 1}` }}
                </div>
                <div class="mesh-stats">
                  {{ mesh.vertices.toLocaleString() }} vertices,
                  {{ mesh.faces.toLocaleString() }} faces
                </div>
              </div>
              <button
                @click="focusOnSingleMesh(index)"
                class="btn btn-outline small"
              >
                Focus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ref, shallowRef, markRaw, onMounted, onBeforeUnmount, computed, watch } from "vue";

// DOM references
const canvasContainer = ref(null);
const fileInputRef = ref(null);

// State
const meshes = shallowRef([]); // shallow to avoid proxying Mesh instances
const loading = ref(false);
const loadingStatus = ref("");
const loadingProgress = ref(0);
const error = ref(null);
const wireframe = ref(false);
const showGrid = ref(true);
const showInfoPanel = ref(true);
const modelInfo = ref(null);
const selectedMesh = ref("");
const fileType = ref("");
const isDragOver = ref(false);
const isDestroyed = ref(false);

// Three.js objects
const scene = shallowRef(null);
const camera = shallowRef(null);
const renderer = shallowRef(null);
const controls = shallowRef(null);
const gridHelper = shallowRef(null);

// OCCT library state
const occt = ref(null);
const occtLoaded = ref(false);

// Computed properties
const hasModel = computed(() => meshes.value.length > 0);

// Initialize Three.js
const initThreeJS = () => {
  const container = canvasContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene.value = markRaw(new THREE.Scene());
  scene.value.background = new THREE.Color(0xf5f5f5);

  // Camera
  camera.value = markRaw(new THREE.PerspectiveCamera(75, width / height, 0.1, 10000));
  camera.value.position.set(100, 100, 100);
  camera.value.updateMatrixWorld();

  // Renderer
  renderer.value = markRaw(new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  }));
  renderer.value.setSize(width, height);
  renderer.value.shadowMap.enabled = true;
  renderer.value.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.value.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.value.domElement);

  // Controls
  controls.value = markRaw(new OrbitControls(camera.value, renderer.value.domElement));
  controls.value.enableDamping = true;
  controls.value.dampingFactor = 0.05;
  controls.value.screenSpacePanning = false;
  controls.value.minDistance = 1;
  controls.value.maxDistance = 1000;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.value.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(100, 100, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.value.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
  scene.value.add(hemisphereLight);

  // Grid
  gridHelper.value = markRaw(new THREE.GridHelper(200, 20, 0x888888, 0xcccccc));
  scene.value.add(gridHelper.value);

  // Handle window resize
  window.addEventListener("resize", onWindowResize);
};

// Load OCCT library with proper path configuration
const loadOCCTLibrary = async () => {
  try {
    loadingStatus.value = "Loading OCCT library...";
    console.log("Attempting to load OCCT library...");

    // Import the OCCT module dynamically
    const occtImport = await import("occt-import-js");

    // IMPORTANT: Use relative path for WASM file (NO leading slash)
    occt.value = await occtImport.default({
      locateFile: (path) => {
        if (path.endsWith(".wasm")) {
          return "occt-import-js.wasm"; // ✅ Relative path (no leading slash)
        }
        return path;
      },
    });

    occtLoaded.value = true;
    console.log("OCCT library loaded successfully");
  } catch (error) {
    console.error("OCCT library loading failed:", error);
    occtLoaded.value = false;
    error.value =
      "Failed to load OCCT library. Please refresh the page and try again. Error: " +
      error.message;
  }
};

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    loadFile(file);
  }
};

// Handle file drop
const handleFileDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".stp") || fileName.endsWith(".step")) {
      loadFile(file);
    } else {
      error.value = "Unsupported file format. Please use STP or STEP files.";
    }
  }
};

// Load STP file
const loadFile = async (file) => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".stp") || fileName.endsWith(".step")) {
    fileType.value = "STP/STEP";

    // Load OCCT if not already loaded
    if (!occtLoaded.value) {
      loading.value = true;
      loadingStatus.value = "Loading OCCT library...";
      await loadOCCTLibrary();
      loading.value = false;
    }

    if (occtLoaded.value) {
      await loadSTPFile(file);
    } else {
      error.value =
        "STP/STEP file support requires the occt-import-js library. Please refresh the page and try again. If the problem persists, check the browser console for more details.";
    }
  } else {
    error.value = "Unsupported file format";
  }
};

// Load STP file data
const loadSTPFile = async (file) => {
  loading.value = true;
  error.value = null;
  loadingProgress.value = 0;
  loadingStatus.value = "Reading file...";

  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    loadingProgress.value = 30;
    loadingStatus.value = "Parsing STEP geometry...";

    const fileBuffer = new Uint8Array(arrayBuffer);
    const result = occt.value.ReadStepFile(fileBuffer);

    if (!result.success) {
      throw new Error("Failed to parse STEP file");
    }

    loadingProgress.value = 70;
    loadingStatus.value = "Creating 3D meshes...";
    await createMeshesFromOCCTResult(result, file);

    loadingProgress.value = 100;
    loading.value = false;
    loadingStatus.value = "";
  } catch (error) {
    console.error("Error loading STP file:", error);
    error.value = "Failed to load STP file: " + error.message;
    loading.value = false;
    loadingStatus.value = "";
    loadingProgress.value = 0;
  }
};

// Create meshes from OCCT result
const createMeshesFromOCCTResult = async (result, file) => {
  clearMeshes();

  const meshData = [];
  let totalVertices = 0;
  let totalFaces = 0;

  for (let i = 0; i < result.meshes.length; i++) {
    const meshInfo = result.meshes[i];

    const geometry = markRaw(new THREE.BufferGeometry());

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

    // Generate random color for each part
    let color = new THREE.Color(
      0.2 + Math.random() * 0.6,
      0.2 + Math.random() * 0.6,
      0.2 + Math.random() * 0.6
    );
    let colorHex = "#" + color.getHexString();

    if (meshInfo.color && meshInfo.color.length >= 3) {
      color = new THREE.Color(
        meshInfo.color[0],
        meshInfo.color[1],
        meshInfo.color[2]
      );
      colorHex = "#" + color.getHexString();
    }

    const material = markRaw(new THREE.MeshPhongMaterial({
      color: color,
      wireframe: wireframe.value,
      side: THREE.DoubleSide,
    }));

    const mesh = markRaw(new THREE.Mesh(geometry, material));
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.value.add(mesh);

    const vertices = positions.length / 3;
    const faces = meshInfo.index
      ? meshInfo.index.array.length / 3
      : vertices / 3;

    meshData.push({
      mesh: mesh,
      name: meshInfo.name || `Part ${i + 1}`,
      vertices: vertices,
      faces: faces,
      colorHex: colorHex,
    });

    totalVertices += vertices;
    totalFaces += faces;
  }

  meshes.value = meshData;

  modelInfo.value = {
    meshCount: result.meshes.length,
    totalVertices: totalVertices,
    totalFaces: totalFaces,
    fileSize: formatFileSize(file.size),
  };

  fitCameraToModel();
};

// Read file as array buffer
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

// Clear meshes
const clearMeshes = () => {
  meshes.value.forEach((meshData) => {
    if (meshData.mesh && scene.value) {
      scene.value.remove(meshData.mesh);
      meshData.mesh.geometry?.dispose();
      meshData.mesh.material?.dispose();
    }
  });
  meshes.value = [];
  modelInfo.value = null;
  selectedMesh.value = "";
};

// Fit camera to model
const fitCameraToModel = () => {
  if (meshes.value.length === 0) return;

  const box = new THREE.Box3();
  meshes.value.forEach((meshData) => {
    box.expandByObject(meshData.mesh);
  });

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const distance = maxDim * 1.5;
  camera.value.position.set(
    center.x + distance,
    center.y + distance,
    center.z + distance
  );
  camera.value.lookAt(center);
  controls.value.target.copy(center);
  controls.value.update();
};

// Reset camera
const resetCamera = () => {
  fitCameraToModel();
};

// Toggle wireframe
const toggleWireframe = () => {
  wireframe.value = !wireframe.value;
  meshes.value.forEach((meshData) => {
    meshData.mesh.material.wireframe = wireframe.value;
  });
};

// Toggle grid
const toggleGrid = () => {
  showGrid.value = !showGrid.value;
  gridHelper.value.visible = showGrid.value;
};

// Toggle info panel
const toggleInfoPanel = () => {
  showInfoPanel.value = !showInfoPanel.value;
};

// Focus on mesh
const focusOnMesh = () => {
  if (selectedMesh.value === "") {
    meshes.value.forEach((meshData) => {
      meshData.mesh.visible = true;
    });
    fitCameraToModel();
  } else {
    focusOnSingleMesh(parseInt(selectedMesh.value));
  }
};

// Focus on single mesh
const focusOnSingleMesh = (index) => {
  meshes.value.forEach((meshData, i) => {
    meshData.mesh.visible = i == index;
  });

  const selectedMeshData = meshes.value[index];
  if (selectedMeshData) {
    const box = new THREE.Box3().setFromObject(selectedMeshData.mesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const distance = maxDim * 2;
    camera.value.position.set(
      center.x + distance,
      center.y + distance,
      center.z + distance
    );
    camera.value.lookAt(center);
    controls.value.target.copy(center);
    controls.value.update();
  }

  selectedMesh.value = index.toString();
};

// Clear error
const clearError = () => {
  error.value = null;
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Window resize handler
const onWindowResize = () => {
  const container = canvasContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.value.aspect = width / height;
  camera.value.updateProjectionMatrix();
  renderer.value.setSize(width, height);
};

// Animation loop
const animate = () => {
  if (isDestroyed.value) return;

  requestAnimationFrame(animate);
  if (controls.value) {
    controls.value.update();
  }
  if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value);
  }
};

// Dispose Three.js resources
const disposeThreeJS = () => {
  // Dispose of meshes
  meshes.value.forEach((meshData) => {
    if (meshData.mesh && scene.value) {
      scene.value.remove(meshData.mesh);
      meshData.mesh.geometry?.dispose();
      meshData.mesh.material?.dispose();
    }
  });

  // Dispose of renderer
  if (renderer.value) {
    renderer.value.dispose();
    renderer.value = null;
  }

  // Clear other objects
  scene.value = null;
  camera.value = null;
  controls.value = null;
  gridHelper.value = null;
};

// Lifecycle hooks
onMounted(async () => {
  initThreeJS();
  animate();

  // Load OCCT library in background
  await loadOCCTLibrary();
});

onBeforeUnmount(() => {
  isDestroyed.value = true;
  disposeThreeJS();
  window.removeEventListener("resize", onWindowResize);
});
</script>

<style scoped>
/* Your existing styles remain unchanged */
/* ... (paste your entire style block here) ... */
</style>
