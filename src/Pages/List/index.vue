<template>
  <div class="list-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>数据列表</h2>
      <p>包含筛选、列表展示和分页功能的模板页面</p>
    </div>

    <!-- 筛选区域 -->
    <FilterSection 
      :filters="filters"
      @filter-change="handleFilterChange"
      @reset="handleFilterReset"
    />

    <!-- 列表区域 -->
    <ListSection 
      :data="listData"
      :loading="loading"
      :columns="tableColumns"
      @sort-change="handleSortChange"
    />

    <!-- 分页区域 -->
    <PaginationSection 
      :current="pagination.current"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :show-size-changer="true"
      @change="handlePageChange"
      @show-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, inject } from 'vue'
import { message } from 'ant-design-vue'
import FilterSection from './Components/FilterSection.vue'
import ListSection from './Components/ListSection.vue'
import PaginationSection from './Components/PaginationSection.vue'
import { listApis } from './Apis/listApis.js'
import { mockListData, filterOptions, tableColumns } from './Datas/listData.js'

// 响应式数据
const loading = ref(false)
const listData = ref([])
const filters = reactive({
  keyword: '',
  status: '',
  category: '',
  dateRange: []
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 提供给子组件的状态管理
provide('listState', {
  loading,
  listData,
  filters,
  pagination
})

// 筛选处理
const handleFilterChange = (newFilters) => {
  Object.assign(filters, newFilters)
  pagination.current = 1 // 重置到第一页
  fetchData()
}

const handleFilterReset = () => {
  Object.assign(filters, {
    keyword: '',
    status: '',
    category: '',
    dateRange: []
  })
  pagination.current = 1
  fetchData()
}

// 排序处理
const handleSortChange = (sortInfo) => {
  console.log('排序变化:', sortInfo)
  // 这里可以添加排序逻辑
  fetchData()
}

// 分页处理
const handlePageChange = (page, pageSize) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchData()
}

const handlePageSizeChange = (current, size) => {
  pagination.current = 1
  pagination.pageSize = size
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      ...filters,
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    
    // 使用真实API或模拟数据
    const response = await listApis.getList(params)
    
    listData.value = response.data
    pagination.total = response.total
    
    message.success('数据加载成功')
  } catch (error) {
    console.error('获取数据失败:', error)
    message.error('数据加载失败')
    
    // 降级使用模拟数据
    const mockResponse = mockListData.getFilteredData(filters, pagination)
    listData.value = mockResponse.data
    pagination.total = mockResponse.total
  } finally {
    loading.value = false
  }
}

// 页面初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.list-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #1890ff;
}

.page-header p {
  margin: 0;
  color: #666;
}
</style>