import { createApp } from 'vue'
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
app.use(router).use(pinia).mount('#app')
