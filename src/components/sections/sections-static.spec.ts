import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { mountWithPlugins } from '@/test/mount'
import CalculateResultSpecialist from './CalculateResultSpecialist.vue'
import HomeAdvantages from './HomeAdvantages.vue'
import HomeMilestones from './HomeMilestones.vue'
import HomeUslugi from './HomeUslugi.vue'
import UslugiKeywords from './uslugi/UslugiKeywords.vue'
import UslugiRequirementsAccordion from './uslugi/UslugiRequirementsAccordion.vue'
import UslugiGalv from './uslugi/UslugiGalv.vue'
import UslugiGrinding from './uslugi/UslugiGrinding.vue'
import UslugiLathe from './uslugi/UslugiLathe.vue'
import UslugiMilling from './uslugi/UslugiMilling.vue'
import UslugiPaint from './uslugi/UslugiPaint.vue'
import UslugiPKM from './uslugi/UslugiPKM.vue'
import UslugiPKMAdvantages from './uslugi/UslugiPKMAdvantages.vue'
import UslugiPKMExample from './uslugi/UslugiPKMExample.vue'
import UslugiPrint from './uslugi/UslugiPrint.vue'
import UslugiPrintExample from './uslugi/UslugiPrintExample.vue'
import UslugiRubber from './uslugi/UslugiRubber.vue'
import UslugiTestEquipment from './uslugi/UslugiTestEquipment.vue'
import UslugiTestExternal from './uslugi/UslugiTestExternal.vue'
import UslugiTestOptical from './uslugi/UslugiTestOptical.vue'
import UslugiWeld from './uslugi/UslugiWeld.vue'
import TestClimate from './testing/TestClimate.vue'
import TestDust from './testing/TestDust.vue'
import TestElectric from './testing/TestElectric.vue'
import TestHumidity from './testing/TestHumidity.vue'
import TestVibration from './testing/TestVibration.vue'

const staticSections = [
  [CalculateResultSpecialist, 'расчета специалистом'],
  [HomeAdvantages, 'Качество'],
  [HomeMilestones, /milestone|этап|год|20/i],
  [HomeUslugi, /услуг|производ/i],
  [UslugiGalv, /гальван/i],
  [UslugiGrinding, /шлиф/i],
  [UslugiLathe, /токар/i],
  [UslugiMilling, /фрезер|механо/i],
  [UslugiPaint, /покраск|лакокрас/i],
  [UslugiPKM, /полимерно-композицион|композит/i],
  [UslugiPKMAdvantages, /./],
  [UslugiPKMExample, /./],
  [UslugiPrint, /печат|3D/i],
  [UslugiPrintExample, /./],
  [UslugiRubber, /резин|уплотн/i],
  [UslugiTestEquipment, /оборудован|испытан/i],
  [UslugiTestExternal, /./],
  [UslugiTestOptical, /оптич/i],
  [UslugiWeld, /сварк/i],
  [TestClimate, /температур|влажност/i],
  [TestDust, /пыл/i],
  [TestElectric, /электр/i],
  [TestHumidity, /влажн/i],
  [TestVibration, /вибрац/i],
] as const

describe('static / content sections', () => {
  it.each(staticSections)('mounts %#', async (Comp, needle) => {
    const { wrapper } = await mountWithPlugins(Comp as any, {
      stubs: { teleport: false, transition: false },
    })
    expect(wrapper.exists()).toBe(true)
    if (typeof needle === 'string') {
      expect(wrapper.text()).toContain(needle)
    } else {
      expect(wrapper.text()).toMatch(needle)
    }
  })
})

describe('UslugiKeywords / RequirementsAccordion', () => {
  it('renders keyword tags', () => {
    const wrapper = mount(UslugiKeywords, { props: { tags: ['a', 'b'] } })
    expect(wrapper.text()).toContain('a')
    expect(wrapper.text()).toContain('b')
  })

  it('toggles requirements accordion on mobile', async () => {
    const wrapper = mount(UslugiRequirementsAccordion, {
      props: { isMobile: true, modelValue: false, title: 'Требования' },
    })
    expect(wrapper.text()).toContain('Требования')
    await wrapper.find('button.requirements-header--mobile').trigger('click')
    expect(wrapper.emitted('update:expanded')?.[0]).toEqual([true])
  })
})
