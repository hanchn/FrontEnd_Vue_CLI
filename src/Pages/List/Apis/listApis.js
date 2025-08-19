import { ServerApi } from '../../Utils/Request.js'

// 列表相关API
export const listApis = {
  // 获取列表数据
  async getList(params) {
    try {
      const response = await ServerApi.get('/api/list', params)
      return {
        data: response.data.list,
        total: response.data.total,
        success: true
      }
    } catch (error) {
      console.error('获取列表失败:', error)
      throw error
    }
  },

  // 创建新记录
  async createItem(data) {
    try {
      const response = await ServerApi.post('/api/list', data)
      return response.data
    } catch (error) {
      console.error('创建记录失败:', error)
      throw error
    }
  },

  // 更新记录
  async updateItem(id, data) {
    try {
      const response = await ServerApi.put(`/api/list/${id}`, data)
      return response.data
    } catch (error) {
      console.error('更新记录失败:', error)
      throw error
    }
  },

  // 删除记录
  async deleteItem(id) {
    try {
      const response = await ServerApi.delete(`/api/list/${id}`)
      return response.data
    } catch (error) {
      console.error('删除记录失败:', error)
      throw error
    }
  },

  // 批量删除
  async batchDelete(ids) {
    try {
      const response = await ServerApi.post('/api/list/batch-delete', { ids })
      return response.data
    } catch (error) {
      console.error('批量删除失败:', error)
      throw error
    }
  },

  // 导出数据
  async exportData(params) {
    try {
      const response = await ServerApi.get('/api/list/export', params, {
        responseType: 'blob'
      })
      return response
    } catch (error) {
      console.error('导出数据失败:', error)
      throw error
    }
  }
}