<script lang="ts" setup>
type SelectCalcOption = {
  value: string
  label: string
}

withDefaults(
  defineProps<{
    materials: SelectCalcOption[]
    placeholder?: string
  }>(),
  {
    placeholder: 'Выбрать',
  }
)

const selectedValue = defineModel<string>()
</script>

<template>
  <div>
    <el-select
      v-model="selectedValue"
      value-key="label"
      :placeholder="placeholder"
      size="large"
      class="full"
    >
      <el-option
        v-for="item in materials"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
}

:deep(.el-select__caret) {
  color: var(--button);
  font-size: 20px;
}

:deep(.el-select:hover .el-select__wrapper),
:deep(.el-select .el-select__wrapper.is-focused),
:deep(.el-select .el-select__wrapper.is-hovering) {
  box-shadow: none;
}
</style>
