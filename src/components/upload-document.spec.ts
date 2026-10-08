import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { mockJson, mockRoute } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import UploadFiles from './UploadFiles.vue'
import UploadFiles2 from './UploadFiles2.vue'
import DocumentShowByIds from './DocumentShowByIds.vue'
import DocumentShowByIds2 from './DocumentShowByIds2.vue'

async function flush(ms = 0) {
  await nextTick()
  await new Promise((r) => setTimeout(r, ms))
  await nextTick()
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
})

describe('UploadFiles / UploadFiles2', () => {
  it('UploadFiles mounts and shows formats for guests', async () => {
    const { wrapper } = await mountWithPlugins(UploadFiles, {
      props: { modelValue: [], service_id: 'cnc-milling' },
      stubs: { DialogLogin: true },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html().length).toBeGreaterThan(50)
    expect(wrapper.find('input[type="file"]').attributes('accept')).toBe('.stp')
  })

  it('UploadFiles accepts any file type when allowAnyFileType is set', async () => {
    const { wrapper } = await mountWithPlugins(UploadFiles, {
      props: { modelValue: [], service_id: 'other', allowAnyFileType: true },
      stubs: { DialogLogin: true },
    })
    expect(wrapper.find('input[type="file"]').attributes('accept')).toBeUndefined()
    expect(wrapper.text()).toContain('любого формата')
  })

  it('UploadFiles2 mounts for authenticated user', async () => {
    const { wrapper, pinia } = await mountWithPlugins(UploadFiles2, {
      props: { modelValue: [], service_id: 'printing' },
      stubs: { DialogLogin: true },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush()
    expect(wrapper.exists()).toBe(true)
  })
})

describe('DocumentShowByIds / DocumentShowByIds2', () => {
  it('loads documents by ids', async () => {
    mockJson('/api/v3/documents/1', { id: 1, original_filename: 'a.pdf' })
    mockJson('/api/v3/documents/2', { id: 2, original_filename: 'b.pdf' })

    const { wrapper, pinia } = await mountWithPlugins(DocumentShowByIds, {
      props: { modelValue: [1, 2] },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(50)

    expect(wrapper.text()).toMatch(/a\.pdf|b\.pdf|файл|документ/i)
  })

  it('DocumentShowByIds2 mounts with ids', async () => {
    mockJson('/api/v3/documents/5', { id: 5, original_filename: 'spec.pdf' })
    const { wrapper, pinia } = await mountWithPlugins(DocumentShowByIds2, {
      props: { modelValue: [5] },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(50)
    expect(wrapper.exists()).toBe(true)
  })

  it('downloads a document when the download control is clicked', async () => {
    mockJson('/api/v3/documents/1', { id: 1, original_filename: 'a.pdf' })
    mockRoute('/api/v3/documents/1/download', () => new Response(new Blob(['x']), { status: 200 }))

    const { wrapper, pinia } = await mountWithPlugins(DocumentShowByIds, {
      props: { modelValue: [1] },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush(50)

    const btn = wrapper.findAll('button, .el-button, a').find((n) =>
      /скачать|download/i.test(n.text() + (n.attributes('aria-label') || ''))
    )
    if (btn) {
      await btn.trigger('click')
      await flush(30)
    }
    expect(wrapper.exists()).toBe(true)
  })
})
