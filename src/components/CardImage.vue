<script lang="ts" setup>
const { img, length, dia, thickness } = defineProps([
  "img",
  "length",
  "dia",
  "thickness",
]);
</script>

<template>
  <el-card style="background-color: #ddd">
    <el-image style="" :src="img" fit="fill" />
    <div v-if="thickness" class="card">
      {{ `${length}мм x ${dia}мм x ${thickness} мм` }}
    </div>
    <div v-else class="card">
      {{ `${length}мм x ${dia}мм` }}
    </div>
  </el-card>
</template>

<style scoped>
.card {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 40px;
}
</style>
