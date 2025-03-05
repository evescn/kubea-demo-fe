import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'

// 导入 自定义 button
import CButton from '@/components/CButton'
import MainHead from '@/components/MainHead'

const app = createApp(App)
//自定义button 注册
app.component('c-button', CButton)
app.component('MainHead', MainHead)
app.use(ArcoVue)
app.use(pinia)
app.use(router)
app.use(ArcoVueIcon)
app.mount('#app')
