<script lang="ts" setup>
const selected = defineModel();
const tolerances = [
  {
    value: "1",
    label: "IT7",
  },
  {
    value: "2",
    label: "IT8",
  },
  {
    value: "3",
    label: "IT9",
  },
  {
    value: "4",
    label: "IT10",
  },
  {
    value: "5",
    label: "IT11",
  },
  {
    value: "6",
    label: "IT12",
  },
];
</script>

<template>
  <div>
    <p>Квалитет точности</p>
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
