<template>
  <div class="suitable-machines">
    <div class="label">Подходящее оборудование</div>
    <div class="machines-list">
      <div v-for="(item, index) in machines" :key="index" class="machine-item">
        {{ item }}
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
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.machines-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.machine-item {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 16px;
  color: #495057;
  transition: all 0.2s ease;
}

.machine-item:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
