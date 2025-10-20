<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getCoefficients } from './api-coefficients'

const selected = defineModel<string[]>()
const coveres = ref()

onMounted(async () => {
  try {
    const coefficients = await getCoefficients()
    //   const coefficients  = [
    //   { value: "1", label: "Покраска" },
    //   { value: "2", label: "Гальваника" }
    // ];
    coveres.value = coefficients.cover
  } catch (error) {
    console.error('Failed to load covers:', error)
  }
})
</script>

<template>
  <div style="max-width: 1000px">
    <div class="label">Финишная обработка изделия</div>
    <el-checkbox-group v-model="selected">
      <el-checkbox
        v-for="item in coveres"
        :key="item.value"
        :value="item.value"
        class="checkbox-item"
      >
        <div style="font-size: 18px">{{ item.label }}</div>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.checkbox-item {
  width: 300px;
}

.el-checkbox {
  padding-bottom: 5px;
}
:deep(.line) {
  border-color: #333;
}

.label {
  padding-bottom: 12px;
  color: #283d5b;
  font-size: 24px;
  font-weight: 700;
}
@media (max-width: 767px) {
  .label {
    font-size: 20px;
  }
}
</style>
