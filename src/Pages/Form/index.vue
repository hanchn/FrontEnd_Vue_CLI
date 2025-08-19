<template>
  <div class="form-page">
    <!-- 面包屑导航 -->
    <BreadcrumbNav :items="breadcrumbItems" />
    
    <!-- 页面内容 -->
    <div class="form-container">
      <a-card :title="pageTitle" :bordered="false">
        <FormContent 
          :form-data="formData"
          :loading="loading"
          :mode="formMode"
          @submit="handleSubmit"
          @cancel="handleCancel"
          @reset="handleReset"
        />
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import BreadcrumbNav from './Components/BreadcrumbNav.vue'
import FormContent from './Components/FormContent.vue'
import { formApis } from './Apis/formApis.js'
import { defaultFormData, formRules } from './Datas/formData.js'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const formData = reactive({ ...defaultFormData })

// 表单模式：create(新建) | edit(编辑) | view(查看)
const formMode = computed(() => {
  if (route.query.mode) return route.query.mode
  if (route.query.id) return 'edit'
  return 'create'
})

// 页面标题
const pageTitle = computed(() => {
  const titleMap = {
    create: '新建表单',
    edit: '编辑表单',
    view: '查看表单'
  }
  return titleMap[formMode.value] || '表单页面'
})

// 面包屑配置
const breadcrumbItems = computed(() => [
  { title: '首页', path: '/' },
  { title: '列表页面', path: '/list' },
  { title: pageTitle.value }
])

// 提供给子组件的状态
provide('formState', {
  formData,
  loading,
  formMode,
  formRules
})

// 初始化表单数据
const initFormData = async () => {
  // 从query参数读取初始值
  const queryParams = route.query
  
  // 如果有预设值，填充到表单
  if (queryParams.name) formData.name = queryParams.name
  if (queryParams.email) formData.email = queryParams.email
  if (queryParams.category) formData.category = queryParams.category
  if (queryParams.status) formData.status = queryParams.status
  
  // 如果是编辑模式，加载现有数据
  if (formMode.value === 'edit' && queryParams.id) {
    await loadFormData(queryParams.id)
  }
  
  console.log('表单初始化完成:', { mode: formMode.value, query: queryParams, data: formData })
}

// 加载表单数据（编辑模式）
const loadFormData = async (id) => {
  loading.value = true
  try {
    const response = await formApis.getFormData(id)
    Object.assign(formData, response.data)
    message.success('数据加载成功')
  } catch (error) {
    console.error('加载数据失败:', error)
    message.error('数据加载失败')
    
    // 使用模拟数据
    const mockData = {
      id: id,
      name: `模拟数据 ${id}`,
      email: `test${id}@example.com`,
      phone: '13800138000',
      category: 'type1',
      status: 'active',
      description: '这是一条模拟的表单数据',
      tags: ['标签1', '标签2'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      priority: 'high',
      isPublic: true
    }
    Object.assign(formData, mockData)
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async (values) => {
  loading.value = true
  try {
    let response
    if (formMode.value === 'create') {
      response = await formApis.createForm(values)
      message.success('创建成功')
    } else if (formMode.value === 'edit') {
      response = await formApis.updateForm(route.query.id, values)
      message.success('更新成功')
    }
    
    // 提交成功后返回列表页
    setTimeout(() => {
      router.push('/list')
    }, 1500)
    
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请重试')
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  // 返回上一页或列表页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/list')
  }
}

// 重置表单
const handleReset = () => {
  Object.assign(formData, defaultFormData)
  message.info('表单已重置')
}

// 页面初始化
onMounted(() => {
  initFormData()
})
</script>

<style scoped>
.form-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.form-container {
  margin-top: 16px;
}

.form-container :deep(.ant-card-body) {
  padding: 32px;
}
</style>