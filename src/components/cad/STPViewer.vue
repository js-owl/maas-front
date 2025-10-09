<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { API_BASE } from '../../api'
import { useAuthStore } from '../../stores/auth.store'

const file_id = defineModel()

const authStore = useAuthStore()

// Reactive state
const meshes = ref([])
const loading = ref(false)
const loadingStatus = ref('')
const loadingProgress = ref(0)
const error = ref(null)
const modelInfo = ref(null)
const selectedMesh = ref('')
const fileType = ref('')
const isDragOver = ref(false)

// Non-reactive instance fields
let scene = null
let camera = null
let renderer = null
let controls = null
let isDestroyed = false

// OCCT
let occt = null
const occtLoaded = ref(false)
let occtLoadingPromise = null

// Refs
const canvasContainer = ref(null)
const fileInput = ref(null)

const hasModel = computed(() => meshes.value.length > 0)

async function loadOCCTLibrary() {
  // Если библиотека уже загружена, возвращаем успешный результат
  if (occtLoaded.value) {
    return
  }
  
  // Если библиотека уже загружается, ждем завершения текущей загрузки
  if (occtLoadingPromise) {
    return occtLoadingPromise
  }
  
  // Создаем новый Promise для загрузки
  occtLoadingPromise = (async () => {
    try {
      loadingStatus.value = 'Loading OCCT library...'
      let occtimportjs
      try {
        occtimportjs = (await import('occt-import-js')).default
      } catch (importError) {
        console.error('Failed to import occt-import-js:', importError)
        throw importError
      }
      occt = await occtimportjs({
        locateFile: (path) => {
          if (path.endsWith('.wasm')) {
            return `${import.meta.env.VITE_BASE_PATH || '/'}occt-import-js.wasm`
          }
          return path
        }
      })
      occtLoaded.value = true
    } catch (e) {
      console.error('OCCT library loading failed:', e)
      occtLoaded.value = false
      occtLoadingPromise = null // Сбрасываем, чтобы можно было повторить попытку
      error.value = 'Failed to load OCCT library. Please refresh the page and try again. Error: ' + e.message
      throw e
    }
  })()
  
  return occtLoadingPromise
}

function initThreeJS() {
  const container = canvasContainer.value
  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf5f5f5)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
  camera.position.set(100, 100, 100)
  camera.updateMatrixWorld()

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 1
  controls.maxDistance = 1000

  const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(100, 100, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3)
  scene.add(hemisphereLight)

  window.addEventListener('resize', onWindowResize)
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    loadFile(file)
  }
}

function handleFileDrop(event) {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.stp') || fileName.endsWith('.step')) {
      loadFile(file)
    } else {
      error.value = 'Unsupported file format. Please use STP or STEP files.'
    }
  }
}

async function loadFile(file) {
  const fileName = file.name.toLowerCase()
  if (fileName.endsWith('.stp') || fileName.endsWith('.step')) {
    fileType.value = 'STP/STEP'
    if (!occtLoaded.value) {
      loading.value = true
      loadingStatus.value = 'Loading OCCT library...'
      await loadOCCTLibrary()
      loading.value = false
    }
    if (occtLoaded.value) {
      await loadSTPFile(file)
    } else {
      error.value = 'STP/STEP file support requires the occt-import-js library. Please refresh the page and try again. If the problem persists, check the browser console for more details.'
    }
  } else {
    error.value = 'Unsupported file format'
  }
}

async function loadSTPFile(file) {
  loading.value = true
  error.value = null
  loadingProgress.value = 0
  loadingStatus.value = 'Reading file...'
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    loadingProgress.value = 30
    loadingStatus.value = 'Parsing STEP geometry...'
    const fileBuffer = new Uint8Array(arrayBuffer)
    const result = occt.ReadStepFile(fileBuffer)
    if (!result.success) {
      throw new Error('Failed to parse STEP file')
    }
    loadingProgress.value = 70
    loadingStatus.value = 'Creating 3D meshes...'
    await createMeshesFromOCCTResult(result, file)
    loadingProgress.value = 100
    loading.value = false
    loadingStatus.value = ''
  } catch (e) {
    console.error('Error loading STP file:', e)
    error.value = 'Failed to load STP file: ' + e.message
    loading.value = false
    loadingStatus.value = ''
    loadingProgress.value = 0
  }
}

async function createMeshesFromOCCTResult(result, file) {
  clearMeshes()
  const meshData = []
  let totalVertices = 0
  let totalFaces = 0
  for (let i = 0; i < result.meshes.length; i++) {
    const meshInfo = result.meshes[i]
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(meshInfo.attributes.position.array)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    if (meshInfo.attributes.normal) {
      const normals = new Float32Array(meshInfo.attributes.normal.array)
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    } else {
      geometry.computeVertexNormals()
    }
    if (meshInfo.index) {
      const indices = new Uint32Array(meshInfo.index.array)
      geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    }
    let color = new THREE.Color(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6)
    let colorHex = '#' + color.getHexString()
    if (meshInfo.color && meshInfo.color.length >= 3) {
      color = new THREE.Color(meshInfo.color[0], meshInfo.color[1], meshInfo.color[2])
      colorHex = '#' + color.getHexString()
    }
    const material = new THREE.MeshPhongMaterial({
      color: color,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    const vertices = positions.length / 3
    const faces = meshInfo.index ? meshInfo.index.array.length / 3 : vertices / 3
    meshData.push({
      mesh: mesh,
      name: meshInfo.name || `Part ${i + 1}`,
      vertices: vertices,
      faces: faces,
      colorHex: colorHex
    })
    totalVertices += vertices
    totalFaces += faces
  }
  meshes.value = meshData
  modelInfo.value = {
    meshCount: result.meshes.length,
    totalVertices: totalVertices,
    totalFaces: totalFaces,
    fileSize: formatFileSize(file.size)
  }
  fitCameraToModel()
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

function clearMeshes() {
  meshes.value.forEach(meshData => {
    if (meshData.mesh && scene) {
      scene.remove(meshData.mesh)
      meshData.mesh.geometry?.dispose()
      meshData.mesh.material?.dispose()
    }
  })
  meshes.value = []
  modelInfo.value = null
  selectedMesh.value = ''
}

function fitCameraToModel() {
  if (meshes.value.length === 0) return
  const box = new THREE.Box3()
  meshes.value.forEach(meshData => {
    box.expandByObject(meshData.mesh)
  })
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const distance = maxDim * 1.5
  camera.position.set(center.x + distance, center.y + distance, center.z + distance)
  camera.lookAt(center)
  controls.target.copy(center)
  controls.update()
}

function resetCamera() {
  fitCameraToModel()
}

function focusOnMesh() {
  if (selectedMesh.value === '') {
    meshes.value.forEach(meshData => {
      meshData.mesh.visible = true
    })
    fitCameraToModel()
  } else {
    focusOnSingleMesh(selectedMesh.value)
  }
}

function focusOnSingleMesh(index) {
  meshes.value.forEach((meshData, i) => {
    meshData.mesh.visible = i == index
  })
  const selectedMeshData = meshes.value[index]
  if (selectedMeshData) {
    const box = new THREE.Box3().setFromObject(selectedMeshData.mesh)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const distance = maxDim * 2
    camera.position.set(center.x + distance, center.y + distance, center.z + distance)
    camera.lookAt(center)
    controls.target.copy(center)
    controls.update()
  }
  selectedMesh.value = index.toString()
}

function clearError() {
  error.value = null
}

async function loadFileFromServer(id) {
  if (!id) return
  
  try {
    loading.value = true
    loadingStatus.value = 'Загрузка файла с сервера...'
    loadingProgress.value = 10
    
    const headers = new Headers()
    if (authStore.getToken) {
      headers.append('Authorization', `Bearer ${authStore.getToken}`)
    }

    const res = await fetch(`${API_BASE}/files/${id}/download`, {
      method: 'GET',
      headers: headers,
    })
    
    if (!res.ok) {
      throw new Error('Не удалось загрузить файл с сервера')
    }

    loadingProgress.value = 30
    const blob = await res.blob()
    const file = new File([blob], 'model.stp', { type: 'application/stp' })
    
    loadingProgress.value = 50
    await loadFile(file)
  } catch (err) {
    console.error('Error loading file from server:', err)
    error.value = 'Ошибка загрузки файла: ' + err.message
    loading.value = false
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function onWindowResize() {
  const container = canvasContainer.value
  const width = container.clientWidth
  const height = container.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  if (isDestroyed) return
  requestAnimationFrame(animate)
  if (controls) controls.update()
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

function disposeThreeJS() {
  meshes.value.forEach(meshData => {
    if (meshData.mesh) {
      scene?.remove(meshData.mesh)
      meshData.mesh.geometry?.dispose()
      meshData.mesh.material?.dispose()
    }
  })
  if (renderer) {
    renderer.dispose()
    renderer = null
  }
  scene = null
  camera = null
  controls = null
}

onMounted(() => {
  initThreeJS()
  animate()
  
  // Если передан file_id, загружаем файл автоматически
  if (file_id.value) {
    loadFileFromServer(file_id.value)
  }
})

// Отслеживаем изменение file_id
watch(() => file_id.value, (newFileId) => {
  if (newFileId) {
    loadFileFromServer(newFileId)
  }
})

onBeforeUnmount(() => {
  isDestroyed = true
  disposeThreeJS()
  window.removeEventListener('resize', onWindowResize)
})
</script>

<template>
  <div class="stp-viewer">
    <input 
      type="file" 
      @change="handleFileUpload" 
      accept=".stp,.step"
      ref="fileInput"
      class="file-input"
    />

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
            <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
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
    </div>
  </div>
</template>

<style scoped>
.stp-viewer {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.file-input {
  display: none;
}

.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #ffffff;
  border: 2px solid var(--left-section-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.canvas-container.drag-over {
  border-color: #007bff;
  background: #f8f9ff;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.loading-overlay {
  color: #6c757d;
}

.loading-content {
  max-width: 300px;
}

.loading-content h3 {
  margin: 15px 0 10px 0;
  color: #495057;
}

.loading-content p {
  margin: 0 0 20px 0;
  color: #6c757d;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

.error-overlay {
  color: #dc3545;
  max-width: 400px;
}

.error-content {
  text-align: center;
}

.error-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.error-content h3 {
  margin: 0 0 10px 0;
  color: #dc3545;
}

.error-content p {
  margin: 0 0 20px 0;
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stp-viewer {
    height: 300px;
  }
}
</style>

