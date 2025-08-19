import { createApp } from 'vue'
import App from './App.vue'
import router from './Router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import EnvUtils from './Utils/Env.js'

// 打印环境信息
EnvUtils.printEnvInfo()

// 根据环境加载VConsole
if (EnvUtils.isVConsoleEnabled()) {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole()
  })
}

const app = createApp(App)

// 全局属性
app.config.globalProperties.$env = EnvUtils

app.use(router)
app.use(Antd)
app.mount('#app')
