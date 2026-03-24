<script lang="ts" setup>
import TestClimate from '@/components/sections/testing/TestClimate.vue'
import TestVibration from '@/components/sections/testing/TestVibration.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
        <el-col :offset="3" :span="18">
          <TestClimate />
          <section id="vibration">
            <TestVibration />
          </section>
        </el-col>
      </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
