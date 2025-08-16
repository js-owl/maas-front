<script lang="ts" setup>
const typosizes = defineModel();
</script>

<template>
  <div style="width: 200px; padding-right: 20px">
    <p>Количество</p>
    <el-input-number v-model="typosizes" :min="1" :max="1000" size="large" />
  </div>
</template>
