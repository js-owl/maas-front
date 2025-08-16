<script lang="ts" setup>
const selected = defineModel();
const options = [
  {
    value: "3032",
    label: "RAL 3032",
  },
  {
    value: "3033",
    label: "b",
  },
  {
    value: "3034",
    label: "c",
  },
];
</script>

<template>
  <div>
    <p>Цвет в RAL</p>
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
