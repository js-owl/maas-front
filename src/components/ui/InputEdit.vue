<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Edit } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    fontSize?: string
  }>(),
  {
    placeholder: '',
    fontSize: '20px',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isEditing = ref(false)
const editedValue = ref(props.modelValue)

const startEdit = () => {
  isEditing.value = true
  editedValue.value = props.modelValue
}

const save = () => {
  const trimmedValue = editedValue.value.trim()

  if (!trimmedValue) {
    editedValue.value = props.modelValue
    isEditing.value = false
    return
  }

  emit('update:modelValue', trimmedValue)
  isEditing.value = false
}

const cancel = () => {
  editedValue.value = props.modelValue
  isEditing.value = false
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!isEditing.value) {
      editedValue.value = newValue
    }
  }
)
</script>

<template>
  <div v-if="!isEditing" class="input-edit-view">
    <span class="input-edit-value" :style="{ fontSize: props.fontSize }">{{ modelValue || placeholder || 'Загрузка...' }}</span>
    <el-button
      text
      type="primary"
      :icon="Edit"
      class="input-edit-btn"
      @click="startEdit"
    />
  </div>
  <div v-else class="input-edit-edit">
    <el-input
      v-model="editedValue"
      class="input-edit-input"
      @keyup.enter="save"
      @keyup.esc="cancel"
    />
    <el-button text type="primary" size="small" @click="save"> ✓ </el-button>
    <el-button text type="danger" size="small" @click="cancel"> ✕ </el-button>
  </div>
</template>

<style scoped>
.input-edit-view {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-edit-value {
  font-weight: 500;
}

.input-edit-btn {
  padding: 4px;
  min-height: auto;
  color: #606266;
}

.input-edit-btn:hover {
  color: #409eff;
}

.input-edit-edit {
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-edit-input {
  flex: 1;
}
</style>
