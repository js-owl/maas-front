<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    plain?: boolean
  }>(),
  {
    disabled: false,
    plain: false,
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const buttonClasses = computed(() => ({
  'is-disabled': props.disabled,
}))

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button :class="['btn', buttonClasses]" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  color: black;
  font-size: 20px;
  padding: 10px 20px;
  /* width: 100%; */
  cursor: pointer;
  transition: opacity 0.2s;
  border-radius: 5px;
}

.btn.is-disabled {
  background-color: var(--bgcolor) !important;
  opacity: 0.6;
  cursor: default;
  color: black;
}

.btn:hover:not(.is-disabled),
.btn:focus:not(.is-disabled),
.btn:active:not(.is-disabled) {
  background-color: var(--bgcolor) !important;
  border-color: var(--bgcolor) !important;
  color: black !important;
  box-shadow: none !important;
}
</style>
