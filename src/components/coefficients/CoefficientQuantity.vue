<script lang="ts" setup>
const quantity = defineModel();
</script>

<template>
  <div>
    <p class="coefficient-title">Количество, шт</p>
    <el-input-number
      v-model="quantity"
      :min="1"
      :max="1000"
      size="large"
      class="full"
    />
  </div>
</template>
<style scoped>
.full {
  width: 100%;
}
.full :deep(.el-input__wrapper) {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
