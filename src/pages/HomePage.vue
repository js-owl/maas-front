<script setup lang="ts">
import SectionModel from "../components/sections/SectionModel.vue";
import SectionAbility from "../components/sections/SectionAbility.vue";
import SectionAbout from "../components/sections/SectionAbout.vue";
import SectionAdvantages from "../components/sections/SectionAdvantages.vue";
import SectionMilestones from "../components/sections/SectionMilestones.vue";
</script>

<template>
  <SectionModel />
  <SectionAbility />

  <!-- Section Milestones -->
  <SectionMilestones />

  <SectionAbout />
  <SectionAdvantages />
</template>
<style scoped>
</style>
