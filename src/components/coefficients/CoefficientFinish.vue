<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getCoefficients } from './api-coefficients'

const selected = defineModel()
const finishes = ref()

onMounted(async () => {
  try {
    const coefficients = await getCoefficients()
    finishes.value = coefficients.finish
  } catch (error) {
    console.error('Failed to load finishes:', error)
  }
})
</script>

<template>
  <div>
    <p class="milling-field-title">Технология</p>
    <el-select v-model="selected" placeholder="Выбрать" size="large" class="full">
      <el-option
        v-for="item in finishes"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
.milling-field-title {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  line-height: 1;
  color: #000;
}

.full {
  width: 100%;
}

.full :deep(.el-select__wrapper) {
  background-color: var(--whity);
  border-color: var(--whity);
  border-radius: 5px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  /* margin-top: 10px; */
  padding: 5px 15px;
}

@media (max-width: 767px) {
  .milling-field-title {
    font-size: 18px;
  }
}
</style>
