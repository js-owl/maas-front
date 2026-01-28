<script lang="ts" setup>
type InputType = 'text' | 'textarea' | 'password' | 'number' | 'tel' | 'email'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    type?: InputType
    disabled?: boolean
    clearable?: boolean
    width?: string
  }>(),
  {
    modelValue: '',
    placeholder: '',
    type: 'text',
    disabled: false,
    clearable: false,
    width: '100%',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'change', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const handleUpdateModelValue = (value: string) => {
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (value: string) => {
  emit('change', value)
}
</script>

<template>
  <div class="input-wrapper" :style="{ width: props.width }">
    <el-input
      :model-value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :clearable="clearable"
      class="input"
      @update:model-value="handleUpdateModelValue"
      @change="handleChange"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />
  </div>
</template>

<style scoped>
.input-wrapper {
  width: 100%;
}

.input :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: none;
  border: none;
  padding: 12px 16px;
}

.input :deep(.el-input__inner) {
  font-family: 'Segoe UI';
  font-size: 20px;
  font-weight: 500;
  color: #000;
}

.input :deep(.el-input__placeholder) {
  color: #606266;
}

.input :deep(.is-disabled .el-input__wrapper),
.input :deep(.el-input.is-disabled .el-input__wrapper) {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

