<script lang="ts" setup>
// price - руб/кг; density - кг/м3;
const plastic = { density: 1800, k_handle: 0.055 };

const selectedMaterial = defineModel();
const materials = [
  {
    value: "plastic",
    label: "Полипропилен (PP)",
    price: 110,
    density: plastic.density,
    k_handle: plastic.k_handle,
  },
  {
    value: "plastic",
    label: "Поливинилхлорид (ПВХ)",
    price: 110,
    density: plastic.density,
    k_handle: plastic.k_handle,
  },
  {
    value: "plastic",
    label: "Полистирол (PS) ",
    price: 70,
    density: plastic.density,
    k_handle: plastic.k_handle,
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
