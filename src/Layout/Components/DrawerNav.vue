<template>
  <a-drawer
    v-model:open="visible"
    title="路由导航"
    placement="left"
    :width="280"
    :closable="true"
    :mask="false"
    :get-container="false"
    class="route-drawer"
  >
    <div class="nav-content">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </div>
    
    <template #extra>
      <a-button 
        type="text" 
        size="small"
        @click="toggleDrawer"
      >
        <template #icon>
          <MenuFoldOutlined v-if="visible" />
          <MenuUnfoldOutlined v-else />
        </template>
      </a-button>
    </template>
  </a-drawer>
  
  <!-- 悬浮按钮，当抽屉关闭时显示 -->
  <a-float-button
    v-if="!visible"
    type="primary"
    :style="{ left: '24px', bottom: '24px' }"
    @click="toggleDrawer"
  >
    <template #icon>
      <MenuUnfoldOutlined />
    </template>
  </a-float-button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  FormOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 抽屉显示状态
const visible = ref(true)

// 当前选中的菜单项
const selectedKeys = ref([route.name])

// 菜单项配置
const menuItems = computed(() => {
  const routes = router.getRoutes()
  return routes
    .filter(route => route.name && route.path !== '/:pathMatch(.*)*') // 过滤掉404路由
    .map(route => {
      const icons = {
        'Home': HomeOutlined,
        'List': UnorderedListOutlined,
        'Form': FormOutlined
      }
      
      return {
        key: route.name,
        label: route.meta?.title || route.name,
        icon: icons[route.name] || HomeOutlined,
        path: route.path
      }
    })
})

// 切换抽屉显示状态
const toggleDrawer = () => {
  visible.value = !visible.value
}

// 处理菜单点击
const handleMenuClick = ({ key, item }) => {
  const targetRoute = menuItems.value.find(menu => menu.key === key)
  if (targetRoute && targetRoute.path !== route.path) {
    router.push(targetRoute.path)
  }
}

// 监听路由变化，更新选中状态
watch(
  () => route.name,
  (newName) => {
    selectedKeys.value = [newName]
  },
  { immediate: true }
)
</script>

<style scoped>
.route-drawer {
  position: fixed;
  z-index: 1000;
}

.nav-content {
  height: 100%;
  padding: 16px 0;
}

:deep(.ant-drawer-body) {
  padding: 0;
}

:deep(.ant-menu) {
  border-right: none;
}

:deep(.ant-menu-item) {
  margin: 4px 8px;
  border-radius: 6px;
}

:deep(.ant-menu-item:hover) {
  background-color: #f0f0f0;
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>