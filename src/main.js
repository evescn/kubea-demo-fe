import { createApp } from 'vue'
import App from './App.vue'

// 导入 ant design 组件和 css
import Antd from 'ant-design-vue'
// 暗黑色主题风格
import 'ant-design-vue/dist/antd.dark.css'
import * as Icons from '@ant-design/icons-vue'

// 导入 自定义 button
import CButton from '@/components/CButton'
import MainHead from '@/components/MainHead';
// import common from '@/config'
// import httpClient from '@/request'
// import { message } from 'ant-design-vue'

//codemirror编辑器
import { GlobalCmComponent } from "codemirror-editor-vue3";
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/dracula.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
import 'codemirror/mode/yaml/yaml.js'

// 导入 路由
import router from './router'

const app = createApp(App)
// 图标注册全局组件
for (const i in Icons) {
    app.component(i, Icons[i])
}

//自定义button 注册
app.component('c-button', CButton)
app.component('MainHead', MainHead)
app.use(GlobalCmComponent, { componentName: "codemirror" });

// 引入 antd
app.use(Antd)
// 引入 router
app.use(router)

app.mount('#app')


// createApp(App).mount('#app')
