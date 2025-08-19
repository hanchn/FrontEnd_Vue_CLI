// 环境变量工具类
export class EnvUtils {
  // 获取当前环境
  static getEnv() {
    return import.meta.env.VITE_APP_ENV || 'test'
  }

  // 判断是否为开发环境
  static isDev() {
    return this.getEnv() === 'dev'
  }

  // 判断是否为测试环境
  static isTest() {
    return this.getEnv() === 'test'
  }

  // 判断是否为预发布环境
  static isPre() {
    return this.getEnv() === 'pre'
  }

  // 判断是否为生产环境
  static isProd() {
    return this.getEnv() === 'prod'
  }

  // 获取API基础URL
  static getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || 'https://test-api.example.com'
  }

  // 获取API前缀
  static getApiPrefix() {
    return import.meta.env.VITE_API_PREFIX || '/api/v1'
  }

  // 获取完整API URL
  static getApiUrl(path = '') {
    const baseUrl = this.getApiBaseUrl()
    const prefix = this.getApiPrefix()
    return `${baseUrl}${prefix}${path}`
  }

  // 获取超时时间
  static getTimeout() {
    return parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000
  }

  // 是否启用Mock
  static isMockEnabled() {
    return import.meta.env.VITE_ENABLE_MOCK === 'true'
  }

  // 是否启用调试
  static isDebugEnabled() {
    return import.meta.env.VITE_ENABLE_DEBUG === 'true'
  }

  // 是否启用控制台
  static isConsoleEnabled() {
    return import.meta.env.VITE_ENABLE_CONSOLE === 'true'
  }

  // 是否启用VConsole
  static isVConsoleEnabled() {
    return import.meta.env.VITE_ENABLE_VCONSOLE === 'true'
  }

  // 获取OSS配置
  static getOssConfig() {
    return {
      bucket: import.meta.env.VITE_OSS_BUCKET,
      cdnUrl: import.meta.env.VITE_CDN_URL,
      uploadUrl: import.meta.env.VITE_UPLOAD_URL
    }
  }

  // 获取监控配置
  static getMonitorConfig() {
    return {
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      analyticsId: import.meta.env.VITE_ANALYTICS_ID
    }
  }

  // 获取应用信息
  static getAppInfo() {
    return {
      title: import.meta.env.VITE_APP_TITLE || 'Vue3项目',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      buildTime: import.meta.env.VITE_BUILD_TIME,
      gitHash: import.meta.env.VITE_GIT_HASH,
      env: this.getEnv()
    }
  }

  // 打印环境信息
  static printEnvInfo() {
    if (!this.isConsoleEnabled()) return
    
    const info = this.getAppInfo()
    console.group('🌍 环境信息')
    console.log('环境:', info.env)
    console.log('标题:', info.title)
    console.log('版本:', info.version)
    console.log('API地址:', this.getApiBaseUrl())
    console.log('Mock状态:', this.isMockEnabled() ? '启用' : '禁用')
    console.log('调试模式:', this.isDebugEnabled() ? '启用' : '禁用')
    if (info.buildTime) console.log('构建时间:', info.buildTime)
    if (info.gitHash) console.log('Git Hash:', info.gitHash)
    console.groupEnd()
  }
}

// 导出环境变量对象
export const env = {
  // 基础信息
  NODE_ENV: import.meta.env.NODE_ENV,
  APP_ENV: import.meta.env.VITE_APP_ENV,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  
  // API配置
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
  API_PREFIX: import.meta.env.VITE_API_PREFIX,
  
  // 功能开关
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_CONSOLE: import.meta.env.VITE_ENABLE_CONSOLE === 'true',
  ENABLE_VCONSOLE: import.meta.env.VITE_ENABLE_VCONSOLE === 'true',
  
  // 第三方服务
  OSS_BUCKET: import.meta.env.VITE_OSS_BUCKET,
  CDN_URL: import.meta.env.VITE_CDN_URL,
  UPLOAD_URL: import.meta.env.VITE_UPLOAD_URL,
  
  // 监控配置
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  
  // 其他配置
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
  BUILD_TIME: import.meta.env.VITE_BUILD_TIME,
  GIT_HASH: import.meta.env.VITE_GIT_HASH
}

// 默认导出
export default EnvUtils