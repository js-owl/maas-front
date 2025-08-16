<script lang="ts" setup>
const length = defineModel();
</script>

<template>
  <div>
    <p>Длина</p>
    <el-input-number
      v-model="length"
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
</style>
