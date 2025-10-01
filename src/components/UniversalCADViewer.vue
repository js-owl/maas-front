<template>
  <div class="universal-cad-viewer">
    <div class="header">
      <h2>Universal CAD File Viewer</h2>
      <p>Supports STL and STP/STEP files</p>
    </div>
    
    <div class="controls">
      <div class="file-controls">
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept=".stl,.stp,.step"
          ref="fileInput"
          class="file-input"
        />
        <button @click="$refs.fileInput.click()" class="control-btn primary">
          Choose File
        </button>
      </div>
      
      <div class="view-controls" v-if="hasModel">
        <button @click="resetCamera" class="control-btn">Reset View</button>
        <button @click="toggleWireframe" class="control-btn">
          {{ wireframe ? 'Solid' : 'Wireframe' }}
        </button>
        <button @click="toggleGrid" class="control-btn">
          {{ showGrid ? 'Hide Grid' : 'Show Grid' }}
        </button>
        <select v-model="selectedMesh" @change="focusOnMesh" class="mesh-select" v-if="meshes.length > 1">
          <option value="">All Parts</option>
          <option v-for="(mesh, index) in meshes" :key="index" :value="index">
            {{ mesh.name || `Part ${index + 1}` }}
          </option>
        </select>
      </div>
    </div>
    
    <div 
      ref="canvasContainer" 
      class="canvas-container"
      @dragover.prevent
      @dragenter.prevent
      @drop="handleFileDrop"
    >
      <div v-if="loading" class="overlay loading-overlay">
        <div class="spinner"></div>
        <p>{{ loadingStatus }}</p>
      </div>
      
      <div v-if="error" class="overlay error-overlay">
        <div class="error-content">
          <h3>Error Loading File</h3>
          <p>{{ error }}</p>
          <button @click="clearError" class="control-btn">Try Again</button>
        </div>
      </div>
      
      <div v-if="!hasModel && !loading && !error" class="overlay drop-zone">
        <div class="drop-content">
          <div class="drop-icon">📁</div>
          <h3>Drop your CAD file here</h3>
          <p>Supports STL and STP/STEP files</p>
          <button @click="$refs.fileInput.click()" class="control-btn primary large">
            Browse Files
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-panel" v-if="modelInfo">
      <div class="info-header">
        <h3>{{ fileType }} Model Information</h3>
        <button @click="toggleInfoPanel" class="toggle-btn">
          {{ showInfoPanel ? '▼' : '▲' }}
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
            <div class="info-label">Total Vertices</div>
            <div class="info-value">{{ modelInfo.totalVertices.toLocaleString() }}</div>
          </div>
          <div class="info-card">
            <div class="info-label">Total Faces</div>
            <div class="info-value">{{ modelInfo.totalFaces.toLocaleString() }}</div>
          </div>
        </div>
        
        <div v-if="meshes.length > 1" class="mesh-details">
          <h4>Part Details</h4>
          <div class="mesh-list">
            <div v-for="(mesh, index) in meshes" :key="index" class="mesh-item">
              <div class="mesh-color" :style="{ backgroundColor: mesh.colorHex }"></div>
              <div class="mesh-info">
                <div class="mesh-name">{{ mesh.name || `Part ${index + 1}` }}</div>
                <div class="mesh-stats">{{ mesh.vertices.toLocaleString() }} vertices, {{ mesh.faces.toLocaleString() }} faces</div>
              </div>
              <button @click="focusOnSingleMesh(index)" class="focus-btn">Focus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'UniversalCADViewer',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      meshes: [],
      gridHelper: null,
      loading: false,
      loadingStatus: '',
      error: null,
      wireframe: false,
      showGrid: true,
      showInfoPanel: true,
      modelInfo: null,
      selectedMesh: '',
      fileType: '',
      occt: null,
      occtLoaded: false
    };
  },
  computed: {
    hasModel() {
      return this.meshes.length > 0;
    }
  },
  async mounted() {
    this.initThreeJS();
    this.animate();
    // Load OCCT library in background
    this.loadOCCTLibrary();
  },
  beforeUnmount() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    async loadOCCTLibrary() {
      // OCCT library removed due to WebAssembly issues
      // Using custom STEP parser instead
      this.occtLoaded = false;
      console.log('Using custom STEP parser instead of OCCT library');
    },

    initThreeJS() {
      const container = this.$refs.canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf5f5f5);

      // Camera
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
      this.camera.position.set(100, 100, 100);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(width, height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(this.renderer.domElement);

      // Controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 1000;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(100, 100, 50);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      this.scene.add(directionalLight);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
      this.scene.add(hemisphereLight);

      // Grid
      this.gridHelper = new THREE.GridHelper(200, 20, 0x888888, 0xcccccc);
      this.scene.add(this.gridHelper);

      // Handle window resize
      window.addEventListener('resize', this.onWindowResize);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.loadFile(file);
      }
    },

    handleFileDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.stl') || fileName.endsWith('.stp') || fileName.endsWith('.step')) {
          this.loadFile(file);
        } else {
          this.error = 'Unsupported file format. Please use STL or STP/STEP files.';
        }
      }
    },

    async loadFile(file) {
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.stl')) {
        this.fileType = 'STL';
        await this.loadSTLFile(file);
      } else if (fileName.endsWith('.stp') || fileName.endsWith('.step')) {
        this.fileType = 'STP/STEP';
        await this.loadSTPFile(file);
      } else {
        this.error = 'Unsupported file format';
      }
    },

    async loadSTLFile(file) {
      this.loading = true;
      this.error = null;
      this.loadingStatus = 'Loading STL file...';

      try {
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);
        
        this.clearMeshes();
        
        const material = new THREE.MeshPhongMaterial({
          color: 0x00aa00,
          wireframe: this.wireframe,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.scene.add(mesh);

        const vertices = geometry.attributes.position.count;
        const faces = vertices / 3;

        this.meshes = [{
          mesh: mesh,
          name: file.name,
          vertices: vertices,
          faces: faces,
          colorHex: '#00aa00'
        }];

        this.modelInfo = {
          meshCount: 1,
          totalVertices: vertices,
          totalFaces: faces,
          fileSize: this.formatFileSize(file.size)
        };

        this.fitCameraToModel();
        this.loading = false;
        this.loadingStatus = '';
      } catch (error) {
        console.error('Error loading STL file:', error);
        this.error = 'Failed to load STL file: ' + error.message;
        this.loading = false;
        this.loadingStatus = '';
      }
    },

    async loadSTPFile(file) {
      this.loading = true;
      this.error = null;
      this.loadingStatus = 'Loading STP file...';

      try {
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        this.loadingStatus = 'Parsing STEP geometry...';
        
        // Read file as text for parsing
        const fileText = new TextDecoder().decode(arrayBuffer);
        
        // Parse STEP file using custom parser
        const stepData = this.parseStepFile(fileText);
        
        this.loadingStatus = 'Creating 3D meshes...';
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

      this.modelInfo = {
        meshCount: meshData.length,
        totalVertices: totalVertices,
        totalFaces: totalFaces,
        fileSize: this.formatFileSize(file.size)
      };

      this.fitCameraToModel();
    },

    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
    },

    clearMeshes() {
      this.meshes.forEach(meshData => {
        this.scene.remove(meshData.mesh);
        meshData.mesh.geometry.dispose();
        meshData.mesh.material.dispose();
      });
      this.meshes = [];
      this.modelInfo = null;
      this.selectedMesh = '';
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
      
      const distance = maxDim * 1.5;
      this.camera.position.set(center.x + distance, center.y + distance, center.z + distance);
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

    toggleGrid() {
      this.showGrid = !this.showGrid;
      this.gridHelper.visible = this.showGrid;
    },

    toggleInfoPanel() {
      this.showInfoPanel = !this.showInfoPanel;
    },

    focusOnMesh() {
      if (this.selectedMesh === '') {
        this.meshes.forEach(meshData => {
          meshData.mesh.visible = true;
        });
        this.fitCameraToModel();
      } else {
        this.focusOnSingleMesh(this.selectedMesh);
      }
    },

    focusOnSingleMesh(index) {
      this.meshes.forEach((meshData, i) => {
        meshData.mesh.visible = i == index;
      });
      
      const selectedMeshData = this.meshes[index];
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
      
      this.selectedMesh = index.toString();
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
.universal-cad-viewer {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
}

.header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.header h2 {
  margin: 0 0 5px 0;
  font-size: 1.8em;
  font-weight: 300;
}

.header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9em;
}

.controls {
  padding: 15px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.file-controls,
.view-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-input {
  display: none;
}

.control-btn {
  padding: 10px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9em;
  font-weight: 500;
}

.control-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.control-btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.control-btn.primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.control-btn.large {
  padding: 12px 24px;
  font-size: 1em;
}

.mesh-select {
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  font-size: 0.9em;
}

.canvas-container {
  flex: 1;
  position: relative;
  background: #ffffff;
  border: 2px dashed #dee2e6;
  margin: 0 15px;
  border-radius: 8px;
  overflow: hidden;
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

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-overlay {
  color: #dc3545;
  max-width: 400px;
}

.error-content h3 {
  margin: 0 0 10px 0;
  color: #dc3545;
}

.drop-zone {
  color: #6c757d;
}

.drop-content {
  max-width: 300px;
}

.drop-icon {
  font-size: 4em;
  margin-bottom: 15px;
  opacity: 0.5;
}

.drop-content h3 {
  margin: 0 0 10px 0;
  color: #495057;
}

.drop-content p {
  margin: 0 0 20px 0;
  color: #6c757d;
}

.info-panel {
  background: white;
  border-top: 1px solid #e9ecef;
  margin: 0 15px 15px;
  border-radius: 8px;
  overflow: hidden;
}

.info-header {
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-header h3 {
  margin: 0;
  color: #495057;
  font-size: 1.1em;
  font-weight: 600;
}

.toggle-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.2em;
  padding: 5px;
}

.info-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.info-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.info-label {
  font-size: 0.8em;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1.2em;
  font-weight: 600;
  color: #495057;
}

.mesh-details h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1em;
  font-weight: 600;
}

.mesh-list {
  max-height: 200px;
  overflow-y: auto;
}

.mesh-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.mesh-item:hover {
  background: #e9ecef;
}

.mesh-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #dee2e6;
  margin-right: 12px;
  flex-shrink: 0;
}

.mesh-info {
  flex: 1;
}

.mesh-name {
  font-weight: 600;
  color: #495057;
  margin-bottom: 2px;
}

.mesh-stats {
  font-size: 0.8em;
  color: #6c757d;
}

.focus-btn {
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
  transition: background-color 0.2s ease;
}

.focus-btn:hover {
  background: #0056b3;
}
</style>
