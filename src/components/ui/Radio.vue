<script lang="ts" setup>
type RadioValue = string | number | boolean

withDefaults(
  defineProps<{
    value: RadioValue
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const modelValue = defineModel<RadioValue>()
</script>

<template>
  <el-radio v-model="modelValue" :value="value" :disabled="disabled" class="radio">
    <span class="radio-label">
      <slot />
    </span>
  </el-radio>
</template>

<style scoped>
.radio {
  margin-right: 0;
  width: var(--radio-width, 100%);
  min-height: var(--radio-min-height, 20px);
}

.radio-label {
  font-family: var(--radio-font-family, 'Montserrat-Medium'), sans-serif;
  font-size: var(--radio-label-size, 16px);
  line-height: var(--radio-line-height, 1);
  color: var(--radio-text-color, #000);
  white-space: var(--radio-white-space, nowrap);
}

.radio :deep(.el-radio__label) {
  padding-left: var(--radio-label-padding-left, 10px);
}

.radio :deep(.el-radio__inner) {
  display: inline-block;
  box-sizing: border-box;
  width: var(--radio-size, 20px);
  height: var(--radio-size, 20px);
  border-radius: 50%;
  background: var(--radio-bg-color, transparent);
  border: var(--radio-border-width, 2px) solid var(--radio-border-color, #cbd1d5);
}

.radio :deep(.el-radio__inner::after) {
  width: var(--radio-dot-size, 10px);
  height: var(--radio-dot-size, 10px);
}

.radio :deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: var(--radio-checked-border-color, var(--radio-border-color, #cbd1d5));
  background: var(--radio-checked-bg-color, #fff);
}

.radio :deep(.el-radio__input.is-checked .el-radio__inner::after) {
  transform: translate(-50%, -50%) scale(1);
  background-color: var(--radio-dot-color, #cbd1d5);
}

.radio :deep(.el-radio__input) {
  display: inline-flex;
  align-items: center;
}

.radio :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: var(--radio-checked-text-color, #000);
}
</style>
