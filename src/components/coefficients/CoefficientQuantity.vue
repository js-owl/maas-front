<script lang="ts" setup>
const quantity = defineModel()
</script>

<template>
  <div class="milling-field-content">
    <p class="milling-field-title">Количество, шт</p>
    <el-input-number v-model="quantity" :min="1" :max="1000" size="large" class="full" />
  </div>
</template>
<style scoped>
.milling-field-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.milling-field-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  color: #000;
  margin: 0;
}

.full {
  width: 100%;
}
.full :deep(.el-input__wrapper) {
  background-color: var(--whity);
  border-color: var(--whity);
  border-radius: 5px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  /* margin-top: 10px; */
  /* padding: 1px 10px; */
}

@media (max-width: 767px) {
  .milling-field-title {
    font-size: 18px;
  }
}
</style>
