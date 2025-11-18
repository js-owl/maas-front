<script lang="ts" setup>
import { onMounted } from 'vue'
import { useMaterialStore } from '../../stores/material.store'

const selectedMaterial = defineModel<string | null>()
const materialStore = useMaterialStore()

onMounted(async () => {
  await materialStore.loadMaterials('cnc-lathe')
  if (!selectedMaterial.value && materialStore.materials.length > 0) {
    selectedMaterial.value = materialStore.materials[0].value
  }
})
</script>

<template>
  <div>
    <p class="coefficient-title">Материал</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
      size="large"
      class="full"
    >
      <el-option
        v-for="item in materialStore.materials"
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
