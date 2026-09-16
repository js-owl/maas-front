<script lang="ts" setup>
defineProps<{
  tags: string[]
}>()
</script>

<template>
  <div class="uslugi-keywords">
    <span v-for="tag in tags" :key="tag" class="uslugi-keyword">{{ tag }}</span>
  </div>
</template>

<style scoped>
.uslugi-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
}

.uslugi-keyword {
  background-color: #e0e3ed;
  padding: 8px 16px;
  border-radius: 16px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #000;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .uslugi-keywords {
    display: none;
  }
}
</style>
