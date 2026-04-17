<script lang="ts" setup>
import { Hide, View } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

type InputType = 'text' | 'textarea' | 'password' | 'number' | 'tel' | 'email'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    type?: InputType
    disabled?: boolean
    clearable?: boolean
    width?: string
    formatter?: (value: string) => string
    parser?: (value: string) => string
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

const isPasswordVisible = ref(false)
const isPasswordType = computed(() => props.type === 'password')
const resolvedType = computed<InputType>(() => {
  if (!isPasswordType.value)
    return props.type

  return isPasswordVisible.value ? 'text' : 'password'
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

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
      :type="resolvedType"
      :disabled="disabled"
      :clearable="clearable"
      :formatter="formatter"
      :parser="parser"
      class="input"
      @update:model-value="handleUpdateModelValue"
      @change="handleChange"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
      <template v-if="isPasswordType" #suffix>
        <button
          type="button"
          class="password-toggle"
          :aria-label="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
          @mousedown.prevent
          @click="togglePasswordVisibility"
        >
          <el-icon>
            <component :is="isPasswordVisible ? Hide : View" />
          </el-icon>
        </button>
      </template>
    </el-input>
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
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #55585B;
}

.input :deep(.el-input__inner:-webkit-autofill),
.input :deep(.el-input__inner:-webkit-autofill:hover),
.input :deep(.el-input__inner:-webkit-autofill:focus),
.input :deep(.el-input__inner:-webkit-autofill:active),
.input :deep(.el-textarea__inner:-webkit-autofill),
.input :deep(.el-textarea__inner:-webkit-autofill:hover),
.input :deep(.el-textarea__inner:-webkit-autofill:focus),
.input :deep(.el-textarea__inner:-webkit-autofill:active) {
  -webkit-text-fill-color: #55585B;
  caret-color: #55585B;
  -webkit-box-shadow: 0 0 0px 1000px #f5f7fa inset;
  box-shadow: 0 0 0px 1000px #f5f7fa inset;
  transition: background-color 999999s ease-out 0s;
}

.input :deep(.el-input__placeholder) {
  color: #606266;
}

.input :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

.password-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #909399;
  cursor: pointer;
  padding: 0;
}

.password-toggle:hover {
  color: #606266;
}

.input :deep(.is-disabled .el-input__wrapper),
.input :deep(.el-input.is-disabled .el-input__wrapper) {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

