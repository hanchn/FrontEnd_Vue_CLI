<template>
  <div class="form-content">
    <a-form
      ref="formRef"
      :model="localFormData"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <!-- 基本信息 -->
      <a-divider orientation="left">基本信息</a-divider>
      
      <a-form-item label="名称" name="name" required>
        <a-input
          v-model:value="localFormData.name"
          placeholder="请输入名称"
          :disabled="mode === 'view'"
          show-count
          :maxlength="50"
        />
      </a-form-item>
      
      <a-form-item label="邮箱" name="email" required>
        <a-input
          v-model:value="localFormData.email"
          placeholder="请输入邮箱地址"
          :disabled="mode === 'view'"
        />
      </a-form-item>
      
      <a-form-item label="手机号" name="phone">
        <a-input
          v-model:value="localFormData.phone"
          placeholder="请输入手机号"
          :disabled="mode === 'view'"
        />
      </a-form-item>
      
      <a-form-item label="分类" name="category" required>
        <a-select
          v-model:value="localFormData.category"
          placeholder="请选择分类"
          :disabled="mode === 'view'"
        >
          <a-select-option value="type1">类型一</a-select-option>
          <a-select-option value="type2">类型二</a-select-option>
          <a-select-option value="type3">类型三</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="状态" name="status" required>
        <a-radio-group
          v-model:value="localFormData.status"
          :disabled="mode === 'view'"
        >
          <a-radio value="active">启用</a-radio>
          <a-radio value="inactive">禁用</a-radio>
          <a-radio value="pending">待审核</a-radio>
        </a-radio-group>
      </a-form-item>
      
      <!-- 详细信息 -->
      <a-divider orientation="left">详细信息</a-divider>
      
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="localFormData.description"
          placeholder="请输入描述信息"
          :disabled="mode === 'view'"
          :rows="4"
          show-count
          :maxlength="200"
        />
      </a-form-item>
      
      <a-form-item label="标签" name="tags">
        <TagSelector
          v-model:value="localFormData.tags"
          :disabled="mode === 'view'"
        />
      </a-form-item>
      
      <a-form-item label="日期范围">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item name="startDate" :wrapper-col="{ span: 24 }">
              <a-date-picker
                v-model:value="localFormData.startDate"
                placeholder="开始日期"
                :disabled="mode === 'view'"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="endDate" :wrapper-col="{ span: 24 }">
              <a-date-picker
                v-model:value="localFormData.endDate"
                placeholder="结束日期"
                :disabled="mode === 'view'"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
      
      <a-form-item label="优先级" name="priority">
        <a-select
          v-model:value="localFormData.priority"
          placeholder="请选择优先级"
          :disabled="mode === 'view'"
        >
          <a-select-option value="low">低</a-select-option>
          <a-select-option value="medium">中</a-select-option>
          <a-select-option value="high">高</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="公开" name="isPublic">
        <a-switch
          v-model:checked="localFormData.isPublic"
          :disabled="mode === 'view'"
          checked-children="是"
          un-checked-children="否"
        />
      </a-form-item>
      
      <!-- 操作按钮 -->
      <a-form-item :wrapper-col="{ offset: 4, span: 16 }" v-if="mode !== 'view'">
        <a-space size="large">
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            size="large"
          >
            <template #icon><SaveOutlined /></template>
            {{ mode === 'create' ? '创建' : '更新' }}
          </a-button>
          
          <a-button
            @click="handleReset"
            :disabled="loading"
            size="large"
          >
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          
          <a-button
            @click="handleCancel"
            :disabled="loading"
            size="large"
          >
            <template #icon><CloseOutlined /></template>
            取消
          </a-button>
        </a-space>
      </a-form-item>
      
      <!-- 查看模式的返回按钮 -->
      <a-form-item :wrapper-col="{ offset: 4, span: 16 }" v-else>
        <a-button @click="handleCancel" size="large">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, inject } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  ReloadOutlined,
  CloseOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue'
import TagSelector from './TagSelector.vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'create'
  }
})

const emit = defineEmits(['submit', 'cancel', 'reset'])

// 注入表单规则
const { formRules } = inject('formState')

// 表单引用
const formRef = ref()

// 本地表单数据
const localFormData = reactive({ ...props.formData })

// 监听外部数据变化
watch(() => props.formData, (newData) => {
  Object.assign(localFormData, newData)
}, { deep: true })

// 表单提交成功
const handleFinish = (values) => {
  console.log('表单验证通过:', values)
  emit('submit', { ...localFormData })
}

// 表单提交失败
const handleFinishFailed = (errorInfo) => {
  console.log('表单验证失败:', errorInfo)
  message.error('请检查表单填写是否正确')
}

// 重置表单
const handleReset = () => {
  formRef.value.resetFields()
  emit('reset')
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.form-content {
  max-width: 800px;
}

.form-content :deep(.ant-divider-horizontal.ant-divider-with-text-left) {
  margin: 32px 0 24px 0;
}

.form-content :deep(.ant-form-item) {
  margin-bottom: 24px;
}

.form-content :deep(.ant-form-item-label) {
  font-weight: 500;
}
</style>