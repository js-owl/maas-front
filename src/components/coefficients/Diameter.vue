<script lang="ts" setup>
const width = defineModel();
</script>

<template>
  <div>
    <p>Диаметр, мм</p>
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
</style>
