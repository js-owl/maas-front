<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
    plain?: boolean
  }>(),
  {
    disabled: false,
    type: 'primary',
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
  <button
    type="button"
    :class="['submit', buttonClasses]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.submit {
  background-color: var(--bgcolor);
  border: 1px solid var(--bgcolor);
  color: black;
  font-size: 20px;
  padding: 30px 0;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit.is-disabled {
  background-color: var(--bgcolor) !important;
  opacity: 0.6;
  cursor: default;
  color: black;
}

.submit:hover:not(.is-disabled),
.submit:focus:not(.is-disabled),
.submit:active:not(.is-disabled) {
  background-color: var(--bgcolor) !important;
  border-color: var(--bgcolor) !important;
  color: black !important;
  box-shadow: none !important;
}
</style>


