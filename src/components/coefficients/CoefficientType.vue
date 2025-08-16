<script lang="ts" setup>
const selected = defineModel();
const options = [
  {
    value: 1,
    label: "a",
  },
  {
    value: 1.1,
    label: "b",
  },
  {
    value: 1.2,
    label: "c",
  },
];
</script>

<template>
  <div style="width: 200px">
    <p>Тип детали</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      style="display: block"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
