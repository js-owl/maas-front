<script lang="ts" setup>
const selected = defineModel();
const options = [
  {
    value: "epoxy",
    label: "Эпоксидная",
  },
  {
    value: "b",
    label: "b",
  },
  {
    value: "c",
    label: "c",
  },
];
</script>

<template>
  <div>
    <p>Вид краски</p>
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
