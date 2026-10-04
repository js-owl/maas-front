import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PvzMapPreview from './PvzMapPreview.vue'
import type { CdekPvz } from '@/helpers/cdek-delivery'

const point: CdekPvz = {
  code: 'MSK1',
  name: 'ПВЗ',
  location: {
    latitude: 55.75,
    longitude: 37.62,
    address: 'Тверская 1',
  },
}

describe('PvzMapPreview', () => {
  it('renders nothing without coordinates', () => {
    const wrapper = mount(PvzMapPreview, { props: { point: null } })
    expect(wrapper.find('.pvz-map-preview').exists()).toBe(false)
  })

  it('shows static map link for a valid point', () => {
    const wrapper = mount(PvzMapPreview, { props: { point } })
    expect(wrapper.find('.pvz-map-preview').exists()).toBe(true)
    const link = wrapper.find('a.pvz-map-preview__link')
    expect(link.attributes('href')).toContain('yandex')
    expect(wrapper.find('img.pvz-map-preview__image').exists()).toBe(true)
    expect(wrapper.text()).toContain('Яндекс')
  })

  it('switches to fallback when the map image errors', async () => {
    const wrapper = mount(PvzMapPreview, { props: { point } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Открыть пункт на карте')
  })

  it('resets map failure when the point code changes', async () => {
    const wrapper = mount(PvzMapPreview, { props: { point } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)

    await wrapper.setProps({
      point: {
        ...point,
        code: 'MSK2',
        location: { ...point.location, latitude: 55.76, longitude: 37.63 },
      },
    })
    expect(wrapper.find('img.pvz-map-preview__image').exists()).toBe(true)
  })
})
