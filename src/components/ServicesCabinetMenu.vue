<script lang="ts" setup>
import { orderTypeOptions } from '@/helpers/order-type-options'

const emit = defineEmits<{
  (event: 'open-service', routePath: string): void
}>()
</script>

<template>
  <div class="cabinet-menu">
    <button
      v-for="orderTypeOption in orderTypeOptions"
      :key="orderTypeOption.value"
      type="button"
      class="cabinet-menu-item services-menu-item montserrat-medium"
      @click="emit('open-service', orderTypeOption.routePath)"
    >
      <span>{{ orderTypeOption.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.cabinet-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 3px;
}

.cabinet-menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  border: none;
  background-color: transparent;
  color: #14161a;
  font-size: 18px;
  line-height: 1.2;
  text-align: left;
  padding: 10px 5px;
  border-radius: 12px;
  cursor: pointer;
}

.cabinet-menu-item:hover {
  background-color: #f3f4f6;
}

.services-menu-item {
  justify-content: space-between;
}

.services-menu-item::after {
  content: '›';
  color: #55585b;
  font-size: 24px;
  line-height: 1;
}
</style>
