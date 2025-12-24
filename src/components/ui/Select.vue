<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean | object
    placeholder?: string
    size?: 'large' | 'default' | 'small'
    disabled?: boolean
    clearable?: boolean
    filterable?: boolean
    multiple?: boolean
    width?: string
  }>(),
  {
    size: 'large',
    disabled: false,
    clearable: false,
    filterable: false,
    multiple: false,
    width: '100%',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | object): void
  (e: 'change', value: string | number | boolean | object): void
  (e: 'visible-change', visible: boolean): void
  (e: 'remove-tag', value: string | number | boolean | object): void
  (e: 'clear'): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const selectClasses = computed(() => ['select-wrapper', 'full'])

const handleUpdateModelValue = (value: string | number | boolean | object) => {
  emit('update:modelValue', value)
}

const handleChange = (value: string | number | boolean | object) => {
  emit('change', value)
}
</script>

<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    :class="selectClasses"
    :style="{ width: props.width }"
    @update:model-value="handleUpdateModelValue"
    @change="handleChange"
    @visible-change="emit('visible-change', $event)"
    @remove-tag="emit('remove-tag', $event)"
    @clear="emit('clear')"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  >
    <slot />
  </el-select>
</template>

<style scoped>
.full {
  width: 100%;
}

.full :deep(.el-select__wrapper) {
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  border-radius: 10px;
  font-family: 'Segoe UI';
  font-size: 16px;
  font-weight: 500;
  padding: 14px 20px;
}

.full :deep(.el-select__selection-text),
.full :deep(.el-select__placeholder) {
  color: black;
}
</style>

