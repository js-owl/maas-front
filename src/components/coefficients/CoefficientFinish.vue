<script lang="ts" setup>
const selected = defineModel();
const finishes = [
  {
    value: "1",
    label: "12.5",
  },
  {
    value: "2",
    label: "6.3",
  },
  {
    value: "3",
    label: "3.2",
  },
  {
    value: "4",
    label: "1.6",
  },
  {
    value: "5",
    label: "0.8",
  },
];
</script>

<template>
  <div>
    <p>Шероховатость, Ra</p>
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
