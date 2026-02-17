<script lang="ts" setup>
const { color = '#7D8083', strokeWidth = 3 } = defineProps<{
  color?: string
  strokeWidth?: number
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 43"
  >
    <path
      d="M10 21.4994L50 21.4994M35.4545 9.82211L30 15.4889M30 15.4889L24.5455 9.82211M30 15.4889V1.5M24.5455 33.1779L30 27.5111M30 27.5111L35.4545 33.1779M30 27.5111V41.5"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

