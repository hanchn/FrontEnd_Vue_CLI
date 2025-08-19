<template>
  <div class="breadcrumb-nav">
    <a-card :bordered="false" size="small">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(item, index) in items" :key="index">
          <router-link v-if="item.path && index < items.length - 1" :to="item.path">
            <HomeOutlined v-if="index === 0" />
            {{ item.title }}
          </router-link>
          <span v-else>
            {{ item.title }}
          </span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-card>
  </div>
</template>

<script setup>
import { HomeOutlined } from '@ant-design/icons-vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.breadcrumb-nav :deep(.ant-card-body) {
  padding: 12px 24px;
}

.breadcrumb-nav :deep(.ant-breadcrumb) {
  font-size: 14px;
}

.breadcrumb-nav :deep(.ant-breadcrumb-link) {
  color: #1890ff;
}
</style>