<script setup lang="ts">
import { computed } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

type SelectOption = { value: string | number; label: string }
type SelectOptionGroup = { label: string; options: SelectOption[] }

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    options: SelectOptionGroup[]
    placeholder?: string
    filterable?: boolean
    width?: string
    dropdownClass?: string
  }>(),
  {
    placeholder: '',
    filterable: true,
    width: '100%',
    dropdownClass: 'calc-page-select-dropdown',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | undefined): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div>
    <el-select-v2
      v-model="model"
      :filterable="filterable"
      :options="options"
      :placeholder="placeholder"
      :suffix-icon="IconArrowDown"
      :popper-class="dropdownClass"
      size="large"
      class="full"
      :style="{ width }"
    />
  </div>
</template>

<style scoped>
.full {
  width: 100%;
}

:deep(.el-select__wrapper) {
  background-color: var(--whity);
  border: 0;
  border-radius: 10px;
  min-height: 48px;
  box-shadow: none;
  font-size: 20px;
  font-weight: 600;
  color: black;
  line-height: normal;
  padding: 12px 24px;
}

:deep(.el-select__placeholder),
:deep(.el-select__selected-item) {
  color: black;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-select:hover .el-select__wrapper),
:deep(.el-select .el-select__wrapper.is-focused),
:deep(.el-select .el-select__wrapper.is-hovering) {
  box-shadow: none;
}
</style>

