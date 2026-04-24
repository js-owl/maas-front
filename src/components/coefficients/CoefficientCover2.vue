<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getCoefficients } from './api-coefficients'
import Checkbox from '../ui/Checkbox.vue'

const selected = defineModel<string[]>()
const coveres = ref()
const defaultCoveres = [{ value: '1', label: 'Покраска' }]

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
    coveres.value = defaultCoveres
  }
})
</script>

<template>
  <div style="max-width: 1000px">
    <el-checkbox-group v-model="selected">
      <Checkbox
        v-for="item in filteredCoveres"
        :key="item.value"
        :value="item.value"
        class="checkbox-item"
      >
        <div class="coefficient-value">{{ item.label }}</div>
      </Checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.checkbox-item {
  width: 390px;
  padding-bottom: 5px;
  --checkbox-font-size: 12px;
  --checkbox-text-color: #000;
  --checkbox-label-padding-left: 12px;
  --checkbox-font-family: 'Montserrat-Medium';
  --checkbox-font-weight: 400;
  --checkbox-label-size: 12px;
  --checkbox-line-height: 14px;
  --checkbox-size: 24px;
  --checkbox-border-width: 2px;
  --checkbox-border-color: #7d8083;
  --checkbox-bg-color: var(--bgcolor);
  --checkbox-radius: 4px;
  --checkbox-checked-border-color: #7d8083;
  --checkbox-checked-bg-color: var(--bgcolor);
  --checkbox-check-width: 5px;
  --checkbox-check-height: 10px;
  --checkbox-check-border-width: 2px;
  --checkbox-check-color: #000;
}
:deep(.line) {
  border-color: #333;
}
</style>
