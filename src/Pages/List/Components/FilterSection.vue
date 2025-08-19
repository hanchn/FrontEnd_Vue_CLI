<template>
  <div class="filter-section">
    <a-card title="筛选条件" :bordered="false">
      <a-form layout="inline" :model="localFilters">
        <a-form-item label="关键词">
          <a-input
            v-model:value="localFilters.keyword"
            placeholder="请输入关键词"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        
        <a-form-item label="状态">
          <a-select
            v-model:value="localFilters.status"
            placeholder="请选择状态"
            style="width: 120px"
            allowClear
          >
            <a-select-option value="active">启用</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
            <a-select-option value="pending">待审核</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="分类">
          <a-select
            v-model:value="localFilters.category"
            placeholder="请选择分类"
            style="width: 150px"
            allowClear
          >
            <a-select-option value="type1">类型一</a-select-option>
            <a-select-option value="type2">类型二</a-select-option>
            <a-select-option value="type3">类型三</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="日期范围">
          <a-range-picker
            v-model:value="localFilters.dateRange"
            style="width: 240px"
          />
        </a-form-item>
        
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['filter-change', 'reset'])

// 本地筛选状态
const localFilters = reactive({ ...props.filters })

// 监听外部筛选条件变化
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

// 搜索处理
const handleSearch = () => {
  emit('filter-change', { ...localFilters })
}

// 重置处理
const handleReset = () => {
  Object.assign(localFilters, {
    keyword: '',
    status: '',
    category: '',
    dateRange: []
  })
  emit('reset')
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 16px;
}

.filter-section :deep(.ant-card-body) {
  padding: 16px 24px;
}

.filter-section :deep(.ant-form-item) {
  margin-bottom: 8px;
}
</style>