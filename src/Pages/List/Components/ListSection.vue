<template>
  <div class="list-section">
    <a-card :bordered="false">
      <template #title>
        <div class="list-header">
          <span>数据列表</span>
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增
            </a-button>
            <a-button @click="handleRefresh">
              <template #icon><ReloadOutlined /></template>
              刷新
            </a-button>
          </a-space>
        </div>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1200 }"
        row-key="id"
        @change="handleTableChange"
      >
        <!-- 状态列自定义渲染 -->
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        
        <!-- 操作列 -->
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleView(record)">
              查看
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除这条记录吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" size="small" danger>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['sort-change', 'refresh'])

// 表格变化处理
const handleTableChange = (pagination, filters, sorter) => {
  emit('sort-change', sorter)
}

// 状态相关方法
const getStatusColor = (status) => {
  const colorMap = {
    active: 'green',
    inactive: 'red',
    pending: 'orange'
  }
  return colorMap[status] || 'default'
}

const getStatusText = (status) => {
  const textMap = {
    active: '启用',
    inactive: '禁用',
    pending: '待审核'
  }
  return textMap[status] || status
}

// 操作方法
const handleAdd = () => {
  message.info('新增功能')
}

const handleRefresh = () => {
  emit('refresh')
}

const handleView = (record) => {
  message.info(`查看记录: ${record.name}`)
}

const handleEdit = (record) => {
  message.info(`编辑记录: ${record.name}`)
}

const handleDelete = (record) => {
  message.success(`删除记录: ${record.name}`)
}
</script>

<style scoped>
.list-section {
  margin-bottom: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.list-section :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
}
</style>