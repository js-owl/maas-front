<script lang="ts" setup>
const { color = '#7D8083' } = defineProps<{
  color?: string
}>()
</script>

<template>
  <span class="icon-arrow-down">
    <svg
      class="icon-arrow-down__desktop"
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
    <svg
      class="icon-arrow-down__mobile"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 9.5L12 15.5L6 9.5L18 9.5Z"
        :stroke="color"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>

<style scoped>
.icon-arrow-down {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-arrow-down__mobile {
  display: none;
}

@media (max-width: 768px) {
  .icon-arrow-down__desktop {
    display: none;
  }

  .icon-arrow-down__mobile {
    display: block;
  }
}
</style>
