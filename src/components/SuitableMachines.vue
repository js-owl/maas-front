<template>
  <div class="suitable-machines" style="max-width: 1000px">
    <div class="label">Подходящее оборудование</div>
    <div class="machines-list">
      <div v-for="(item, index) in machines" :key="index" class="machine-item">
        <div style="font-size: 18px">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  machines: string[];
}

defineProps<Props>();
</script>

<style scoped>
.suitable-machines {
  width: 100%;
}

.label {
  padding-bottom: 12px;
  color: #283d5b;
  font-size: 24px;
  font-weight: 700;
}

.machines-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.machine-item {
  width: 300px;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.machine-item:hover {
  background-color: #f5f5f5;
  border-color: #333;
}

.machine-item:last-child {
  border-bottom: none;
}
</style>
