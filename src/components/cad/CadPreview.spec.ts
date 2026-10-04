import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockJson, mockRoute, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import { failOcctLoad } from '@/test/cad-mocks'
import CadPreview from './CadPreview.vue'

async function flush(ms = 0) {
  await nextTick()
  await new Promise((r) => setTimeout(r, ms))
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
})

describe('CadPreview', () => {
  it('loads preview blob from server', async () => {
    mockRoute('/api/v3/files/11/preview', () => new Response(new Blob(['img']), { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(CadPreview, {
      props: { fileId: 11 },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(80)

    expect(wrapper.find('img.preview-image').exists()).toBe(true)
  })

  it('generates a preview from an STL download when server preview is missing', async () => {
    // Broad metadata mock first; more specific preview/download registered after (they win).
    mockJson(/\/api\/v3\/files\/12$/, { filename: 'part.stl' })
    mockStatus('/api/v3/files/12/preview', 404)
    mockRoute('/api/v3/files/12/download', () => new Response(ASCII_STL, { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(CadPreview, {
      props: { fileId: 12 },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(100)

    const img = wrapper.find('img.preview-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toMatch(/^data:image/)
  })

  it('generates a preview from STP via occt stub', async () => {
    mockJson(/\/api\/v3\/files\/13$/, { filename: 'part.stp' })
    mockStatus('/api/v3/files/13/preview', 404)
    mockRoute('/api/v3/files/13/download', () => new Response('ISO-10303-21;', { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(CadPreview, {
      props: { fileId: 13 },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(120)

    expect(wrapper.find('img.preview-image').exists()).toBe(true)
  })

  it('falls back to placeholder when occt fails', async () => {
    failOcctLoad()
    mockJson(/\/api\/v3\/files\/14$/, { filename: 'bad.stp' })
    mockStatus('/api/v3/files/14/preview', 404)
    mockRoute('/api/v3/files/14/download', () => new Response('ISO-10303-21;', { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(CadPreview, {
      props: { fileId: 14 },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(120)

    const img = wrapper.find('img.preview-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toMatch(/^data:image\/svg/)
  })
})
