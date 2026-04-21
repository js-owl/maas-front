<script lang="ts" setup>
import { computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: Date | null
    manufacturingCycle: number
    placeholder?: string
  }>(),
  {
    placeholder: 'Выберите дату',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'update:manufacturingCycle', value: number): void
}>()

const MS_IN_DAY = 24 * 60 * 60 * 1000
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const calculateDaysUntil = (targetDate: Date) => {
  const today = startOfDay(new Date())
  const deadline = startOfDay(targetDate)
  return Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / MS_IN_DAY))
}

const isPastDateDisabled = (date: Date) => startOfDay(date).getTime() < startOfDay(new Date()).getTime()

const deadline = computed({
  get: () => props.modelValue,
  set: (value: Date | null) => {
    emit('update:modelValue', value)
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      emit('update:manufacturingCycle', 0)
      return
    }

    emit('update:manufacturingCycle', calculateDaysUntil(value))
  },
  { immediate: true }
)
</script>

<template>
  <el-date-picker
    v-model="deadline"
    type="date"
    format="DD.MM.YYYY"
    :disabled-date="isPastDateDisabled"
    :placeholder="placeholder"
    popper-class="milling-date-picker-popper"
    class="milling-input milling-date-picker"
  />
</template>

<style scoped>
.milling-date-picker :deep(.el-input__prefix-inner > .el-icon) {
  color: rgba(0, 0, 0, 0.55);
}

:deep(.milling-date-picker-popper) {
  border-radius: 10px;
}

:deep(.milling-date-picker-popper .el-picker-panel__content) {
  font-family: 'Montserrat-Regular', sans-serif;
}
</style>
