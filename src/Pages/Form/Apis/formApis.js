import { ServerApi } from '../../Utils/Request.js'

// 表单相关API
export const formApis = {
  // 获取表单数据
  async getFormData(id) {
    try {
      const response = await ServerApi.get(`/api/form/${id}`)
      return {
        data: response.data,
        success: true
      }
    } catch (error) {
      console.error('获取表单数据失败:', error)
      throw error
    }
  },

  // 创建表单
  async createForm(data) {
    try {
      const response = await ServerApi.post('/api/form', data)
      return {
        data: response.data,
        success: true
      }
    } catch (error) {
      console.error('创建表单失败:', error)
      throw error
    }
  },

  // 更新表单
  async updateForm(id, data) {
    try {
      const response = await ServerApi.put(`/api/form/${id}`, data)
      return {
        data: response.data,
        success: true
      }
    } catch (error) {
      console.error('更新表单失败:', error)
      throw error
    }
  },

  // 删除表单
  async deleteForm(id) {
    try {
      const response = await ServerApi.delete(`/api/form/${id}`)
      return {
        data: response.data,
        success: true
      }
    } catch (error) {
      console.error('删除表单失败:', error)
      throw error
    }
  },

  // 验证表单数据
  async validateForm(data) {
    try {
      const response = await ServerApi.post('/api/form/validate', data)
      return {
        data: response.data,
        success: true
      }
    } catch (error) {
      console.error('验证表单失败:', error)
      throw error
    }
  },

  // 保存草稿
  async saveDraft(data) {
    try {
      const response = await ServerApi.post('/api/form/draft', data)
      return {
        data: response.data,
        success: true
      }
    } catch (error) {
      console.error('保存草稿失败:', error)
      throw error
    }
  }
}