import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const ExampleComponent = defineComponent({
  name: 'ExampleComponent',
  props: {
    title: { type: String, required: true }
  },
  setup(props) {
    return () => h('div', { class: 'example' }, [h('h1', {}, props.title)])
  }
})

describe('Component test example', () => {
  it('renders prop', () => {
    const wrapper = mount(ExampleComponent, { props: { title: 'Test' } })
    expect(wrapper.find('h1').text()).toBe('Test')
    expect(wrapper.find('.example').exists()).toBe(true)
  })

  it('updates when prop changes', async () => {
    const wrapper = mount(ExampleComponent, { props: { title: 'Initial' } })
    expect(wrapper.find('h1').text()).toBe('Initial')
    await wrapper.setProps({ title: 'Updated' })
    expect(wrapper.find('h1').text()).toBe('Updated')
  })
})
