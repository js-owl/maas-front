<script lang="ts" setup>
// price - руб/кг; density - кг/м3;
const alum = { density: 2700, k_handle: 0.03 };
const steel = { density: 7850, k_handle: 0.045 };

const selectedMaterial = defineModel();
const materials = [
  {
    value: "Алюминий 1",
    label: "лист Д16/Д16Т/Д95/Д95Т",
    price: 110,
    density: alum.density,
    k_handle: alum.k_handle,
  },
  {
    value: "Алюминий 2",
    label: "лист АМ/АМГ/АМЦ",
    price: 110,
    density: alum.density,
    k_handle: alum.k_handle,
  },
  {
    value: "Сталь 1",
    label:
      "лист 15Х, 20Х, 30Х, 35Х, 38ХА, 40Х, 45Х, 50Г, 12ХН, 20ХН, 40ХН, 14ХГН, 19ХГН, 20ХГНМ, 30ХМ",
    price: 70,
    density: steel.density,
    k_handle: steel.k_handle,
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
      style="display: block; width: 800px"
    >
      <el-option
        v-for="item in materials"
        :key="item.value"
        :label="item.label"
        :value="item"
      />
    </el-select>
  </div>
</template>
