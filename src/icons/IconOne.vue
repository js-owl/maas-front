<script lang="ts" setup>
const { color = '#7D8083', backgroundColor = '#CBD1D5' } = defineProps<{
  backgroundColor?: string
  color?: string
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
  >
    <path
      :fill="backgroundColor"
      d="M50,60H10C4.5,60,0,55.5,0,50V10C0,4.5,4.5,0,10,0h40c5.5,0,10,4.5,10,10v40C60,55.5,55.5,60,50,60z"
    />
    <path
      :fill="color"
      d="M36.8,49h-8.3c-0.6,0-1-0.4-1-1V19.7h-6.2c-0.6,0-1-0.4-1-1V12c0-0.6,0.4-1,1-1h15.5c0.6,0,1,0.4,1,1v36
        C37.8,48.6,37.3,49,36.8,49z M29.4,47h6.3V13H22.2v4.7h6.2c0.6,0,1,0.4,1,1V47z"
    />
  </svg>
</template>
