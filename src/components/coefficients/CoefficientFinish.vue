<script lang="ts" setup>
const selected = defineModel();
const finishes = [
  {
    value: 1,
    label: "12.5",
  },
  {
    value: 1.1,
    label: "6.3",
  },
  {
    value: 1.2,
    label: "3.2",
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
