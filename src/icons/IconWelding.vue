<script lang="ts" setup>
const { color = '#fff', bgColor = '#cbd1d5' } = defineProps<{
  color?: string
  bgColor?: string
}>()
</script>

<template>
<svg class="icon-welding" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" :style="{ '--icon-color': color, '--icon-bg-color': bgColor }" xml:space="preserve">

<g id="Layer_1">
	<path class="st0" d="M50,60H10C4.5,60,0,55.5,0,50V10C0,4.5,4.5,0,10,0h40c5.5,0,10,4.5,10,10v40C60,55.5,55.5,60,50,60z"/>
</g>
<g id="Layer_2">
	<g>
		<path class="st1" d="M50.7,17.9h-2v-4.5c0-3-2.4-5.4-5.4-5.4H16.7c-3,0-5.4,2.4-5.4,5.4v4.5H9.3c-0.6,0-1,0.4-1,1v8.5
			c0,0.6,0.4,1,1,1h2.1v10.9c0,0.7,0.2,1.4,0.7,2l7.7,9.6c0.6,0.8,1.5,1.2,2.5,1.2h15.6c1,0,1.9-0.4,2.5-1.2l7.7-9.6
			c0.5-0.6,0.7-1.3,0.7-2V28.3h2c0.6,0,1-0.4,1-1v-8.5C51.7,18.3,51.2,17.9,50.7,17.9z M10.3,26.3v-6.5h1.1v6.5H10.3z M46.7,39.2
			c0,0.3-0.1,0.5-0.3,0.7l-7.7,9.6c-0.2,0.3-0.6,0.4-0.9,0.4H22.3c-0.4,0-0.7-0.2-0.9-0.4L13.6,40c-0.2-0.2-0.3-0.5-0.3-0.7V27.3
			v-8.5v-5.5c0-1.8,1.5-3.4,3.4-3.4h26.6c1.8,0,3.4,1.5,3.4,3.4v5.5v8.5V39.2z M49.7,26.3h-1v-6.5h1V26.3z"/>
		<rect x="22.6" y="39.5" class="st1" width="14.4" height="2"/>
		<path class="st1" d="M40.2,16.2H34h-8.5h-6.2c-0.6,0-1,0.4-1,1v11.7c0,0.6,0.4,1,1,1h20.9c0.6,0,1-0.4,1-1V17.2
			C41.2,16.7,40.8,16.2,40.2,16.2z M39.2,27.9H20.4v-9.7h5.2H34h5.2V27.9z"/>
	</g>
</g>
</svg>
</template>

<style scoped>
.icon-welding .st0 {
  fill: var(--icon-bg-color);
}

.icon-welding .st1 {
  fill: var(--icon-color);
}
</style>