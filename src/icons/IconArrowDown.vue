<script lang="ts" setup>
const { color = '#7D8083' } = defineProps<{
  color?: string
}>()
</script>

<template>
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 1L7 7L1 1L13 1Z"
      :stroke="color"
      fill="none"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </svg>
</template>
