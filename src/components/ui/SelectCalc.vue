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
  border-color: var(--whity);
  border-radius: 5px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  padding: 10px;
}

</style>
