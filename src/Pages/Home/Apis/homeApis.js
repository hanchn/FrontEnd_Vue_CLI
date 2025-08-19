import { serverApi } from '../../../Utils/Request.js'
import { mockData } from '../Datas/homeData.js'

export function useHomeApis() {
  // 获取用户信息
  const fetchUserInfo = async (userId = 1) => {
    try {
      // 实际项目中调用真实API
      // const response = await serverApi.get(`/users/${userId}`)
      // return response.data
      
      // 开发阶段使用mock数据
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = mockData.userList.find(u => u.id === userId)
          resolve(user || mockData.userList[0])
        }, 500)
      })
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 获取数据列表
  const fetchDataList = async (params = {}) => {
    try {
      // 实际项目中调用真实API
      // const response = await serverApi.get('/products', { params })
      // return response.data
      
      // 开发阶段使用mock数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData.productList)
        }, 300)
      })
    } catch (error) {
      console.error('获取数据列表失败:', error)
      throw error
    }
  }

  // 提交数据
  const submitData = async (data) => {
    try {
      // const response = await serverApi.post('/submit', data)
      // return response.data
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: '提交成功' })
        }, 1000)
      })
    } catch (error) {
      console.error('提交数据失败:', error)
      throw error
    }
  }

  return {
    fetchUserInfo,
    fetchDataList,
    submitData
  }
}