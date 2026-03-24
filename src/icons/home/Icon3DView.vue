<script lang="ts" setup>
const { color = '#fff' } = defineProps<{
  color?: string
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 43 49"
    xml:space="preserve"
  >
    <path
      :fill="color"
      d="M42.2,11.7l-20-11.5c-0.5-0.3-1-0.3-1.5,0l-20,11.5C0.3,12,0,12.5,0,13v23c0,0.5,0.3,1,0.8,1.3l20,11.5
      c0.5,0.3,1,0.3,1.5,0l20-11.5C42.7,37,43,36.5,43,36V13C43,12.5,42.7,12,42.2,11.7z M40,35.1l-17,9.8V25.3l17-9.8V35.1z M3,15.6
      l17,9.7v19.6L3,35.1V15.6z M21.5,3.2l17,9.8l-17,9.7L4.5,13L21.5,3.2z"
    />
  </svg>
</template>
