<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

defineProps<{
  title: string
  columns: string[]
}>()

const isExpanded = ref(false)
</script>

<template>
  <div class="technical-requirements">
    <div class="requirements-header" @click="isExpanded = !isExpanded">
      <div class="uslugi-table-title">{{ title }}</div>
      <el-icon class="requirements-arrow" :class="{ expanded: isExpanded }">
        <IconArrowDown />
      </el-icon>
    </div>

    <div v-if="isExpanded" class="requirements-table-wrapper">
      <table class="requirements-table requirements-table--middle">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" class="uslugi-table-thead">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.technical-requirements {
  margin-top: 28px;
}

.requirements-header {
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
}

.requirements-arrow {
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-top: 12px;
  overflow: hidden;
}

.requirements-table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}
</style>
