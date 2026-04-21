<script lang="ts" setup>
import { computed, watch } from 'vue'
import IconDate from '@/components/icons/IconDate.vue'

const props = withDefaults(
  defineProps<{
    modelValue: Date | null
    manufacturingCycle: number
    placeholder?: string
  }>(),
  {
    placeholder: 'до ДД.ММ.ГГГГ',
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
  <div class="milling-date-picker">
    <div class="milling-date-picker__control">
      <el-date-picker
        v-model="deadline"
        type="date"
        format="[до ]DD.MM.YYYY"
        :disabled-date="isPastDateDisabled"
        :placeholder="placeholder"
        popper-class="milling-date-picker-popper"
        class="milling-date-picker__input"
      />
      <IconDate class="milling-date-picker__icon" />
    </div>
  </div>
</template>

<style scoped>
.milling-date-picker {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.milling-date-picker__input {
  width: 100%;
  --el-input-bg-color: #f4f6f8;
  --el-input-border-color: transparent;
  --el-input-hover-border-color: transparent;
  --el-input-focus-border-color: transparent;
  --el-input-text-color: #000000;
  --el-text-color-placeholder: #000000;
  --el-disabled-bg-color: #f4f6f8;
  --el-fill-color-light: #f4f6f8;
}

.milling-date-picker__control {
  position: relative;
}

:deep(.milling-date-picker__input.el-date-editor) {
  width: 100%;
  height: 31px !important;
}

:deep(.milling-date-picker__input .el-input__wrapper) {
  height: 31px !important;
  min-height: 31px;
  padding: 12px 24px;
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: none !important;
  border: none;
}

:deep(.milling-date-picker__input .el-input__inner) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #000000;
}

:deep(.milling-date-picker__input .el-input__inner::placeholder) {
  color: #000000;
  opacity: 1;
}

:deep(.milling-date-picker__input .el-input__prefix),
:deep(.milling-date-picker__input .el-input__prefix-inner) {
  display: none;
}

:deep(.milling-date-picker__input .el-input__suffix) {
  margin-left: 10px;
}

:deep(.milling-date-picker__input .el-input__suffix-inner) {
  display: flex;
  align-items: center;
}

:deep(.milling-date-picker__input .el-input__suffix-inner > .el-icon) {
  display: none;
}

:deep(.milling-date-picker__input .el-input__suffix-inner .milling-date-picker__icon) {
  display: none;
}

.milling-date-picker__icon {
  position: absolute;
  top: 50%;
  right: 24px;
  width: 20px;
  height: 20px;
  color: #7d8083;
  transform: translateY(-50%);
  pointer-events: none;
}

:deep(.milling-date-picker-popper) {
  border-radius: 10px;
}

:deep(.milling-date-picker-popper .el-picker-panel__content) {
  font-family: 'Montserrat-Regular', sans-serif;
}
</style>
