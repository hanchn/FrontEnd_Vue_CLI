const RouteGenerator = require('./generateRoutes')

// Vite插件：自动路由生成
function autoRoutePlugin() {
  let generator
  let watcher

  return {
    name: 'auto-route-generator',
    
    buildStart() {
      // 构建开始时生成路由
      generator = new RouteGenerator()
      generator.generate()
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

module.exports = autoRoutePlugin