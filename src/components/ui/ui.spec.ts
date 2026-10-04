import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import ButtonRound from './ButtonRound.vue'
import Input from './Input.vue'
import InputEdit from './InputEdit.vue'
import Checkbox from './Checkbox.vue'
import CheckboxСalc from './CheckboxСalc.vue'
import Radio from './Radio.vue'
import Loader from './Loader.vue'
import Select from './Select.vue'
import SelectCalc from './SelectCalc.vue'
import SelectGroup from './SelectGroup.vue'
import SelectFiles from './SelectFiles.vue'
import DatePicker from './DatePicker.vue'
import HomeCalcOrderTypeMobile from './HomeCalcOrderTypeMobile.vue'
import { mountWithPlugins } from '@/test/mount'

async function flush() {
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
}

describe('Button', () => {
  it('emits click when enabled', async () => {
    const wrapper = mount(Button, { slots: { default: 'OK' } })
    expect(wrapper.text()).toContain('OK')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit when disabled or loading', async () => {
    const disabled = mount(Button, { props: { disabled: true } })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()

    const loading = mount(Button, { props: { loading: true } })
    expect(loading.find('.btn-spinner').exists()).toBe(true)
    await loading.trigger('click')
    expect(loading.emitted('click')).toBeUndefined()
  })

  it('applies flat class', () => {
    expect(mount(Button, { props: { flat: true } }).classes()).toContain('is-flat')
  })
})

describe('ButtonRound', () => {
  it('emits click and renders icon slot', async () => {
    const wrapper = mount(ButtonRound, {
      slots: { default: 'Go', 'icon-left': '<span class="ico">i</span>' },
    })
    expect(wrapper.find('.btn-icon-left').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('blocks click while loading', async () => {
    const wrapper = mount(ButtonRound, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

describe('Input', () => {
  it('forwards model updates', async () => {
    const wrapper = mount(Input, { props: { modelValue: '', placeholder: 'email' } })
    await wrapper.find('input').setValue('a@b.c')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a@b.c'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['a@b.c'])
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(Input, { props: { type: 'password', modelValue: 'secret' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
    await wrapper.find('.password-toggle').trigger('click')
    await flush()
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })
})

describe('InputEdit', () => {
  it('edits, saves trimmed value, and cancels', async () => {
    const wrapper = mount(InputEdit, { props: { modelValue: 'Name' } })
    expect(wrapper.find('.input-edit-value').text()).toBe('Name')

    await wrapper.find('.input-edit-btn').trigger('click')
    expect(wrapper.find('.input-edit-edit').exists()).toBe(true)

    await wrapper.find('input').setValue('  New  ')
    await wrapper.findAll('button').find((b) => b.text().includes('✓'))!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New'])

    await wrapper.setProps({ modelValue: 'New' })
    await wrapper.find('.input-edit-btn').trigger('click')
    await wrapper.find('input').setValue('')
    await wrapper.findAll('button').find((b) => b.text().includes('✓'))!.trigger('click')
    expect(wrapper.find('.input-edit-view').exists()).toBe(true)

    await wrapper.find('.input-edit-btn').trigger('click')
    await wrapper.find('input').setValue('tmp')
    await wrapper.findAll('button').find((b) => b.text().includes('✕'))!.trigger('click')
    expect(wrapper.find('.input-edit-value').text()).toBe('New')
  })
})

describe('Checkbox / CheckboxСalc / Radio', () => {
  it('renders slot content', () => {
    expect(mount(Checkbox, { slots: { default: 'A' } }).text()).toContain('A')
    expect(mount(CheckboxСalc, { slots: { default: 'B' } }).text()).toContain('B')
    expect(mount(Radio, { props: { value: '1' }, slots: { default: 'R' } }).text()).toContain('R')
  })
})

describe('Loader', () => {
  it('wraps slot and accepts loading prop', () => {
    const wrapper = mount(Loader, {
      props: { loading: true, text: 'Ждём' },
      slots: { default: '<p class="payload">x</p>' },
    })
    expect(wrapper.find('.payload').exists()).toBe(true)
    expect(wrapper.find('.loader-wrapper').exists()).toBe(true)
  })
})

describe('Select family', () => {
  it('Select forwards el-select events', async () => {
    const wrapper = mount(Select, { props: { modelValue: '', placeholder: 'Pick' } })
    const elSelect = wrapper.findComponent({ name: 'ElSelect' })
    await elSelect.vm.$emit('update:modelValue', '1')
    await elSelect.vm.$emit('change', '1')
    await elSelect.vm.$emit('visible-change', true)
    await elSelect.vm.$emit('clear')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('SelectCalc mounts with options', () => {
    const wrapper = mount(SelectCalc, {
      props: {
        modelValue: 'a',
        inputData: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ],
      },
    })
    expect(wrapper.findComponent({ name: 'ElSelect' }).exists()).toBe(true)
  })

  it('SelectGroup mounts grouped options', () => {
    const wrapper = mount(SelectGroup, {
      props: {
        modelValue: null,
        options: [{ label: 'G', options: [{ value: '1', label: 'One' }] }],
        placeholder: 'Group',
      },
    })
    expect(wrapper.find('.full').exists()).toBe(true)
  })

  it('SelectFiles expands, downloads and shows empty state', async () => {
    const docs = [
      { id: 7, original_filename: 'a.pdf', uploaded_at: '2026-01-15T12:00:00Z' },
    ]
    const wrapper = mount(SelectFiles, { props: { uploadedDocuments: docs } })
    expect(wrapper.text()).toContain('a.pdf')
    await wrapper.find('.file-download').trigger('click')
    expect(wrapper.emitted('view-document')?.[0]?.[0]).toMatchObject({ id: 7 })

    await wrapper.find('.files-header').trigger('click')
    expect(wrapper.find('.files-list').exists()).toBe(false)

    const empty = mount(SelectFiles, { props: { uploadedDocuments: [] } })
    expect(empty.text()).toContain('Файлы отсутствуют')
  })
})

describe('DatePicker', () => {
  it('mounts with null value', () => {
    const wrapper = mount(DatePicker, { props: { modelValue: null } })
    expect(wrapper.findComponent({ name: 'ElDatePicker' }).exists()).toBe(true)
  })
})

describe('HomeCalcOrderTypeMobile', () => {
  it('opens, selects an option, and closes', async () => {
    const { wrapper } = await mountWithPlugins(HomeCalcOrderTypeMobile, {
      props: { modelValue: 'milling' },
    })
    expect(wrapper.text()).toContain('Механическая обработка')

    await wrapper.find('.home-calc-order-type-mobile__trigger').trigger('click')
    expect(wrapper.classes()).toContain('is-open')

    const options = wrapper.findAll('.home-calc-order-type-mobile__option')
    expect(options.length).toBeGreaterThan(1)
    await options[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['printing'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['printing'])
    expect(wrapper.classes()).not.toContain('is-open')
  })
})
