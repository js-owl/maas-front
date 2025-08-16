<script lang="ts" setup>
const selected = defineModel();
const tolerances = [
  {
    value: 1,
    label: "h14",
  },
  {
    value: 1.1,
    label: "h12",
  },
  {
    value: 1.2,
    label: "h10",
  },
];
</script>

<template>
  <div>
    <p>Допуск</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      style="display: block"
    >
      <el-option
        v-for="item in tolerances"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
