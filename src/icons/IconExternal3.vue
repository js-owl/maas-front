<script lang="ts" setup>
const { color = '#7D8083', strokeWidth = 3 } = defineProps<{
  color?: string
  strokeWidth?: number
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 61"
  >
    <path
      d="M24.6053 38.0185L22.4474 59.5L50.5 29.4259L35.3947 20.8333L37.5526 1.5L9.5 31.5741L24.6053 38.0185Z"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
