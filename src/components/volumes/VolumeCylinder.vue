<script lang="ts" setup>
const length = defineModel({ type: Number, required: true });
const dia = defineModel("dia", { type: Number, required: true });
</script>

<template>
  <div style="padding-right: 20px">
    <p>Длина, мм</p>
    <el-input-number v-model="length" :min="1" :max="1000" size="large" />
  </div>
  <div style="padding-right: 20px">
    <p>Диаметр, мм</p>
    <el-input-number v-model="dia" :min="1" :max="1000" size="large" />
  </div>
</template>
