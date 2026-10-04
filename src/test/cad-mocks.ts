/**
 * Stubs for the GPU- and WASM-backed parts of the CAD viewers.
 *
 * Only `WebGLRenderer`, `PMREMGenerator`, `OrbitControls` and
 * `occt-import-js` are replaced — three.js math (Vector3, Box3,
 * BufferGeometry, STLLoader) is pure JavaScript and runs fine in jsdom, so
 * geometry handling stays covered by real code instead of a stub.
 *
 * This module must not import from 'three': the three mock factory in
 * setup.ts imports it, which would create a cycle.
 */

/** Minimal Vector3 stand-in for `controls.target`. */
class TargetVector {
  x = 0
  y = 0
  z = 0

  set(x: number, y: number, z: number): this {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  copy(v: { x: number; y: number; z: number }): this {
    return this.set(v.x, v.y, v.z)
  }

  clone(): TargetVector {
    return new TargetVector().copy(this)
  }
}

const PNG_DATA_URL = 'data:image/png;base64,stub'

export class WebGLRendererStub {
  readonly domElement: HTMLCanvasElement
  readonly shadowMap = { enabled: false, type: 0 }
  toneMapping = 0
  toneMappingExposure = 1
  outputColorSpace = ''

  /** Call counters, so tests can assert the render loop without a GPU. */
  renderCount = 0
  disposed = false
  size: { width: number; height: number } = { width: 0, height: 0 }

  readonly parameters: Record<string, unknown>

  constructor(parameters: Record<string, unknown> = {}) {
    this.parameters = parameters
    this.domElement = document.createElement('canvas')
    // jsdom throws on toDataURL unless the native canvas package is present.
    this.domElement.toDataURL = () => PNG_DATA_URL
  }

  setSize(width: number, height: number): void {
    this.size = { width, height }
  }

  setPixelRatio(): void {}
  setClearColor(): void {}

  getSize<T extends { x: number; y: number }>(target: T): T {
    target.x = this.size.width
    target.y = this.size.height
    return target
  }

  render(): void {
    this.renderCount += 1
  }

  dispose(): void {
    this.disposed = true
  }

  forceContextLoss(): void {}
}

export class PMREMGeneratorStub {
  disposed = false

  fromScene(): { texture: Record<string, unknown> } {
    return { texture: {} }
  }

  dispose(): void {
    this.disposed = true
  }
}

export class OrbitControlsStub {
  enableDamping = false
  dampingFactor = 0
  minDistance = 0
  maxDistance = Infinity
  screenSpacePanning = false
  readonly target = new TargetVector()

  updateCount = 0
  disposed = false

  update(): void {
    this.updateCount += 1
  }

  dispose(): void {
    this.disposed = true
  }

  addEventListener(): void {}
  removeEventListener(): void {}
}

/* ------------------------------------------------------------------ */
/* occt-import-js                                                      */
/* ------------------------------------------------------------------ */

export type OcctMesh = {
  name?: string
  color?: number[]
  attributes: {
    position: { array: number[] }
    normal?: { array: number[] }
  }
  index?: { array: number[] }
}

export type OcctResult = {
  success: boolean
  meshes: OcctMesh[]
}

/** A single triangle — enough for the viewers to build a valid geometry. */
export function makeOcctTriangle(name = 'stub-solid'): OcctMesh {
  return {
    name,
    attributes: {
      position: { array: [0, 0, 0, 1, 0, 0, 0, 1, 0] },
      normal: { array: [0, 0, 1, 0, 0, 1, 0, 0, 1] },
    },
    index: { array: [0, 1, 2] },
  }
}

const defaultOcctResult = (): OcctResult => ({
  success: true,
  meshes: [makeOcctTriangle()],
})

const occtState: { result: OcctResult; shouldFailToLoad: boolean } = {
  result: defaultOcctResult(),
  shouldFailToLoad: false,
}

/** Overrides what `ReadStepFile` returns for the next parse. */
export function setOcctStepResult(result: Partial<OcctResult>): void {
  occtState.result = { ...defaultOcctResult(), ...result }
}

/** Makes the WASM module import reject, as it does when the .wasm is missing. */
export function failOcctLoad(): void {
  occtState.shouldFailToLoad = true
}

/** Restores default CAD mock behaviour. Runs after every test. */
export function resetCadMocks(): void {
  occtState.result = defaultOcctResult()
  occtState.shouldFailToLoad = false
}

/** Mirrors the real module's default export: an async module factory. */
export function createOcctModuleStub() {
  return async (_options?: { locateFile?: (path: string) => string }) => {
    if (occtState.shouldFailToLoad) {
      throw new Error('occt-import-js failed to load')
    }
    return {
      ReadStepFile: (_buffer: Uint8Array) => occtState.result,
      ReadBrepFile: (_buffer: Uint8Array) => occtState.result,
      ReadIgesFile: (_buffer: Uint8Array) => occtState.result,
    }
  }
}
