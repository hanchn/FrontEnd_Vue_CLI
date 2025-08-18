import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from 'vite-plugin-vue-devtools'
import autoRoutePlugin from './scripts/viteRoutePlugin.js'

export default defineConfig({
  plugins: [
    vue(),
    vueDevtools(),
    autoRoutePlugin() // 添加自动路由生成插件
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
