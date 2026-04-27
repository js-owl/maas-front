import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

import './style.css'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()
const head = createHead()
app.use(head).use(router).use(pinia).mount('#app')
