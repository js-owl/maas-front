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
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}

.cabinet-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  height: 42px;
  border: none;
  background-color: transparent;
  color: #000;
  font-size: 18px;
  line-height: 1;
  text-align: left;
  padding: 10px 0;
  cursor: pointer;
}

.cabinet-menu-item:hover {
  background-color: #f3f4f6;
}

.services-menu-item::after {
  content: '';
  display: block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 5L11 9L7 13' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
}
</style>
