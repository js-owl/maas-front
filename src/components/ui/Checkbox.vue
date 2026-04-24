<script lang="ts" setup>
type CheckboxValue = string | number | boolean

withDefaults(
  defineProps<{
    value?: CheckboxValue
    disabled?: boolean
  }>(),
  {
    value: undefined,
    disabled: false,
  }
)

const modelValue = defineModel<CheckboxValue | CheckboxValue[] | boolean>()
</script>

<template>
  <el-checkbox v-model="modelValue" :value="value" :disabled="disabled" class="checkbox">
    <slot />
  </el-checkbox>
</template>

<style scoped>
.checkbox {
  --el-checkbox-font-size: var(--checkbox-font-size, 14px);
  --el-checkbox-text-color: var(--checkbox-text-color, #000);
}

.checkbox :deep(.el-checkbox__label) {
  padding-left: var(--checkbox-label-padding-left, 10px);
  font-family: var(--checkbox-font-family, 'Montserrat-Medium'), sans-serif;
  font-weight: var(--checkbox-font-weight, 500);
  font-size: var(--checkbox-label-size, 14px);
  line-height: var(--checkbox-line-height, 1.2);
}

.checkbox :deep(.el-checkbox__inner) {
  width: var(--checkbox-size, 18px);
  height: var(--checkbox-size, 18px);
  border: var(--checkbox-border-width, 1px) solid var(--checkbox-border-color, #dcdfe6);
  border-radius: var(--checkbox-radius, 4px);
  background-color: var(--checkbox-bg-color, #fff);
}

.checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: var(--checkbox-checked-border-color, var(--checkbox-border-color, #409eff));
  background-color: var(--checkbox-checked-bg-color, var(--checkbox-bg-color, #409eff));
}

.checkbox :deep(.el-checkbox__inner::after) {
  left: 7px;
  top: 2px;
  width: var(--checkbox-check-width, 4px);
  height: var(--checkbox-check-height, 8px);
  border-width: var(--checkbox-check-border-width, 2px);
  /* border-color: var(--checkbox-check-color, #000);
  transform: translate(-50%, -55%) rotate(45deg); */
}

.checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after),
.checkbox :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner::after),
.checkbox :deep(.el-checkbox__input.is-disabled .el-checkbox__inner::after) {
  border-color: var(--checkbox-check-color, #000);
}

.checkbox.agreement-checkbox {
  --checkbox-font-size: 12px;
  --checkbox-text-color: #000;
  --checkbox-label-padding-left: 12px;
  --checkbox-font-family: 'Montserrat-Medium';
  --checkbox-font-weight: 400;
  --checkbox-label-size: 12px;
  --checkbox-line-height: 14px;
  --checkbox-size: 24px;
  --checkbox-border-width: 2px;
  --checkbox-border-color: #7d8083;
  --checkbox-bg-color: var(--bgcolor);
  --checkbox-radius: 4px;
  --checkbox-checked-border-color: #7d8083;
  --checkbox-checked-bg-color: var(--bgcolor);
  --checkbox-check-width: 5px;
  --checkbox-check-height: 10px;
  --checkbox-check-border-width: 2px;
  --checkbox-check-color: #000;
}
</style>
