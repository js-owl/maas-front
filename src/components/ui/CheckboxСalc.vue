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
  --el-checkbox-font-size: 16px;
  --el-checkbox-text-color: #000;
}

.checkbox :deep(.el-checkbox__label) {
  padding-left: 8px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: normal;
}

.checkbox :deep(.el-checkbox__inner) {
  width: 20px;
  height: 21px;
  border: 2px solid #cbd1d5;
  border-radius: 6px;
  background-color: #fff;
}

.checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: #cbd1d5;
  background-color: #fff;
}

.checkbox :deep(.el-checkbox__inner::after) {
  left: 6px;
  top: 2px;
  width: 4px;
  height: 8px;
  border-width: 2px;
}

.checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after),
.checkbox :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner::after),
.checkbox :deep(.el-checkbox__input.is-disabled .el-checkbox__inner::after) {
  border-color: #cbd1d5;
}

</style>
