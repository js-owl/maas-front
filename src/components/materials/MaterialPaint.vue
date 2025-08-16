<script lang="ts" setup>
const selectedMaterial = defineModel();
const materials = [
  {
    value: "metal",
    label: "Металл",
  },
  {
    value: "alum",
    label: "Алюминий",
  },
];
</script>

<template>
  <div>
    <p>Материал основы</p>
    <el-select
      v-model="selectedMaterial"
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
