<script lang="ts" setup>
const { color = '#333333' } = defineProps<{
  color?: string
}>()
</script>

<template>
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 13L1 7L7 1"
      fill="none"
      :stroke="color"
      stroke-width="0.1"
      stroke-linejoin="round"
    />
  </svg>
</template>
