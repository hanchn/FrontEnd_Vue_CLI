import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, 'env'), '')
  
  return {
    plugins: [
      vue()
    ],
    envDir: resolve(__dirname, 'env'),
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
      global: 'globalThis'
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
    // 移除了 optimizeDeps 配置
  }
})
