// API请求工具
class ServerApi {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL
  }

  async request(url, options = {}) {
    const fullUrl = `${this.baseURL}${url}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const mergedOptions = { ...defaultOptions, ...options }

    try {
      const response = await fetch(fullUrl, mergedOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }

  get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    return this.request(fullUrl, {
      method: 'GET'
    })
  }

  post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(url, data = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(url) {
    return this.request(url, {
      method: 'DELETE'
    })
  }
}

export const serverApi = new ServerApi()

// 通用工具函数
export const utils = {
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
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
  
  // 深拷贝
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}