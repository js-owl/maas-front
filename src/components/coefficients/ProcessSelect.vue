<script lang="ts" setup>
const selectedMaterial = defineModel<string | null>()

const processes = [
  { label: 'Лазерная резка', value: 'laser-cutting' },
  { label: 'Покраска', value: 'painting' },
]

if (!selectedMaterial.value && processes.length > 0) {
  selectedMaterial.value = processes[0].value
}
</script>

<template>
  <div>
    <p class="coefficient-title">Процесс</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
      size="large"
      class="full"
    >
      <el-option
        v-for="item in processes"
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
  font-size: 16px;
  font-weight: 500;
  color: black;
  margin-top: 10px;
  padding: 10px;
}
</style>
