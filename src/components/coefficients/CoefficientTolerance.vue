<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getCoefficients } from "./api-coefficients";

const selected = defineModel();
const tolerances = ref();

onMounted(async () => {
  try {
    const coefficients = await getCoefficients();
    tolerances.value = coefficients.tolerance;
  } catch (error) {
    console.error("Failed to load tolerances:", error);
  }
});
</script>

<template>
  <div>
    <p class="coefficient-title">Квалитет точности</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      class="full"
    >
      <el-option
        v-for="item in tolerances"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
.full {
  width: 100%;
}

.full :deep(.el-select__wrapper) {
  border: 1px solid black;
  border-radius: 5px;
}
</style>
