<script lang="ts" setup>
const selected = defineModel();
const finishes = [
  {
    value: 1,
    label: "Покраска",
  },
  {
    value: 1.1,
    label: "Гальваника",
  },
];
</script>

<template>
  <div>
    <p>Покрытие</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      style="display: block"
    >
      <el-option
        v-for="item in finishes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
