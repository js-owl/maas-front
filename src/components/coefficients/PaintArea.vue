<script lang="ts" setup>
const area = defineModel();
</script>

<template>
  <div>
    <p>Площадь покраски, см2</p>
    <el-input-number
      v-model="area"
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
