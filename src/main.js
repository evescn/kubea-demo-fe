import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
// import '@arco-design/web-vue/dist/arco-dark.css'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'

const app = createApp(App)
app.use(ArcoVue)
app.use(pinia)
app.use(router)
app.use(ArcoVueIcon)
app.mount('#app')
