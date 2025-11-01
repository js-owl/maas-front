<script lang="ts" setup>
import { onMounted } from 'vue'
import { useMaterialStore } from '../../stores/material.store'

const selectedMaterial = defineModel<string | null>()
const materialStore = useMaterialStore()

onMounted(async () => {
  await materialStore.loadMaterials('cnc-lathe')
  if (selectedMaterial.value) {
    materialStore.setAllMaterials([{ value: selectedMaterial.value, label: selectedMaterial.value }])
  } else if (materialStore.materials.length > 0) {
    selectedMaterial.value = materialStore.materials[0].value
    materialStore.setAllMaterials(materialStore.materials)
  }
})

const onChange = () => {
  materialStore.setAllMaterials(materialStore.materials)
}
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
      @change="onChange"
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

.full :deep(.el-select__wrapper) {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
