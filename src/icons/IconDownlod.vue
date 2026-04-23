<script lang="ts" setup>
const { color = '#7d8083', width = 15.3333, height = 17 } = defineProps<{
  color?: string
  width?: string | number
  height?: string | number
}>()
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 15.3333 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 11.1703L1 14.2438C1 14.7095 1.17559 15.1562 1.48816 15.4856C1.80072 15.815 2.22464 16 2.66667 16H12.6667C13.1087 16 13.5326 15.815 13.8452 15.4856C14.1577 15.1562 14.3333 14.7095 14.3333 14.2438V11.1703M7.6676 1V10.9521M7.6676 10.9521L11.4771 7.14942M7.6676 10.9521L3.85807 7.14942"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
