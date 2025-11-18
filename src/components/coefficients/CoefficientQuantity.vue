<script lang="ts" setup>
const quantity = defineModel()
</script>

<template>
  <div>
    <p class="coefficient-title">Количество, шт</p>
    <el-input-number v-model="quantity" :min="1" :max="1000" size="large" class="full" />
  </div>
</template>
<style scoped>
.full {
  width: 100%;
}
.full :deep(.el-input__wrapper) {
  background-color: var(--whity);
  border-color: var(--whity);
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  /* margin-top: 10px; */
  padding: 1px 10px;
}
</style>
