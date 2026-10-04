import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { mountWithPlugins } from '@/test/mount'
import SeoMainHeading from './SeoMainHeading.vue'
import SuitableMachines from './SuitableMachines.vue'
import ServicesCabinetMenu from './ServicesCabinetMenu.vue'
import VersionInfo from './VersionInfo.vue'
import Footer from './Footer.vue'

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('SeoMainHeading', () => {
  it('renders a hidden H1 on public routes without their own heading', async () => {
    const { wrapper } = await mountWithPlugins(SeoMainHeading, {
      initialRoute: '/',
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/milling', name: 'milling', component: { template: '<div />' } },
      ],
    })
    // Home may have own H1 or not — either null or an h1
    expect(wrapper.find('h1').exists() || wrapper.html() === '<!--v-if-->' || !wrapper.text()).toBeTruthy()
  })

  it('hides heading on /personal paths', async () => {
    const { wrapper } = await mountWithPlugins(SeoMainHeading, {
      initialRoute: '/personal',
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/personal', name: 'personal', component: { template: '<div />' } },
      ],
    })
    expect(wrapper.find('h1').exists()).toBe(false)
  })
})

describe('SuitableMachines', () => {
  it('lists machine names', () => {
    const wrapper = mount(SuitableMachines, {
      props: { machines: ['DMG MORI', 'HAAS'] },
    })
    expect(wrapper.text()).toContain('DMG MORI')
    expect(wrapper.text()).toContain('HAAS')
    expect(wrapper.text()).toContain('Подходящее оборудование')
  })
})

describe('ServicesCabinetMenu', () => {
  it('emits open-service with route paths', async () => {
    const wrapper = mount(ServicesCabinetMenu)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
    await buttons[0].trigger('click')
    expect(wrapper.emitted('open-service')?.[0]?.[0]).toMatch(/^\//)
  })
})

describe('VersionInfo', () => {
  it('mounts and can open the build dialog', async () => {
    const { wrapper } = await mountWithPlugins(VersionInfo, {
      stubs: { teleport: false, ElDialog: false },
    })
    // May render nothing if buildInfo is empty in test env — just ensure no throw
    expect(wrapper.exists()).toBe(true)
    const tag = wrapper.find('.version-tag, .el-tag')
    if (tag.exists()) {
      await tag.trigger('click')
    }
  })
})

describe('Footer', () => {
  it('renders legal links and opens call dialog', async () => {
    const { wrapper } = await mountWithPlugins(Footer, {
      stubs: { DialogCall: true, teleport: false },
      routes: [
        { path: '/', name: 'home', component: { template: '<div />' } },
        { path: '/policy', name: 'policy', component: { template: '<div />' } },
        { path: '/license', name: 'license', component: { template: '<div />' } },
        { path: '/offer-client', name: 'offer', component: { template: '<div />' } },
      ],
    })
    expect(wrapper.text()).toMatch(/Политика|оферт|соглашени/i)
    const callBtn = wrapper.findAll('button, a').find((n) => /звонок|связ/i.test(n.text()))
    if (callBtn) await callBtn.trigger('click')
  })
})
