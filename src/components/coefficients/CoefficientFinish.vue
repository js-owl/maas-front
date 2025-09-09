<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getCoefficients } from "./api-coefficients";

const selected = defineModel();
const finishes = ref();

onMounted(async () => {
  try {
    const coefficients = await getCoefficients();
    finishes.value = coefficients.finish;
  } catch (error) {
    console.error("Failed to load finishes:", error);
  }
});
</script>

<template>
  <div>
    <p style="color: #577aad; font-weight: 500">Шероховатость, Ra</p>
    <el-select
      v-model="selected"
      placeholder="Выбрать"
      size="large"
      class="full"
    >
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
.full {
  width: 100%;
}

.full :deep(.el-select__wrapper) {
  border: 1px solid #577aad;
  border-radius: 5px;
}
</style>
