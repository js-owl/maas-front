<script lang="ts" setup>
const quantity = defineModel();
</script>

<template>
  <div>
    <p>Количество, шт</p>
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
</style>
