<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import SectionModel from '../components/sections/SectionModel.vue'
import SectionAbility from '../components/sections/SectionAbility.vue'
import SectionAbout from '../components/sections/SectionAbout.vue'
import SectionAdvantages from '../components/sections/SectionAdvantages.vue'
import SectionMilestones from '../components/sections/SectionMilestones.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <div v-if="!isMobile">
    <SectionModel />
    <el-row>
      <el-col :offset="3" :span="18">
        <SectionAbility />
      </el-col>
    </el-row>
    <SectionMilestones />
    <el-row>
      <el-col :offset="3" :span="18">
        <SectionAbout />
      </el-col>
    </el-row>
    <SectionAdvantages />
  </div>
  <template v-else>
    <SectionModel />
    <el-row>
      <el-col :offset="0" :span="24">
        <SectionAbility />
        <SectionAbout />
      </el-col>
    </el-row>
  </template>
</template>
<style scoped></style>
