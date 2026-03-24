<script lang="ts" setup>
const { color = '#fff' } = defineProps<{
  color?: string
}>()
</script>

<template>
  <svg
    class="icon-galv"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 60 60"
    style="enable-background: new 0 0 60 60"
    :style="{ '--icon-color': color }"
    xml:space="preserve"
  >
    <g id="Layer_1">
      <path
        class="st0"
        d="M50,60H10C4.5,60,0,55.5,0,50V10C0,4.5,4.5,0,10,0h40c5.5,0,10,4.5,10,10v40C60,55.5,55.5,60,50,60z"
      />
    </g>
    <g id="Layer_2">
      <g>
        <path
          class="st1"
          d="M52.3,8H7.7v7H23v2.7l-4.8,3.6v7.9h4.1v2.3h-7.6v-4.3h-7V52h44.6V27.2h-7v4.3h-15v-7.6h-8v3.2h-2.1v-4.9l4.8-3.6V15h27.3V8z M47.3,29.2h3V50H9.7V29.2h3V47h34.5V29.2z M45.3,33.5V45H14.7V33.5h7.6v6.2h8v-6.2H45.3z M24.3,25.9h4v11.8h-4V25.9z M50.3,13H9.7v-3h40.6V13z"
        />
        <rect
          x="34.6"
          y="37.7"
          class="st1"
          width="6.9"
          height="2"
        />
        <polygon
          class="st1"
          points="39,25.6 39,23.2 41.5,23.2 41.5,21.2 39,21.2 39,18.7 37,18.7 37,21.2 34.6,21.2 34.6,23.2 37,23.2 37,25.6"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.icon-galv .st0 {
  fill: #cbd1d5;
}

.icon-galv .st1 {
  fill: var(--icon-color);
}
</style>
