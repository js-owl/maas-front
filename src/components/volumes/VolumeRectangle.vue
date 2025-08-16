<script lang="ts" setup>
const length = defineModel({ type: Number, required: true });
const width = defineModel("width", { type: Number, required: true });
const thickness = defineModel("thickness", { type: Number, required: true });
</script>

<template>
  <div style="padding-right: 10px">
    <p>Длина, мм</p>
    <el-input-number v-model="length" :min="1" :max="1000" size="large" />
  </div>
  <div style="padding-right: 10px">
    <p>Ширина, мм</p>
    <el-input-number v-model="width" :min="1" :max="1000" size="large" />
  </div>
  <div style="padding-right: 10px">
    <p>Толщина, мм</p>
    <el-input-number v-model="thickness" :min="1" :max="1000" size="large" />
  </div>
</template>
