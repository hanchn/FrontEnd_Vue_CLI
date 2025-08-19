import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'), '')
  
  return {
    plugins: [vue()],
    
    // 环境变量目录
    envDir: 'env',
    
    // 路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/pages': path.resolve(__dirname, 'src/Pages'),
        '@/utils': path.resolve(__dirname, 'src/Utils'),
        '@/apis': path.resolve(__dirname, 'src/Server/Apis'),
        '@/assets': path.resolve(__dirname, 'src/assets')
      }
    },
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, env.VITE_API_PREFIX || '/api/v1')
        }
      }
    },
    
    // 构建配置
    build: {
      outDir: `dist/${mode}`,
      sourcemap: mode !== 'prod',
      minify: mode === 'prod' ? 'terser' : false,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      }
    },
    
    // 定义全局常量
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})
