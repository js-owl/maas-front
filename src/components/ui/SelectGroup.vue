<script setup lang="ts">
import { computed } from 'vue'

type SelectOption = { value: string | number; label: string }
type SelectOptionGroup = { label: string; options: SelectOption[] }

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    options: SelectOptionGroup[]
    placeholder?: string
    filterable?: boolean
    width?: string
  }>(),
  {
    placeholder: '',
    filterable: true,
    width: '100%',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | undefined): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <el-select-v2
    v-model="model"
    :filterable="filterable"
    :options="options"
    :placeholder="placeholder"
    :style="{ width }"
  />
</template>

