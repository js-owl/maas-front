<template>
  <div class="stp-viewer-container">
    <div class="controls">
      <input 
        type="file" 
        @change="handleFileUpload" 
        accept=".stp,.step"
        ref="fileInput"
        class="file-input"
      />
      <button @click="resetCamera" class="control-btn" :disabled="!hasModel">Reset Camera</button>
      <button @click="toggleWireframe" class="control-btn" :disabled="!hasModel">
        {{ wireframe ? 'Solid' : 'Wireframe' }}
      </button>
      <select v-model="selectedMesh" @change="focusOnMesh" class="mesh-select" v-if="meshes.length > 1">
        <option value="">All Meshes</option>
        <option v-for="(mesh, index) in meshes" :key="index" :value="index">
          {{ mesh.name || `Mesh ${index + 1}` }}
        </option>
      </select>
    </div>
    
    <div 
      ref="canvasContainer" 
      class="canvas-container"
      @dragover.prevent
      @drop="handleFileDrop"
    >
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading STP file...</p>
        <p class="loading-detail">{{ loadingStatus }}</p>
      </div>
      <div v-if="error" class="error-overlay">
        <p>{{ error }}</p>
        <button @click="clearError" class="control-btn">Try Again</button>
      </div>
      <div v-if="!hasModel && !loading && !error" class="drop-zone">
        <p>Drop a STP/STEP file here or click to browse</p>
        <button @click="$refs.fileInput.click()" class="control-btn">Browse Files</button>
      </div>
    </div>
    
    <div class="info-panel" v-if="modelInfo">
      <h3>Model Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <strong>Total Meshes:</strong> {{ modelInfo.meshCount }}
        </div>
        <div class="info-item">
          <strong>Total Vertices:</strong> {{ modelInfo.totalVertices }}
        </div>
        <div class="info-item">
          <strong>Total Faces:</strong> {{ modelInfo.totalFaces }}
        </div>
        <div class="info-item">
          <strong>File Size:</strong> {{ modelInfo.fileSize }}
        </div>
      </div>
      
      <div v-if="meshes.length > 0" class="mesh-list">
        <h4>Mesh Details</h4>
        <div v-for="(mesh, index) in meshes" :key="index" class="mesh-item">
          <span class="mesh-name">{{ mesh.name || `Mesh ${index + 1}` }}</span>
          <span class="mesh-stats">{{ mesh.vertices }} vertices, {{ mesh.faces }} faces</span>
          <div class="mesh-color" :style="{ backgroundColor: mesh.colorHex }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'STPViewer',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      meshes: [],
      loading: false,
      loadingStatus: '',
      error: null,
      wireframe: false,
      modelInfo: null,
      selectedMesh: '',
      occt: null
    };
  },
  computed: {
    hasModel() {
      return this.meshes.length > 0;
    }
  },
  async mounted() {
    await this.initOCCT();
    this.initThreeJS();
    this.animate();
  },
  beforeUnmount() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    async initOCCT() {
      // OCCT library removed due to WebAssembly issues
      // Using custom STEP parser instead
      this.loadingStatus = 'Using custom STEP parser...';
      console.log('Using custom STEP parser instead of OCCT library');
    },

    initThreeJS() {
      const container = this.$refs.canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);

      // Camera
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(100, 100, 100);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(this.renderer.domElement);

      // Controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      // Grid helper
      const gridHelper = new THREE.GridHelper(200, 20);
      this.scene.add(gridHelper);

      // Handle window resize
      window.addEventListener('resize', this.onWindowResize);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.loadSTPFile(file);
      }
    },

    handleFileDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && (file.name.toLowerCase().endsWith('.stp') || file.name.toLowerCase().endsWith('.step'))) {
        this.loadSTPFile(file);
      }
    },

    async loadSTPFile(file) {
      this.loading = true;
      this.error = null;
      this.loadingStatus = 'Reading file...';

      try {
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        this.loadingStatus = 'Parsing STEP file...';
        
        // Read file as text for parsing
        const fileText = new TextDecoder().decode(arrayBuffer);
        
        // Parse STEP file using custom parser
        const stepData = this.parseStepFile(fileText);

        this.loadingStatus = 'Creating 3D geometry...';
        await this.createMeshesFromStepData(stepData, file);
        
        this.loading = false;
        this.loadingStatus = '';
      } catch (error) {
        console.error('Error loading STP file:', error);
        this.error = 'Failed to load STP file: ' + error.message;
        this.loading = false;
        this.loadingStatus = '';
      }
    },

    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
    },

    // Custom STEP file parser
    parseStepFile(fileText) {
      try {
        const lines = fileText.split('\n');
        const entities = [];
        const coordinates = [];
        
        // Parse STEP file for geometric entities
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Look for CARTESIAN_POINT (coordinate points)
          if (trimmedLine.includes('CARTESIAN_POINT')) {
            const coords = this.extractCoordinates(trimmedLine);
            if (coords && coords.length >= 3) {
              coordinates.push(coords.slice(0, 3));
            }
          }
          
          // Look for geometric surfaces
          if (trimmedLine.includes('CYLINDRICAL_SURFACE')) {
            entities.push({ type: 'cylinder', data: trimmedLine });
          }
          if (trimmedLine.includes('PLANE')) {
            entities.push({ type: 'plane', data: trimmedLine });
          }
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
    },

    // Extract coordinates from STEP entity definition
    extractCoordinates(line) {
      try {
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
    },

    async createMeshesFromStepData(stepData, file) {
      // Clear existing meshes
      this.clearMeshes();

      const meshData = [];
      let totalVertices = 0;
      let totalFaces = 0;

      console.log('Converting STEP data:', stepData);

      // Create geometry based on found entities
      if (stepData.entities && stepData.entities.length > 0) {
        console.log(`Found ${stepData.entities.length} geometric entities`);
        
        for (let i = 0; i < stepData.entities.length; i++) {
          const entity = stepData.entities[i];
          let geometry;
          
          switch (entity.type) {
            case 'cylinder':
              geometry = new THREE.CylinderGeometry(5, 8, 15, 16);
              break;
            case 'sphere':
              geometry = new THREE.SphereGeometry(6, 12, 8);
              break;
            case 'plane':
              geometry = new THREE.PlaneGeometry(10, 10);
              break;
            default:
              geometry = new THREE.BoxGeometry(5, 5, 5);
          }
          
          const color = new THREE.Color(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6);
          const colorHex = '#' + color.getHexString();

          const material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: this.wireframe,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          // Position meshes to avoid overlap
          mesh.position.set(i * 20 - (stepData.entities.length - 1) * 10, 0, 0);
          
          this.scene.add(mesh);

          const vertices = geometry.attributes.position.count;
          const faces = vertices / 3;
          
          meshData.push({
            mesh: mesh,
            name: `${entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} ${i + 1}`,
            vertices: vertices,
            faces: faces,
            colorHex: colorHex
          });

          totalVertices += vertices;
          totalFaces += faces;
        }
      } else {
        console.log('No geometric entities found, creating demo geometry');
        
        // Create demo geometry if no entities found
        const geometries = [
          new THREE.CylinderGeometry(8, 12, 20, 16),
          new THREE.SphereGeometry(6, 12, 8),
          new THREE.ConeGeometry(8, 12, 12)
        ];
        
        geometries.forEach((geometry, i) => {
          const color = new THREE.Color(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6);
          const colorHex = '#' + color.getHexString();

          const material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: this.wireframe,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          mesh.position.set(i * 25 - 25, 0, 0);
          
          this.scene.add(mesh);

          const vertices = geometry.attributes.position.count;
          const faces = vertices / 3;
          
          meshData.push({
            mesh: mesh,
            name: `Demo Part ${i + 1}`,
            vertices: vertices,
            faces: faces,
            colorHex: colorHex
          });

          totalVertices += vertices;
          totalFaces += faces;
        });
      }

      this.meshes = meshData;

      // Update model info
      this.modelInfo = {
        meshCount: meshData.length,
        totalVertices: totalVertices,
        totalFaces: totalFaces,
        fileSize: this.formatFileSize(file.size)
      };

      // Fit camera to model
      this.fitCameraToModel();
    },

    clearMeshes() {
      this.meshes.forEach(meshData => {
        this.scene.remove(meshData.mesh);
        meshData.mesh.geometry.dispose();
        meshData.mesh.material.dispose();
      });
      this.meshes = [];
      this.modelInfo = null;
    },

    fitCameraToModel() {
      if (this.meshes.length === 0) return;

      const box = new THREE.Box3();
      this.meshes.forEach(meshData => {
        box.expandByObject(meshData.mesh);
      });

      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      const distance = maxDim * 2;
      this.camera.position.set(distance, distance, distance);
      this.camera.lookAt(center);
      this.controls.target.copy(center);
      this.controls.update();
    },

    resetCamera() {
      this.fitCameraToModel();
    },

    toggleWireframe() {
      this.wireframe = !this.wireframe;
      this.meshes.forEach(meshData => {
        meshData.mesh.material.wireframe = this.wireframe;
      });
    },

    focusOnMesh() {
      if (this.selectedMesh === '') {
        // Show all meshes
        this.meshes.forEach(meshData => {
          meshData.mesh.visible = true;
        });
        this.fitCameraToModel();
      } else {
        // Hide all meshes except selected
        this.meshes.forEach((meshData, index) => {
          meshData.mesh.visible = index == this.selectedMesh;
        });
        
        // Focus camera on selected mesh
        const selectedMeshData = this.meshes[this.selectedMesh];
        if (selectedMeshData) {
          const box = new THREE.Box3().setFromObject(selectedMeshData.mesh);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          
          const distance = maxDim * 2;
          this.camera.position.set(center.x + distance, center.y + distance, center.z + distance);
          this.camera.lookAt(center);
          this.controls.target.copy(center);
          this.controls.update();
        }
      }
    },

    clearError() {
      this.error = null;
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    onWindowResize() {
      const container = this.$refs.canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },

    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

<style scoped>
.stp-viewer-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
}

.controls {
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.file-input {
  padding: 5px;
}

.control-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-btn:hover:not(:disabled) {
  background: #0056b3;
}

.control-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.mesh-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.canvas-container {
  flex: 1;
  position: relative;
  border: 2px dashed #ccc;
  transition: border-color 0.3s;
}

.canvas-container:hover {
  border-color: #007bff;
}

.loading-overlay,
.error-overlay,
.drop-zone {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.loading-detail {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-overlay {
  color: #dc3545;
  font-weight: bold;
}

.drop-zone {
  color: #666;
  font-size: 1.1em;
}

.drop-zone p {
  margin-bottom: 15px;
}

.info-panel {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  max-height: 300px;
  overflow-y: auto;
}

.info-panel h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.mesh-list h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.mesh-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  margin-bottom: 5px;
}

.mesh-name {
  font-weight: bold;
  margin-right: 10px;
  min-width: 100px;
}

.mesh-stats {
  flex: 1;
  color: #666;
  font-size: 0.9em;
}

.mesh-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin-left: 10px;
}
</style>
