const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

class RouteGenerator {
  constructor() {
    this.pagesDir = path.resolve(__dirname, '../src/Pages')
    this.routerFile = path.resolve(__dirname, '../src/Router/index.js')
    this.routes = []
  }

  // 扫描Pages目录生成路由
  scanPages() {
    this.routes = []
    
    if (!fs.existsSync(this.pagesDir)) {
      console.log('Pages目录不存在')
      return
    }

    const pageDirectories = fs.readdirSync(this.pagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    pageDirectories.forEach(pageName => {
      const pagePath = path.join(this.pagesDir, pageName)
      const indexFile = path.join(pagePath, 'index.vue')
      
      if (fs.existsSync(indexFile)) {
        const route = this.generateRoute(pageName)
        this.routes.push(route)
        console.log(`✅ 发现页面: ${pageName}`)
      }
    })

    console.log(`📄 共发现 ${this.routes.length} 个页面`)
  }

  // 生成单个路由配置
  generateRoute(pageName) {
    const routePath = pageName === 'Home' ? '/' : `/${pageName.toLowerCase()}`
    const componentPath = `../Pages/${pageName}/index.vue`
    
    return {
      path: routePath,
      name: pageName,
      component: componentPath,
      meta: {
        title: this.getPageTitle(pageName)
      }
    }
  }

  // 获取页面标题
  getPageTitle(pageName) {
    const titleMap = {
      'Home': '首页',
      'About': '关于我们',
      'Contact': '联系我们',
      'User': '用户中心',
      'Product': '产品中心',
      'News': '新闻资讯'
    }
    return titleMap[pageName] || pageName
  }

  // 生成路由文件内容
  generateRouterContent() {
    const imports = this.routes.map(route => 
      `const ${route.name} = () => import('${route.component}')`
    ).join('\n')

    const routeConfigs = this.routes.map(route => `  {
    path: '${route.path}',
    name: '${route.name}',
    component: ${route.name},
    meta: {
      title: '${route.meta.title}'
    }
  }`).join(',\n')

    return `// 🤖 此文件由脚本自动生成，请勿手动修改
// 生成时间: ${new Date().toLocaleString()}

import { createRouter, createWebHistory } from 'vue-router'

// 动态导入页面组件
${imports}

// 路由配置
const routes = [
${routeConfigs}
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
`
  }

  // 写入路由文件
  writeRouterFile() {
    const content = this.generateRouterContent()
    
    // 确保Router目录存在
    const routerDir = path.dirname(this.routerFile)
    if (!fs.existsSync(routerDir)) {
      fs.mkdirSync(routerDir, { recursive: true })
    }

    fs.writeFileSync(this.routerFile, content, 'utf8')
    console.log(`📝 路由文件已更新: ${this.routerFile}`)
  }

  // 生成路由
  generate() {
    console.log('🚀 开始生成路由...')
    this.scanPages()
    this.writeRouterFile()
    console.log('✅ 路由生成完成!')
  }

  // 监控文件变化
  watch() {
    console.log('👀 开始监控Pages目录变化...')
    
    const watcher = chokidar.watch(this.pagesDir, {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: true
    })

    // 防抖处理
    let timeout
    const debouncedGenerate = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        console.log('📁 检测到文件变化，重新生成路由...')
        this.generate()
      }, 500)
    }

    watcher
      .on('add', (filePath) => {
        if (filePath.endsWith('index.vue')) {
          console.log(`➕ 新增页面: ${filePath}`)
          debouncedGenerate()
        }
      })
      .on('unlink', (filePath) => {
        if (filePath.endsWith('index.vue')) {
          console.log(`➖ 删除页面: ${filePath}`)
          debouncedGenerate()
        }
      })
      .on('addDir', (dirPath) => {
        if (dirPath.includes('/Pages/')) {
          console.log(`📁 新增目录: ${dirPath}`)
          debouncedGenerate()
        }
      })
      .on('unlinkDir', (dirPath) => {
        if (dirPath.includes('/Pages/')) {
          console.log(`🗑️ 删除目录: ${dirPath}`)
          debouncedGenerate()
        }
      })

    // 初始生成
    this.generate()

    return watcher
  }
}

// 命令行参数处理
const args = process.argv.slice(2)
const generator = new RouteGenerator()

if (args.includes('--watch') || args.includes('-w')) {
  // 监控模式
  generator.watch()
} else {
  // 单次生成
  generator.generate()
}

module.exports = RouteGenerator