<script lang="ts" setup>
import { computed } from 'vue'
import CheckboxСalc from '../ui/CheckboxСalc.vue'

const selected = defineModel<string>({ required: true })

const isToolingRequired = computed({
  get: () => selected.value !== '1',
  set: (value: boolean) => {
    selected.value = value ? '2' : '1'
  },
})
</script>

<template>
  <CheckboxСalc v-model="isToolingRequired" class="tooling-checkbox">
    Требуется изготовление
  </CheckboxСalc>
</template>

<style scoped>
.tooling-checkbox {
  margin-right: 0;
}
</style>
