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
    <p>Материал</p>
    <el-select
      v-model="selectedMaterial"
      value-key="label"
      placeholder="Выбрать"
      size="large"
      style="display: block; width: 100%"
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
