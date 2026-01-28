<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    plain?: boolean
    width?: string
    loading?: boolean
  }>(),
  {
    disabled: false,
    plain: false,
    width: '100%',
    loading: false,
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const buttonClasses = computed(() => ({
  'is-disabled': props.disabled || props.loading,
  'is-loading': props.loading,
}))

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<template>
  <button :class="['btn', buttonClasses]" :disabled="disabled || loading" :style="{ width: props.width }" @click="handleClick">
    <span v-if="loading" class="btn-spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  position: relative;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--bgcolor) 100%, white 15%) 0%,
    var(--bgcolor) 25%,
    color-mix(in srgb, var(--bgcolor) 100%, black 10%) 50%,
    var(--bgcolor) 75%,
    color-mix(in srgb, var(--bgcolor) 100%, white 15%) 100%
  );
  background-size: 200% 200%;
  background-position: 0% 50%;
  border: none;
  border-radius: 12px;
  color: black;
  
  font-family: 'Segoe UI';
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  cursor: pointer;
  
  /* 3D эффект с тенями */
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  border-radius: 12px;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.2s;
}

.btn.is-disabled {
  background: linear-gradient(145deg, 
    color-mix(in srgb, var(--bgcolor) 100%, white 5%),
    color-mix(in srgb, var(--bgcolor) 100%, black 5%)
  ) !important;
  background-size: 100% 100% !important;
  background-position: 0% 50% !important;
  opacity: 0.6;
  cursor: not-allowed;
  color: black;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(0) !important;
  animation: none !important;
}

.btn:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.2),
    0 3px 6px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  animation: gradient-shift 3s ease infinite;
}

.btn:hover:not(.is-disabled)::before {
  opacity: 1.2;
}

.btn:active:not(.is-disabled) {
  transform: translateY(1px);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(0, 0, 0, 0.15),
    inset 0 -1px 2px rgba(255, 255, 255, 0.1);
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:active:not(.is-disabled)::before {
  opacity: 0.8;
}

.btn:focus:not(.is-disabled) {
  outline: 2px solid rgba(0, 0, 0, 0.2);
  outline-offset: 2px;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
