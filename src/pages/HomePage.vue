<script setup lang="ts">
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import SectionModel from "../components/sections/SectionModel.vue";
import SectionAbility from "../components/sections/SectionAbility.vue";
import SectionAbout from "../components/sections/SectionAbout.vue";
import SectionAdvantages from "../components/sections/SectionAdvantages.vue";
import SectionMilestones from "../components/sections/SectionMilestones.vue";

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
</script>

<template>
  <div v-if="!isMobile">
    <SectionModel />
    <SectionAbility />
    <SectionMilestones />
    <SectionAbout />
    <SectionAdvantages />
  </div>
  <template v-else>
    <SectionModel />
    <!-- <SectionAbility /> -->
  </template>
</template>
<style scoped>
</style>
