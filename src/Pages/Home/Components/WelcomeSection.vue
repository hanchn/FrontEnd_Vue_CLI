<template>
  <a-card title="欢迎" class="welcome-section">
    <div v-if="pageState.loading">
      <a-spin size="large" />
    </div>
    <div v-else>
      <h2>欢迎, {{ pageState.userInfo?.name || '用户' }}!</h2>
      <p>{{ homeData.staticData.constants.APP_NAME }} - {{ homeData.staticData.constants.VERSION }}</p>
      <a-button type="primary" @click="refreshData">
        刷新数据
      </a-button>
    </div>
  </a-card>
</template>

<script setup>
import { inject } from 'vue'

// 注入父组件提供的状态和方法
const pageState = inject('pageState')
const homeData = inject('homeData')
const homeApis = inject('homeApis')

const refreshData = async () => {
  pageState.loading = true
  try {
    pageState.userInfo = await homeApis.fetchUserInfo()
  } finally {
    pageState.loading = false
  }
}
</script>

<style scoped>
.welcome-section {
  margin-bottom: 24px;
}
</style>