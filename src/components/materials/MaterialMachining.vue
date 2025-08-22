<script lang="ts" setup>
// price - руб/кг; density - кг/м3;
const alum = { density: 2700, k_handle: 0.03 };
const steel = { density: 7850, k_handle: 0.045 };

const selectedMaterial = defineModel();
const materials = [
  {
    value: "alum 1",
    label: "пруток Д16/Д16Т/Д95/Д95Т",
    price: 110,
    density: alum.density,
    k_handle: alum.k_handle,
  },
  {
    value: "alum 2",
    label: "пруток АМ/АМГ/АМЦ",
    price: 110,
    density: alum.density,
    k_handle: alum.k_handle,
  },
  {
    value: "alum 3",
    label: "шестигранник Д16/Д16Т/Д95/Д95Т",
    price: 110,
    density: alum.density,
    k_handle: alum.k_handle,
  },
  {
    value: "alum 4",
    label: "шестигранник АМ/АМГ/АМЦ",
    price: 110,
    density: alum.density,
    k_handle: alum.k_handle,
  },
  {
    value: "steel 1",
    label:
      "пруток 15Х, 20Х, 30Х, 35Х, 38ХА, 40Х, 45Х, 50Г, 12ХН, 20ХН, 40ХН, 14ХГН, 19ХГН, 20ХГНМ, 30ХМ ",
    price: 70,
    density: steel.density,
    k_handle: steel.k_handle,
  },
  {
    value: "steel 2",
    label:
      "шестигранник 15Х, 20Х, 30Х, 35Х, 38ХА, 40Х, 45Х, 50Г, 12ХН, 20ХН, 40ХН, 14ХГН, 19ХГН, 20ХГНМ, 30ХМ ",
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
