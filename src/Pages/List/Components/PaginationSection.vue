<template>
  <div class="pagination-section">
    <a-card :bordered="false">
      <div class="pagination-wrapper">
        <div class="pagination-info">
          <span>共 {{ total }} 条记录</span>
          <span>每页显示 {{ pageSize }} 条</span>
        </div>
        
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="currentPageSize"
          :total="total"
          :show-size-changer="showSizeChanger"
          :show-quick-jumper="true"
          :show-total="showTotal"
          :page-size-options="pageSizeOptions"
          @change="handleChange"
          @showSizeChange="handleShowSizeChange"
        />
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  showSizeChanger: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['change', 'show-size-change'])

// 本地状态
const currentPage = ref(props.current)
const currentPageSize = ref(props.pageSize)
const pageSizeOptions = ['10', '20', '50', '100']

// 监听外部变化
watch(() => props.current, (newVal) => {
  currentPage.value = newVal
})

watch(() => props.pageSize, (newVal) => {
  currentPageSize.value = newVal
})

// 分页变化处理
const handleChange = (page, pageSize) => {
  emit('change', page, pageSize)
}

const handleShowSizeChange = (current, size) => {
  emit('show-size-change', current, size)
}

// 显示总数信息
const showTotal = (total, range) => {
  return `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`
}
</script>

<style scoped>
.pagination-section {
  margin-top: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.pagination-info {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .pagination-wrapper {
    flex-direction: column;
    gap: 16px;
  }
  
  .pagination-info {
    order: 2;
  }
}
</style>