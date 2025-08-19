import RouteGenerator from './generateRoutes.js'

// Vite插件：自动路由生成
function autoRoutePlugin() {
  let generator

  return {
    name: 'auto-route-generator',
    
    buildStart() {
      // 构建开始时生成路由
      try {
        generator = new RouteGenerator()
        generator.generate()
        console.log('✅ 路由文件已生成')
      } catch (error) {
        console.error('❌ 路由生成失败:', error)
      }
    },
    
    configureServer(server) {
      // 开发模式下启动文件监控
      if (!watcher) {
        generator = new RouteGenerator()
        watcher = generator.watch()
        
        // 当路由文件更新时，通知浏览器刷新
        watcher.on('change', () => {
          server.ws.send({
            type: 'full-reload'
          })
        })
      }
    },
    
    buildEnd() {
      // 构建结束时关闭监控
      if (watcher) {
        watcher.close()
        watcher = null
      }
    }
  }
}

export default autoRoutePlugin