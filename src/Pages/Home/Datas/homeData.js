import { reactive, ref } from 'vue'

// 静态数据定义
export const staticData = {
  menuItems: [
    { id: 1, name: '首页', path: '/' },
    { id: 2, name: '关于', path: '/about' }
  ],
  constants: {
    APP_NAME: 'Vue3 + Antd 项目',
    VERSION: '1.0.0'
  }
}

// Mock数据
export const mockData = {
  userList: [
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' }
  ],
  productList: [
    { id: 1, title: '产品A', price: 299, category: '电子产品' },
    { id: 2, title: '产品B', price: 199, category: '生活用品' }
  ]
}

// 数据状态管理
export function useHomeData() {
  const dataState = reactive({
    currentUser: null,
    selectedProducts: [],
    filters: {
      category: '',
      priceRange: [0, 1000]
    }
  })

  const updateUser = (user) => {
    dataState.currentUser = user
  }

  const addProduct = (product) => {
    dataState.selectedProducts.push(product)
  }

  const updateFilters = (filters) => {
    Object.assign(dataState.filters, filters)
  }

  return {
    dataState,
    mockData,
    staticData,
    updateUser,
    addProduct,
    updateFilters
  }
}