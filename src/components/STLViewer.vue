<template>
  <div class="stl-viewer-container">
    <div class="controls">
      <input 
        type="file" 
        @change="handleFileUpload" 
        accept=".stl"
        ref="fileInput"
        class="file-input"
      />
      <button @click="resetCamera" class="control-btn">Reset Camera</button>
      <button @click="toggleWireframe" class="control-btn">
        {{ wireframe ? 'Solid' : 'Wireframe' }}
      </button>
    </div>
    
    <div 
      ref="canvasContainer" 
      class="canvas-container"
      @dragover.prevent
      @drop="handleFileDrop"
    >
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading STL file...</p>
      </div>
      <div v-if="error" class="error-overlay">
        <p>{{ error }}</p>
      </div>
    </div>
    
    <div class="info-panel" v-if="modelInfo">
      <h3>Model Information</h3>
      <p><strong>Vertices:</strong> {{ modelInfo.vertices }}</p>
      <p><strong>Faces:</strong> {{ modelInfo.faces }}</p>
      <p><strong>File Size:</strong> {{ modelInfo.fileSize }}</p>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'STLViewer',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      currentMesh: null,
      loading: false,
      error: null,
      wireframe: false,
      modelInfo: null
    };
  },
  mounted() {
    this.initThreeJS();
    this.animate();
  },
  beforeUnmount() {
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThreeJS() {
      const container = this.$refs.canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);

      // Camera
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 100);

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

      // Handle window resize
      window.addEventListener('resize', this.onWindowResize);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.loadSTLFile(file);
      }
    },

    handleFileDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.name.toLowerCase().endsWith('.stl')) {
        this.loadSTLFile(file);
      }
    },

    loadSTLFile(file) {
      this.loading = true;
      this.error = null;

      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target.result;
        this.parseSTL(contents, file);
      };
      reader.onerror = () => {
        this.error = 'Failed to read file';
        this.loading = false;
      };
      reader.readAsArrayBuffer(file);
    },

    parseSTL(arrayBuffer, file) {
      const loader = new STLLoader();
      
      try {
        const geometry = loader.parse(arrayBuffer);
        
        // Remove existing mesh
        if (this.currentMesh) {
          this.scene.remove(this.currentMesh);
          this.currentMesh.geometry.dispose();
          this.currentMesh.material.dispose();
        }

        // Create material
        const material = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
          wireframe: this.wireframe
        });

        // Create mesh
        this.currentMesh = new THREE.Mesh(geometry, material);
        this.currentMesh.castShadow = true;
        this.currentMesh.receiveShadow = true;

        // Center the model
        const box = new THREE.Box3().setFromObject(this.currentMesh);
        const center = box.getCenter(new THREE.Vector3());
        this.currentMesh.position.sub(center);

        // Scale to fit viewport
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim;
        this.currentMesh.scale.setScalar(scale);

        this.scene.add(this.currentMesh);

        // Update model info
        this.modelInfo = {
          vertices: geometry.attributes.position.count,
          faces: geometry.attributes.position.count / 3,
          fileSize: this.formatFileSize(file.size)
        };

        // Reset camera
        this.resetCamera();

        this.loading = false;
      } catch (err) {
        this.error = 'Failed to parse STL file: ' + err.message;
        this.loading = false;
      }
    },

    resetCamera() {
      if (this.currentMesh) {
        const box = new THREE.Box3().setFromObject(this.currentMesh);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        this.camera.position.set(maxDim, maxDim, maxDim);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
      }
    },

    toggleWireframe() {
      this.wireframe = !this.wireframe;
      if (this.currentMesh) {
        this.currentMesh.material.wireframe = this.wireframe;
      }
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
.stl-viewer-container {
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

.control-btn:hover {
  background: #0056b3;
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
.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
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

.info-panel {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
}

.info-panel h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.info-panel p {
  margin: 5px 0;
  color: #666;
}
</style>
