<template>
  <div class="app-layout">
    <!-- 路由导航抽屉 -->
    <DrawerNav v-if="showRouteNav" />
    
    <!-- 主要内容区域 -->
    <div class="main-content" :class="{ 'with-nav': showRouteNav }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DrawerNav from './Components/DrawerNav.vue'
import { EnvUtils } from '../Utils/Env.js'

// 检查是否启用路由导航
const showRouteNav = computed(() => {
  return EnvUtils.get('VITE_ENABLE_ROUTE_NAV') === 'true'
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  position: relative;
}

.main-content {
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content.with-nav {
  margin-left: 0; /* 抽屉是悬浮的，不需要预留空间 */
}
</style>
