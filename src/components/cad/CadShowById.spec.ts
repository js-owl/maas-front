import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { mockJson } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import { saveFile3D, ensureLocalStpCacheReady, LOCAL_STP_FILE_ID } from '@/helpers/local-stp-files'
import CadShowById from './CadShowById.vue'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

const viewerStubs = {
  STLViewer: { template: '<div class="stl-stub" />', props: ['modelValue'] },
  STPViewer: { template: '<div class="stp-stub" />', props: ['modelValue'] },
  DialogLogin: true,
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
})

describe('CadShowById', () => {
  it('detects STP from server metadata and mounts STPViewer', async () => {
    mockJson('/api/v3/files/7', {
      file_type: 'stp',
      original_filename: 'part.stp',
    })
    const { wrapper, pinia } = await mountWithPlugins(CadShowById, {
      props: { modelValue: 7 },
      stubs: viewerStubs,
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush()
    await new Promise((r) => setTimeout(r, 40))
    await flush()
    expect(wrapper.find('.stp-stub').exists()).toBe(true)
  })

  it('forces STL viewer when stlOnly is set', async () => {
    const { wrapper } = await mountWithPlugins(CadShowById, {
      props: { modelValue: 3, stlOnly: true },
      stubs: viewerStubs,
    })
    await flush()
    expect(wrapper.find('.stl-stub').exists()).toBe(true)
  })

  it('shows STL drop zone when stlOnly and no file', async () => {
    const { wrapper } = await mountWithPlugins(CadShowById, {
      props: { modelValue: null, stlOnly: true },
      stubs: viewerStubs,
    })
    await flush()
    expect(wrapper.text()).toMatch(/Перетащите STL|STL/i)
  })

  it('resolves type from local IndexedDB cache', async () => {
    await ensureLocalStpCacheReady()
    await saveFile3D('local.stl', btoa('solid x'), 'stl')

    const { wrapper } = await mountWithPlugins(CadShowById, {
      props: { modelValue: LOCAL_STP_FILE_ID },
      stubs: viewerStubs,
    })
    await flush()
    await new Promise((r) => setTimeout(r, 40))
    await flush()
    expect(wrapper.find('.stl-stub').exists()).toBe(true)
  })

  it('rejects non-stl drops in stlOnly mode', async () => {
    const { wrapper } = await mountWithPlugins(CadShowById, {
      props: { modelValue: null, stlOnly: true },
      stubs: viewerStubs,
    })
    await flush()
    const file = new File(['x'], 'a.stp', { type: 'application/octet-stream' })
    await wrapper.trigger('drop', {
      dataTransfer: { files: [file] },
      preventDefault() {},
    })
    await flush()
    expect(ElMessage.warning).toHaveBeenCalled()
  })
})
