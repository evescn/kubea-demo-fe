import { createApp } from 'vue'
import App from './App.vue'

// 导入 ant design 组件和 css
import Antd from 'ant-design-vue'
// 暗黑色主题风格
import 'ant-design-vue/dist/antd.dark.css'
import * as Icons from '@ant-design/icons-vue'

// 导入 路由
import router from './router'

const app = createApp(App)
// 图标注册全局组件
for (const i in Icons) {
    app.component(i, Icons[i])
}
// 引入 antd
app.use(Antd)
// 引入 router
app.use(router)
app.mount('#app')


// createApp(App).mount('#app')
