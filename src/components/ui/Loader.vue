<script lang="ts" setup>
withDefaults(
  defineProps<{
    loading: boolean
    text?: string
    background?: string
    customClass?: string
  }>(),
  {
    text: 'Загрузка...',
    background: 'rgba(0, 42, 68, 0.8)',
    customClass: 'loading-top',
  }
)
</script>

<template>
  <div
    v-loading="loading"
    :element-loading-background="background"
    :element-loading-text="text"
    :element-loading-custom-class="customClass"
    class="loader-wrapper"
  >
    <slot />
  </div>
</template>

<style scoped>
.loader-wrapper {
  width: 100%;
  height: 100%;
}

:deep(.loading-top .el-loading-spinner) {
  top: 40px;
  margin-top: 0;
  transform: scale(1.5);
  transform-origin: top center;
}
</style>
