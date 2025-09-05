<script lang="ts" setup>
const quantity = defineModel();
</script>

<template>
  <div>
    <p style="color: #577aad; font-weight: 500">Количество типоразмеров</p>
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
  border: 1px solid #577aad;
  border-radius: 5px;
}
</style>
