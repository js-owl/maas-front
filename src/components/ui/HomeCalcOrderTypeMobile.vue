<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { orderTypeOptions } from '@/helpers/order-type-options'
import mechIcon from '@/icons/home/order-type/mech.svg?raw'
import printingIcon from '@/icons/home/order-type/printing.svg?raw'
import compositeIcon from '@/icons/home/order-type/composite.svg?raw'
import galvanicIcon from '@/icons/home/order-type/galvanic.svg?raw'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const orderTypeIcons: Record<string, string> = {
  milling: mechIcon,
  printing: printingIcon,
  composite: compositeIcon,
  galvanic: galvanicIcon,
}

const hasIcon = (value: string) => value in orderTypeIcons

const getIconColor = (value: string) => {
  if (props.modelValue !== value) return '#7d8083'
  return value === 'galvanic' ? '#e84261' : '#000000'
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

onClickOutside(rootRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div
    ref="rootRef"
    class="home-calc-order-type-mobile"
    :class="{ 'is-open': isOpen }"
  >
    <button
      type="button"
      class="home-calc-order-type-mobile__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      aria-label="Тип обработки"
      @click="toggle"
    >
      <span class="home-calc-order-type-mobile__label">Тип обработки</span>
      <span class="home-calc-order-type-mobile__chevron" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.5 8.5L10 14L4.5 8.5L15.5 8.5Z"
            stroke="#000000"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>

    <div
      v-show="isOpen"
      class="home-calc-order-type-mobile__list"
      role="listbox"
      aria-label="Тип обработки"
    >
      <button
        v-for="option in orderTypeOptions"
        :key="option.value"
        type="button"
        role="option"
        class="home-calc-order-type-mobile__option"
        :class="{ 'is-selected': modelValue === option.value }"
        :aria-selected="modelValue === option.value"
        @click="selectOption(option.value)"
      >
        <span
          v-if="hasIcon(option.value)"
          class="home-calc-order-type-mobile__icon"
          :style="{ '--fill-0': getIconColor(option.value) }"
          v-html="orderTypeIcons[option.value]"
        />
        <span class="home-calc-order-type-mobile__option-label">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-calc-order-type-mobile {
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: #f2f3f7;
}

.home-calc-order-type-mobile.is-open {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-calc-order-type-mobile__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.home-calc-order-type-mobile__label {
  flex: 1 1 0;
  min-width: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
  word-break: break-word;
}

.home-calc-order-type-mobile__chevron {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.home-calc-order-type-mobile.is-open .home-calc-order-type-mobile__chevron {
  transform: rotate(180deg);
}

.home-calc-order-type-mobile__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.home-calc-order-type-mobile__option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 16px 8px;
  border: none;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;
}

.home-calc-order-type-mobile__option.is-selected {
  border-radius: 8px;
  background-color: #ffffff;
}

.home-calc-order-type-mobile__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.home-calc-order-type-mobile__icon :deep(svg) {
  display: block;
  width: 20px;
  height: 20px;
}

.home-calc-order-type-mobile__option-label {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #7d8083;
  word-break: break-word;
}

.home-calc-order-type-mobile__option.is-selected .home-calc-order-type-mobile__option-label {
  color: #000000;
}
</style>
