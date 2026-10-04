import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { mockJson, mockStatus } from '@/test/fetch-mock'
import { mountWithPlugins } from '@/test/mount'
import { useAuthStore } from '@/stores/auth.store'
import UploadModel from './UploadModel.vue'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  await nextTick()
}

function makeFile(name: string, content = 'solid x') {
  return new File([content], name, { type: 'application/octet-stream' })
}

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(ElMessage, 'success').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'error').mockImplementation(() => undefined as never)
  vi.spyOn(ElMessage, 'warning').mockImplementation(() => undefined as never)
})

describe('UploadModel', () => {
  it('opens login when unauthenticated user clicks upload', async () => {
    const { wrapper } = await mountWithPlugins(UploadModel, {
      stubs: { DialogLogin: true },
    })
    await wrapper.find('.upload').trigger('click')
    expect(wrapper.findComponent({ name: 'DialogLogin' }).exists()).toBe(true)
  })

  it('rejects unsupported extensions', async () => {
    const { wrapper, pinia } = await mountWithPlugins(UploadModel, {
      stubs: { DialogLogin: true },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush()

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [makeFile('part.pdf')],
    })
    await input.trigger('change')
    await flush()
    expect(ElMessage.warning).toHaveBeenCalled()
  })

  it('uploads an allowed model and sets file_id', async () => {
    mockJson('/api/v3/files', { id: 42 })
    const { wrapper, pinia } = await mountWithPlugins(UploadModel, {
      props: { modelValue: undefined, accept: '.stp,.step,.stl' },
      stubs: { DialogLogin: true },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    await flush()

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [makeFile('bracket.stp', 'ISO-10303-21;')],
    })
    await input.trigger('change')
    await flush()
    await new Promise((r) => setTimeout(r, 30))
    await flush()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([42])
    expect(ElMessage.success).toHaveBeenCalled()
  })

  it('shows STL-only label and warning for non-stl', async () => {
    const { wrapper, pinia } = await mountWithPlugins(UploadModel, {
      props: { accept: '.stl' },
      stubs: { DialogLogin: true },
      stubActions: false,
    })
    useAuthStore(pinia).setToken('tok', false)
    expect(wrapper.text()).toContain('STL')

    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [makeFile('a.stp')],
    })
    await input.trigger('change')
    await flush()
    expect(ElMessage.warning).toHaveBeenCalled()
  })
})
