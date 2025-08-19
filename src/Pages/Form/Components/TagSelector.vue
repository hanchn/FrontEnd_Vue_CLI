<template>
  <div class="tag-selector">
    <a-select
      v-model:value="selectedTags"
      mode="tags"
      placeholder="请选择或输入标签"
      :disabled="disabled"
      :options="tagOptions"
      @change="handleChange"
    />
    
    <div class="tag-suggestions" v-if="!disabled">
      <span class="suggestion-label">常用标签：</span>
      <a-tag
        v-for="tag in commonTags"
        :key="tag"
        :color="selectedTags.includes(tag) ? 'blue' : 'default'"
        style="cursor: pointer; margin: 4px 4px 0 0"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </a-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

// 选中的标签
const selectedTags = ref([...props.value])

// 常用标签
const commonTags = ['前端', '后端', '设计', '产品', '测试', '运维', '移动端', '全栈']

// 标签选项
const tagOptions = commonTags.map(tag => ({ label: tag, value: tag }))

// 监听外部值变化
watch(() => props.value, (newValue) => {
  selectedTags.value = [...newValue]
})

// 处理标签变化
const handleChange = (tags) => {
  selectedTags.value = tags
  emit('update:value', tags)
}

// 切换标签选择状态
const toggleTag = (tag) => {
  if (props.disabled) return
  
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  emit('update:value', [...selectedTags.value])
}
</script>

<style scoped>
.tag-selector {
  width: 100%;
}

.tag-suggestions {
  margin-top: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.suggestion-label {
  color: #666;
  font-size: 14px;
  margin-right: 8px;
}
</style>