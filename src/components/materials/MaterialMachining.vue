<script lang="ts" setup>
const selectedMaterial = defineModel();
const materials = [
  {
    value: "alum_D16T",
    label: "Алюминий Д16Т",
  },
  {
    value: "steel_12X18H10T",
    label: "Сталь 12Х18Н10Т",
  },
];
</script>

<template>
  <div>
    <p style="color: #577aad; font-weight: 500">Материал</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
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

.full :deep(.el-select__wrapper) {
  border: 1px solid #577aad;
  border-radius: 5px;
}
</style>
