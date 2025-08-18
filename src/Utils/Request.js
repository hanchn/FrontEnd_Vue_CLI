// 检测Fetch支持
const supportsFetch = typeof fetch !== 'undefined'

// Request配置类
class RequestConfig {
  constructor() {
    this.baseURL = '/api'
    this.timeout = 10000
    this.headers = {
      'Content-Type': 'application/json'
    }
    this.interceptors = {
      request: [],
      response: []
    }
  }

  // 设置基础URL
  setBaseURL(url) {
    this.baseURL = url
    return this
  }

  // 设置超时时间
  setTimeout(time) {
    this.timeout = time
    return this
  }

  // 设置默认头部
  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers }
    return this
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
    return this
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
    return this
  }
}

// 主要Request类
class Request {
  constructor(config = new RequestConfig()) {
    this.config = config
  }

  // 应用请求拦截器
  async applyRequestInterceptors(options) {
    let result = options
    for (const interceptor of this.config.interceptors.request) {
      result = await interceptor(result)
    }
    return result
  }

  // 应用响应拦截器
  async applyResponseInterceptors(response) {
    let result = response
    for (const interceptor of this.config.interceptors.response) {
      result = await interceptor(result)
    }
    return result
  }

  // 构建完整URL
  buildURL(url, params = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`
    
    if (Object.keys(params).length === 0) {
      return fullUrl
    }

    const queryString = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryString.append(key, value)
      }
    })

    const separator = fullUrl.includes('?') ? '&' : '?'
    return `${fullUrl}${separator}${queryString.toString()}`
  }

  // Fetch请求实现
  async fetchRequest(url, options = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const mergedOptions = {
        signal: controller.signal,
        headers: { ...this.config.headers, ...options.headers },
        ...options
      }

      // 应用请求拦截器
      const interceptedOptions = await this.applyRequestInterceptors(mergedOptions)

      const response = await fetch(url, interceptedOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // 根据响应类型处理数据
      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else if (contentType?.includes('text/')) {
        data = await response.text()
      } else {
        data = await response.blob()
      }

      const result = { data, status: response.status, headers: response.headers }
      return await this.applyResponseInterceptors(result)

    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    }
  }

  // Ajax请求实现（降级方案）
  ajaxRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const { method = 'GET', headers = {}, body } = options

      xhr.open(method, url, true)
      xhr.timeout = this.config.timeout

      // 设置请求头
      Object.entries({ ...this.config.headers, ...headers }).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let data
          try {
            data = JSON.parse(xhr.responseText)
          } catch {
            data = xhr.responseText
          }
          
          const result = {
            data,
            status: xhr.status,
            headers: xhr.getAllResponseHeaders()
          }
          
          try {
            const interceptedResult = await this.applyResponseInterceptors(result)
            resolve(interceptedResult)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      }

      xhr.onerror = () => reject(new Error('网络错误'))
      xhr.ontimeout = () => reject(new Error('请求超时'))

      xhr.send(body)
    })
  }

  // 统一请求方法
  async request(url, options = {}) {
    try {
      if (supportsFetch) {
        return await this.fetchRequest(url, options)
      } else {
        return await this.ajaxRequest(url, options)
      }
    } catch (error) {
      console.error('请求失败:', error)
      throw error
    }
  }

  // GET请求
  async get(url, params = {}, options = {}) {
    const fullUrl = this.buildURL(url, params)
    return this.request(fullUrl, {
      method: 'GET',
      ...options
    })
  }

  // POST请求
  async post(url, data = {}, options = {}) {
    const fullUrl = this.buildURL(url)
    return this.request(fullUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    })
  }

  // PUT请求
  async put(url, data = {}, options = {}) {
    const fullUrl = this.buildURL(url)
    return this.request(fullUrl, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    })
  }

  // DELETE请求
  async delete(url, options = {}) {
    const fullUrl = this.buildURL(url)
    return this.request(fullUrl, {
      method: 'DELETE',
      ...options
    })
  }

  // 文件上传
  async upload(url, file, params = {}, options = {}) {
    const formData = new FormData()
    
    // 添加文件
    if (file instanceof File) {
      formData.append('file', file)
    } else if (file instanceof FileList) {
      Array.from(file).forEach((f, index) => {
        formData.append(`file${index}`, f)
      })
    }

    // 添加其他参数
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const fullUrl = this.buildURL(url)
    return this.request(fullUrl, {
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置boundary
      },
      ...options
    })
  }

  // 文件下载
  async download(url, filename, params = {}, options = {}) {
    const fullUrl = this.buildURL(url, params)
    
    try {
      const response = await this.request(fullUrl, {
        ...options,
        headers: {
          ...options.headers
        }
      })

      // 创建下载链接
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理URL对象
      window.URL.revokeObjectURL(downloadUrl)
      
      return response
    } catch (error) {
      console.error('文件下载失败:', error)
      throw error
    }
  }

  // 批量请求
  async all(requests) {
    try {
      return await Promise.all(requests)
    } catch (error) {
      console.error('批量请求失败:', error)
      throw error
    }
  }

  // 竞速请求（返回最快的响应）
  async race(requests) {
    try {
      return await Promise.race(requests)
    } catch (error) {
      console.error('竞速请求失败:', error)
      throw error
    }
  }
}

// 工具函数
export const utils = {
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },
  
  // 防抖函数
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
  
  // 节流函数
  throttle(func, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },
  
  // 深拷贝
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => this.deepClone(item))
    if (typeof obj === 'object') {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key])
        }
      }
      return clonedObj
    }
  },

  // 文件大小格式化
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 验证文件类型
  validateFileType(file, allowedTypes) {
    const fileType = file.type
    const fileName = file.name
    const fileExtension = fileName.split('.').pop().toLowerCase()
    
    return allowedTypes.some(type => {
      if (type.includes('/')) {
        return fileType === type
      } else {
        return fileExtension === type.toLowerCase()
      }
    })
  }
}

// 创建默认实例
const config = new RequestConfig()

// 添加默认拦截器
config.addRequestInterceptor(async (options) => {
  // 添加认证token
  const token = localStorage.getItem('token')
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  }
  return options
})

config.addResponseInterceptor(async (response) => {
  // 统一处理响应
  if (response.status === 401) {
    // 清除token并跳转登录
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('未授权，请重新登录')
  }
  return response
})

// 导出实例
export const request = new Request(config)
export { Request, RequestConfig }

// 兼容旧版本
export const serverApi = {
  get: (url, params) => request.get(url, params),
  post: (url, data) => request.post(url, data),
  put: (url, data) => request.put(url, data),
  delete: (url) => request.delete(url),
  upload: (url, file, params) => request.upload(url, file, params),
  download: (url, filename, params) => request.download(url, filename, params)
}