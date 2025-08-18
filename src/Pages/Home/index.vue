<template>
  <div class="home-page">
    <a-layout>
      <a-layout-header class="header">
        <h1>首页</h1>
      </a-layout-header>
      <a-layout-content class="content">
        <!-- 使用组件 -->
        <WelcomeSection />
        <DataDisplay />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { provide, reactive } from 'vue'
import WelcomeSection from './Components/WelcomeSection.vue'
import DataDisplay from './Components/DataDisplay.vue'
import { useHomeData } from './Datas/homeData.js'
import { useHomeApis } from './Apis/homeApis.js'

// 页面状态管理
const pageState = reactive({
  loading: false,
  userInfo: null,
  dataList: []
})

// 数据和API管理
const { mockData, staticData } = useHomeData()
const { fetchUserInfo, fetchDataList } = useHomeApis()

// 通过 provide 向子组件提供状态
provide('pageState', pageState)
provide('homeData', { mockData, staticData })
provide('homeApis', { fetchUserInfo, fetchDataList })

// 页面初始化
const initPage = async () => {
  pageState.loading = true
  try {
    pageState.userInfo = await fetchUserInfo()
    pageState.dataList = await fetchDataList()
  } catch (error) {
    console.error('页面初始化失败:', error)
  } finally {
    pageState.loading = false
  }
}

// 页面加载时初始化
initPage()
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.header {
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.content {
  padding: 24px;
  background: #f0f2f5;
}
</style>
