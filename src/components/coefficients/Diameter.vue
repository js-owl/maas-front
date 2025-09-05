<script lang="ts" setup>
const width = defineModel();
</script>

<template>
  <div>
    <p style="color: #577aad; font-weight: 500">Диаметр, мм</p>
    <el-input-number
      v-model="width"
      :min="1"
      :max="600"
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
