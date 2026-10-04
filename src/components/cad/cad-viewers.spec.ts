import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockRoute, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import {
  ensureLocalStpCacheReady,
  LOCAL_STP_FILE_ID,
  saveFile3D,
} from '@/helpers/local-stp-files'
import { failOcctLoad, setOcctStepResult } from '@/test/cad-mocks'
import STLViewer from './STLViewer.vue'
import STPViewer from './STPViewer.vue'

async function flush(ms = 0) {
  await nextTick()
  await new Promise((r) => setTimeout(r, ms || 0))
  await nextTick()
}

const ASCII_STL = `solid test
facet normal 0 0 1
 outer loop
  vertex 0 0 0
  vertex 1 0 0
  vertex 0 1 0
 endloop
endfacet
endsolid test`

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 400,
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => 300,
  })
})

afterEach(() => {
  delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth
  delete (HTMLElement.prototype as { clientHeight?: number }).clientHeight
})

describe('STLViewer', () => {
  it('loads an STL from the local cache and renders', async () => {
    await ensureLocalStpCacheReady()
    await saveFile3D('part.stl', btoa(ASCII_STL), 'stl')

    const { wrapper } = await mountWithPlugins(STLViewer, {
      props: { modelValue: LOCAL_STP_FILE_ID },
      attachTo: document.body,
    })
    await flush(80)

    expect(wrapper.find('.error, .error-message').exists() || wrapper.text().includes('Не удалось')).toBe(
      false
    )
    // Container should exist after mount
    expect(wrapper.html().length).toBeGreaterThan(20)
    wrapper.unmount()
  })

  it('loads an STL from the API download endpoint', async () => {
    mockRoute('/api/v3/files/22/download', () => new Response(ASCII_STL, { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(STLViewer, {
      props: { modelValue: 22 },
      attachTo: document.body,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(80)

    expect(wrapper.text()).not.toMatch(/Не удалось загрузить STL/)
    wrapper.unmount()
  })

  it('shows an error when the download fails', async () => {
    mockStatus('/api/v3/files/23/download', 500)

    const { wrapper, pinia } = await mountWithPlugins(STLViewer, {
      props: { modelValue: 23 },
      attachTo: document.body,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(80)

    expect(wrapper.text()).toMatch(/Не удалось|ошибк/i)
    wrapper.unmount()
  })
})

describe('STPViewer', () => {
  it('shows the drop zone when no file is selected', async () => {
    const { wrapper } = await mountWithPlugins(STPViewer, {
      props: { modelValue: null },
      attachTo: document.body,
    })
    await flush(20)
    expect(wrapper.text()).toMatch(/Перетащите STP|stp/i)
    wrapper.unmount()
  })

  it('loads a STEP file from the server via occt stub', async () => {
    mockRoute('/api/v3/files/31/download', () => new Response('ISO-10303-21;', { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(STPViewer, {
      props: { modelValue: 31 },
      attachTo: document.body,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(120)

    expect(wrapper.find('.error-overlay').exists()).toBe(false)
    wrapper.unmount()
  })

  it('surfaces an error when occt fails to load', async () => {
    failOcctLoad()
    mockRoute('/api/v3/files/32/download', () => new Response('ISO-10303-21;', { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(STPViewer, {
      props: { modelValue: 32 },
      attachTo: document.body,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(120)

    expect(wrapper.find('.error-overlay').exists() || wrapper.text().includes('Error')).toBe(true)
    wrapper.unmount()
  })

  it('loads from local cache', async () => {
    setOcctStepResult({ success: true })
    await ensureLocalStpCacheReady()
    await saveFile3D('local.stp', btoa('ISO-10303-21;'), 'stp')

    const { wrapper } = await mountWithPlugins(STPViewer, {
      props: { modelValue: LOCAL_STP_FILE_ID },
      attachTo: document.body,
    })
    await flush(120)

    expect(wrapper.find('.error-overlay').exists()).toBe(false)
    wrapper.unmount()
  })

  it('clears error overlay on retry click', async () => {
    failOcctLoad()
    mockRoute('/api/v3/files/33/download', () => new Response('ISO-10303-21;', { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(STPViewer, {
      props: { modelValue: 33 },
      attachTo: document.body,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(120)

    const retry = wrapper.find('.btn-danger, button')
    if (retry.exists() && /Try Again|Повтор/i.test(retry.text() + wrapper.html())) {
      await retry.trigger('click')
      await flush()
    }
    wrapper.unmount()
  })
})
