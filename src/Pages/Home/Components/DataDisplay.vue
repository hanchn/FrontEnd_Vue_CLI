<template>
  <div class="data-display">
    <a-card title="数据展示" :bordered="false">
      <a-row :gutter="[16, 16]">
        <a-col :span="6" v-for="item in dataItems" :key="item.key">
          <a-statistic
            :title="item.title"
            :value="item.value"
            :suffix="item.suffix"
            :prefix="item.prefix"
            :value-style="{ color: item.color }"
          />
        </a-col>
      </a-row>
      
      <a-divider />
      
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="{ pageSize: 5 }"
        size="small"
      />
    </a-card>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'

// 注入父组件提供的状态
const pageState = inject('pageState', {})
const homeApis = inject('homeApis', {})

// 统计数据
const dataItems = ref([
  {
    key: 'users',
    title: '用户总数',
    value: 1234,
    suffix: '人',
    color: '#3f8600'
  },
  {
    key: 'orders',
    title: '订单数量',
    value: 567,
    suffix: '单',
    color: '#cf1322'
  },
  {
    key: 'revenue',
    title: '总收入',
    value: 89012,
    prefix: '¥',
    color: '#1890ff'
  },
  {
    key: 'growth',
    title: '增长率',
    value: 12.5,
    suffix: '%',
    color: '#722ed1'
  }
])

// 表格列定义
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => {
      const statusMap = {
        active: { color: 'green', text: '活跃' },
        inactive: { color: 'red', text: '非活跃' },
        pending: { color: 'orange', text: '待处理' }
      }
      const status = statusMap[text] || { color: 'gray', text: '未知' }
      return `<span style="color: ${status.color}">${status.text}</span>`
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }
]

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '数据项目 A',
    status: 'active',
    createTime: '2024-01-15'
  },
  {
    id: 2,
    name: '数据项目 B',
    status: 'pending',
    createTime: '2024-01-14'
  },
  {
    id: 3,
    name: '数据项目 C',
    status: 'inactive',
    createTime: '2024-01-13'
  },
  {
    id: 4,
    name: '数据项目 D',
    status: 'active',
    createTime: '2024-01-12'
  },
  {
    id: 5,
    name: '数据项目 E',
    status: 'pending',
    createTime: '2024-01-11'
  }
])

// 组件挂载时加载数据
onMounted(() => {
  // 可以在这里调用API加载真实数据
  console.log('DataDisplay 组件已挂载')
})
</script>

<style scoped>
.data-display {
  margin-top: 16px;
}

.ant-statistic {
  text-align: center;
}

.ant-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>