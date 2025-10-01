# Vue.js CAD File Viewer Setup Instructions

## Prerequisites

Before using the CAD viewer components, ensure you have the following installed:

- Node.js (version 14 or higher)
- Vue.js 3.x
- npm or yarn package manager

## Required Dependencies

### Core Dependencies (Required for all components)

```bash
npm install three
```

### For STP/STEP File Support (Optional but recommended)

```bash
npm install occt-import-js
```

### For Vue 3D Loader Alternative

```bash
npm install vue-3d-loader
```

## Component Installation

### 1. Copy Component Files

Copy the desired component files to your Vue.js project:

- `STLViewer.vue` - For STL files only
- `STPViewer.vue` - For STP/STEP files only  
- `UniversalCADViewer.vue` - For both STL and STP/STEP files

### 2. Import and Register Components

In your Vue component or main application file:

```javascript
// For individual components
import STLViewer from './components/STLViewer.vue'
import STPViewer from './components/STPViewer.vue'

// For universal component
import UniversalCADViewer from './components/UniversalCADViewer.vue'

export default {
  components: {
    STLViewer,
    STPViewer,
    UniversalCADViewer
  }
}
```

### 3. Use in Templates

```vue
<template>
  <div>
    <!-- For STL files only -->
    <STLViewer />
    
    <!-- For STP/STEP files only -->
    <STPViewer />
    
    <!-- For both STL and STP/STEP files -->
    <UniversalCADViewer />
  </div>
</template>
```

## File Structure Requirements

### Public Folder Setup

For proper file loading, ensure your project structure includes:

```
public/
├── models/          # Place your 3D model files here
│   ├── sample.stl
│   ├── example.stp
│   └── test.step
└── index.html
```

### Asset Handling

When loading files programmatically (not via file upload), place them in the `public` folder and reference them with paths relative to the public directory:

```javascript
// Correct path for files in public/models/
const filePath = '/models/sample.stl'
```

## Configuration Options

### STL Viewer Configuration

The STL viewer supports the following features:
- File upload via input or drag & drop
- Wireframe/solid view toggle
- Camera reset
- Model information display
- Automatic centering and scaling

### STP Viewer Configuration

The STP viewer includes additional features:
- Multi-part model support
- Individual mesh selection
- Color-coded parts
- Detailed mesh information
- OCCT library integration

### Universal Viewer Configuration

The universal viewer combines both STL and STP capabilities:
- Automatic file type detection
- Unified interface for both formats
- Grid toggle
- Enhanced UI with modern styling

## Troubleshooting

### Common Issues

1. **OCCT Library Not Found**
   ```
   Error: Failed to initialize OCCT library
   ```
   **Solution:** Install occt-import-js: `npm install occt-import-js`

2. **File Loading Errors**
   ```
   RangeError: Invalid typed array length
   ```
   **Solution:** Ensure files are in the `public` folder and use correct paths

3. **Module Import Errors**
   ```
   Cannot resolve module 'three/examples/jsm/loaders/STLLoader.js'
   ```
   **Solution:** Ensure Three.js is properly installed: `npm install three`

### Performance Optimization

For large files:
- Use lower deflection values in OCCT settings
- Implement progressive loading
- Consider file size limits
- Use Web Workers for heavy processing

### Browser Compatibility

The components require:
- WebGL support
- ES6 module support
- File API support
- Modern browser (Chrome 60+, Firefox 55+, Safari 12+)

## Advanced Usage

### Custom Styling

Override component styles by targeting CSS classes:

```css
.universal-cad-viewer {
  /* Custom container styles */
}

.canvas-container {
  /* Custom canvas styles */
}

.info-panel {
  /* Custom info panel styles */
}
```

### Event Handling

Listen for component events:

```vue
<template>
  <UniversalCADViewer 
    @model-loaded="onModelLoaded"
    @error="onError"
  />
</template>

<script>
export default {
  methods: {
    onModelLoaded(modelInfo) {
      console.log('Model loaded:', modelInfo)
    },
    onError(error) {
      console.error('Viewer error:', error)
    }
  }
}
</script>
```

### Integration with Existing Projects

To integrate with existing Vue.js projects:

1. Install dependencies
2. Copy component files
3. Import and register components
4. Add to your routing or page components
5. Customize styling as needed

## Production Deployment

### Build Considerations

When building for production:

1. Ensure WASM files are properly served
2. Configure proper MIME types for .wasm files
3. Set up CORS headers if needed
4. Optimize bundle size by importing only needed Three.js modules

### Server Configuration

For OCCT library to work properly, ensure your server serves .wasm files with the correct MIME type:

```
.wasm application/wasm
```

## Support and Resources

- Three.js Documentation: https://threejs.org/docs/
- OCCT Import JS: https://github.com/kovacsv/occt-import-js
- Vue.js Documentation: https://vuejs.org/guide/
- Online 3D Viewer: https://3dviewer.net/
