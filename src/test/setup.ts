/**
 * Global vitest setup, registered via `test.setupFiles` in vite.config.ts.
 *
 * Only the browser APIs that jsdom 28 genuinely lacks are polyfilled here —
 * fetch, Response, FileReader and URL.createObjectURL are already provided.
 */
import { afterEach, beforeEach, vi } from 'vitest'
import { config } from '@vue/test-utils'
// helpers/local-stp-files.ts opens IndexedDB on import; jsdom has no implementation.
import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'
import { installFetchMock, resetFetchMock } from './fetch-mock'
import { resetCadMocks } from './cad-mocks'

/**
 * jsdom has no WebGL, so the CAD viewers cannot build a real renderer.
 * three.js math is left intact — only the GPU-backed classes are replaced.
 */
vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>()
  const { WebGLRendererStub, PMREMGeneratorStub } = await import('./cad-mocks')
  return { ...actual, WebGLRenderer: WebGLRendererStub, PMREMGenerator: PMREMGeneratorStub }
})

vi.mock('three/examples/jsm/controls/OrbitControls.js', async () => {
  const { OrbitControlsStub } = await import('./cad-mocks')
  return { OrbitControls: OrbitControlsStub }
})

vi.mock('occt-import-js', async () => {
  const { createOcctModuleStub } = await import('./cad-mocks')
  return { default: createOcctModuleStub() }
})

class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

/** jsdom has no layout engine, so matchMedia is driven off window.innerWidth. */
function matchMediaStub(query: string): MediaQueryList {
  const maxWidth = /max-width:\s*(\d+)px/.exec(query)
  const minWidth = /min-width:\s*(\d+)px/.exec(query)
  let matches = false
  if (maxWidth) matches = window.innerWidth <= Number(maxWidth[1])
  else if (minWidth) matches = window.innerWidth >= Number(minWidth[1])

  return {
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as MediaQueryList
}

installFetchMock()

vi.stubGlobal('ResizeObserver', ResizeObserverStub)
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
vi.stubGlobal('matchMedia', matchMediaStub)
window.matchMedia = matchMediaStub
Element.prototype.scrollIntoView = () => {}

/**
 * Element Plus teleports overlays to body. Rendering them inline keeps
 * `wrapper.find` working without manual document queries in every test.
 */
config.global.stubs = {
  teleport: true,
  transition: false,
  'transition-group': false,
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  // A fresh factory drops every database created by the previous test.
  globalThis.indexedDB = new IDBFactory()
  window.innerWidth = 1620
  window.innerHeight = 720
})

afterEach(() => {
  resetFetchMock()
  resetCadMocks()
  vi.clearAllMocks()
  document.body.innerHTML = ''
})
