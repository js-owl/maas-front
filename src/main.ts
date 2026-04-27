import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import router from './router'
import App from './App.vue'

import './style.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/loading/style/css'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()
app.use(head).use(router).use(pinia).mount('#app')
