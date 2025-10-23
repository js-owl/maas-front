<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getCoefficients } from './api-coefficients'

const selected = defineModel<string[]>()
const coveres = ref()

interface Props {
  excludeLabels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  excludeLabels: () => [],
})

const filteredCoveres = computed(() =>
  coveres.value?.filter((item: any) =>
    !props.excludeLabels?.includes(item.label)
  ) ?? []
)

onMounted(async () => {
  try {
    const coefficients = await getCoefficients()
    coveres.value = coefficients.cover
  } catch (error) {
    console.error('Failed to load covers:', error)
  }
})
</script>

<template>
  <div style="max-width: 1000px">
    <div class="coefficient-label">Финишная обработка изделия</div>
    <el-checkbox-group v-model="selected">
      <el-checkbox
        v-for="item in filteredCoveres"
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
</style>
