<script lang="ts" setup>
const { color = '#fff', strokeWidth = 3 } = defineProps<{
  color?: string
  strokeWidth?: number
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 43 43"
  >
    <g>
      <rect
        x="2"
        y="2"
        width="17"
        height="17"
        rx="3"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
      <rect
        x="24"
        y="2"
        width="17"
        height="17"
        rx="3"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
      <rect
        x="2"
        y="24"
        width="17"
        height="17"
        rx="3"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
      <rect
        x="24"
        y="24"
        width="17"
        height="17"
        rx="3"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
    </g>
  </svg>
</template>

