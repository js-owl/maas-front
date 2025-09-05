<script lang="ts" setup>
const length = defineModel();
</script>

<template>
  <div>
    <p style="color: #577aad; font-weight: 500">Длина, мм</p>
    <el-input-number
      v-model="length"
      :min="1"
      :max="2000"
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
