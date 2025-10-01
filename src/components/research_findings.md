# 3D File Visualization Research Findings

## Online3DViewer (https://github.com/kovacsv/Online3DViewer)

### Key Information:
- Free and open source web solution for 3D model visualization
- Live website: https://3dviewer.net
- Built with JavaScript (84.8% of codebase)
- 3.2k stars on GitHub, actively maintained

### Supported File Formats:
**Import:** 3dm, 3ds, 3mf, amf, bim, brep, dae, fbx, fcstd, gltf, ifc, iges, step, stl, obj, off, ply, wrl

**Export:** 3dm, bim, gltf, obj, off, stl, ply

### Key Features:
- **STL Support:** ✅ Yes (both import and export)
- **STP/STEP Support:** ✅ Yes (import only)
- **Browser-based:** Runs entirely in browser
- **No backend required:** Client-side processing

### External Libraries Used:
- three.js (3D rendering)
- pickr (color picker)
- fflate (compression)
- draco (3D compression)
- rhino3dm (3D geometry)
- web-ifc (IFC format support)
- occt-import-js (OpenCASCADE for STEP/IGES files)

### Integration Potential:
- Can be embedded as a library
- Source code available for customization
- Uses standard web technologies


## occt-import-js (https://github.com/kovacsv/occt-import-js)

### Key Information:
- Emscripten interface for OpenCascade import functionalities
- Runs entirely in the browser using WebAssembly
- 232 stars on GitHub, actively maintained (latest release Dec 2024)
- Available on npm: `npm install occt-import-js`

### Supported File Formats:
- **STEP files:** ✅ Yes (ReadStepFile function)
- **STL files:** ❌ No (only BREP, STEP, IGES)
- **BREP files:** ✅ Yes
- **IGES files:** ✅ Yes

### Key Features:
- **Browser-based:** Runs entirely in browser with WebAssembly
- **No backend required:** Client-side processing
- **Three.js compatible:** Output geometry is compatible with Three.js
- **Triangulation parameters:** Configurable mesh quality

### Usage Example (from JSFiddle):
```javascript
async function LoadGeometry(targetObject) {
    // init occt-import-js
    const occt = await occtimportjs();
    
    // download a step file
    let fileUrl = 'https://raw.githubusercontent.com/kovacsv/occt-import-js/main/test/testfiles/cax-if/as1_pe_203.stp';
    let response = await fetch(fileUrl);
    let buffer = await response.arrayBuffer();
    
    // read the imported step file
    let fileBuffer = new Uint8Array(buffer);
    let result = occt.ReadStepFile(fileBuffer, null);
    
    // process the geometries of the result
    for (let resultMesh of result.meshes) {
        let geometry = new THREE.BufferGeometry();
        // ... create Three.js geometry from result
    }
}
```

### Integration with Vue.js:
- Can be imported as npm package
- Works with standard JavaScript/Vue.js applications
- Returns JSON data compatible with Three.js
- Requires WASM file to be served alongside JS file

## Vue.js Integration Methods

### vue-3d-loader (https://github.com/king2088/vue-3d-loader)

**Key Information:**
- Vue.js + Three.js 3D viewer component
- 272 stars on GitHub, actively maintained
- Available on npm: `npm install vue-3d-loader -S`

**Supported File Formats:**
- **STL Support:** ✅ Yes (explicitly mentioned)
- **STP/STEP Support:** ❌ No (not in supported formats list)
- **Other formats:** .dae, .fbx, .gltf, .glb, .obj, .ply, .json

**Features:**
- Load single or multiple 3D models simultaneously
- Support for different model types in same scene
- Material and texture support
- Interactive controls
- Vue 3 compatible

**Usage Example:**
```vue
<template>
  <vue3dLoader filePath="/models/sample.stl" />
</template>

<script>
import { vue3dLoader } from "vue-3d-loader";
export default {
  components: { vue3dLoader }
}
</script>
```

### Three.js STLLoader in Vue.js

**Key Findings from StackOverflow:**
- STL files must be placed in the `public` folder for proper loading
- Use ES6 import syntax: `import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'`
- File path should be relative to public folder: `loader.load('stl/example.stl', ...)`

**Common Issues:**
- RangeError when file path is incorrect
- Files in src/assets folder may not load properly
- Need to handle async loading in Vue lifecycle methods

## Buerli CAD System (https://buerli.io/)

**Key Information:**
- Commercial cloud CAD system with Three.js integration
- Currently in public beta phase
- Requires backend service setup

**Supported File Formats:**
- **STEP Support:** ✅ Yes (AP203, AP214, AP242)
- **IGES Support:** ✅ Yes (available on request)
- **Assembly structures:** Supported in standard and enterprise plans

**Features:**
- Direct Three.js integration
- Solid-based modeling operations
- Interactive CAD system
- Native binary format for parametric history
- Headless modeling capabilities

**Three.js Integration Example:**
```javascript
const geom = await api.createBufferGeometry(offset)
const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial())
scene.add(mesh)
```

**Limitations:**
- Commercial solution (pricing not publicly available)
- Requires backend service
- Still in beta development phase
