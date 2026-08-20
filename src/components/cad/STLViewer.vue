<script setup>
import { fetchWithAuth } from '../../api'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  ensureLocalStpCacheReady,
  getLocalStpFileById,
  isServerFileId,
} from '../../helpers/local-stp-files'
import { DEFAULT_PRINTING_FILE_ID } from '../../helpers/model-file-types'

const file_id = defineModel()

const container = ref(null)
const isLoading = ref(true)
const error = ref('')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.outputColorSpace = THREE.SRGBColorSpace

let parsedGeometry = null
let model = null
let animationId = null
let controls = null
let envMapTexture = null
let resizeObserver = null
let isDestroyed = false

scene.add(new THREE.AmbientLight(0xffffff, 0.7))
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1)
directionalLight.position.set(5, 8, 5)
scene.add(directionalLight)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
fillLight.position.set(-6, 3, -4)
scene.add(fillLight)
scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b0b0, 0.45))

onMounted(async () => {
  window.addEventListener('resize', updateRendererSize)
  await loadAndRender()
  if (container.value) {
    resizeObserver = new ResizeObserver(updateRendererSize)
    resizeObserver.observe(container.value)
  }
})

watch(
  () => file_id.value,
  async () => {
    await loadAndRender()
  }
)

onBeforeUnmount(() => {
  isDestroyed = true
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', updateRendererSize)
  resizeObserver?.disconnect()
  if (model) {
    scene.remove(model)
    model.geometry?.dispose()
    model.material?.dispose()
  }
  envMapTexture?.dispose()
  controls?.dispose()
  renderer.dispose()
})

async function loadAndRender() {
  error.value = ''
  isLoading.value = true
  parsedGeometry = await getModel()
  await nextTick()
  if (isDestroyed) return
  isLoading.value = false

  if (model) {
    scene.remove(model)
    model.geometry?.dispose()
    model.material?.dispose()
    model = null
  }

  if (!parsedGeometry) {
    error.value = 'Не удалось загрузить STL-модель'
    return
  }

  renderModel()
}

function updateRendererSize() {
  if (!container.value) return
  const width = Math.max(container.value.clientWidth, 1)
  const height = Math.max(container.value.clientHeight, 1)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  if (isDestroyed) return
  animationId = requestAnimationFrame(animate)
  controls?.update()
  renderer.render(scene, camera)
}

function decodeBase64ToArrayBuffer(base64Data) {
  const binary = atob(base64Data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

function looksLikeAsciiStl(bytes) {
  const head = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 64)).trimStart()
  return head.toLowerCase().startsWith('solid')
}

function looksLikeStep(bytes) {
  const head = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 32)).trimStart()
  return head.startsWith('ISO-10303')
}

function parseStl(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer)
  if (!bytes.byteLength) {
    throw new Error('Пустой файл модели')
  }
  if (looksLikeStep(bytes)) {
    throw new Error('Сервер отдал STEP вместо STL')
  }

  const loader = new STLLoader()
  const geometry = looksLikeAsciiStl(bytes)
    ? loader.parse(new TextDecoder().decode(bytes))
    : loader.parse(arrayBuffer)

  const position = geometry.getAttribute('position')
  if (!position || position.count < 3) {
    throw new Error('В STL нет треугольников')
  }

  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  return geometry
}

function bundledDemoStlUrl() {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/?$/, '/')}models/demo_printing_default.stl`
}

async function loadArrayBuffer(url, options = {}) {
  const res = await fetch(url, { cache: 'no-store', ...options })
  if (!res.ok) {
    throw new Error(`Failed to download STL file: ${res.status}`)
  }
  return res.arrayBuffer()
}

async function getModel() {
  try {
    await ensureLocalStpCacheReady()
    const localFile = getLocalStpFileById(file_id.value)
    if (localFile) {
      return parseStl(decodeBase64ToArrayBuffer(localFile.file_data))
    }

    const numericId = Number(file_id.value)
    if (numericId === DEFAULT_PRINTING_FILE_ID) {
      try {
        return parseStl(await loadArrayBuffer(bundledDemoStlUrl()))
      } catch (bundledError) {
        console.warn('Bundled demo STL failed, falling back to API', bundledError)
      }
    }

    if (!isServerFileId(file_id.value)) return null

    const res = await fetchWithAuth(`/files/${file_id.value}/download?format=stl`, {
      method: 'GET',
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error(`Failed to download STL file: ${res.status}`)
    }
    return parseStl(await res.arrayBuffer())
  } catch (err) {
    console.error({ error: err })
    return null
  }
}

function fitCameraToGeometry(geometry) {
  geometry.computeBoundingBox()
  const box = geometry.boundingBox
  if (!box) return

  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z, 1)
  const fov = camera.fov * (Math.PI / 180)
  const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 2.2
  const isometricAngle = Math.PI / 4

  camera.near = Math.max(distance / 100, 0.01)
  camera.far = Math.max(distance * 100, 1000)
  camera.position.set(
    distance * Math.cos(isometricAngle),
    distance * Math.sin(isometricAngle),
    distance * Math.sin(isometricAngle)
  )
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()

  if (controls) {
    controls.target.set(0, 0, 0)
    controls.minDistance = maxDim * 0.3
    controls.maxDistance = Math.max(distance * 8, maxDim * 6)
    controls.update()
  }
}

function renderModel() {
  if (!parsedGeometry || !container.value || isDestroyed) return

  const material = new THREE.MeshStandardMaterial({
    color: 0x8a9199,
    metalness: 0.15,
    roughness: 0.45,
    side: THREE.DoubleSide,
    envMapIntensity: 0.6,
  })

  model = new THREE.Mesh(parsedGeometry, material)
  parsedGeometry.computeBoundingBox()
  const center = new THREE.Vector3()
  parsedGeometry.boundingBox.getCenter(center)
  model.position.copy(center.negate())
  scene.add(model)

  if (!envMapTexture) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    envMapTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
    pmremGenerator.dispose()
  }
  scene.environment = envMapTexture
  material.envMap = envMapTexture
  scene.background = new THREE.Color(0xf4f5f7)

  updateRendererSize()
  if (!container.value.contains(renderer.domElement)) {
    container.value.appendChild(renderer.domElement)
  }

  if (!controls) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
  }

  fitCameraToGeometry(parsedGeometry)

  if (!animationId) {
    animate()
  }
}
</script>

<template>
  <div ref="container" class="stl-container">
    <div v-if="isLoading" class="stl-overlay">Загрузка STL-модели...</div>
    <div v-else-if="error" class="stl-overlay stl-overlay--error">{{ error }}</div>
  </div>
</template>

<style scoped>
.stl-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  background: #f4f5f7;
}

.stl-container canvas {
  border-radius: 6px;
  display: block;
  position: relative;
  z-index: 1;
}

.stl-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  font-size: 16px;
  background: #f4f5f7;
}

.stl-overlay--error {
  color: #c45656;
  padding: 24px;
  text-align: center;
}
</style>
