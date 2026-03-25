<script lang="ts" setup>
import TestClimate from '@/components/sections/testing/TestClimate.vue'
import TestVibration from '@/components/sections/testing/TestVibration.vue'
import TestElectric from '@/components/sections/testing/TestElectric.vue'
import TestHumidity from '@/components/sections/testing/TestHumidity.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
        <el-col :offset="3" :span="18">
          <TestClimate />
          <section id="vibration">
            <TestVibration />
          </section>
          <section id="electric">
            <TestElectric />
          </section>
          <section id="humidity">
            <TestHumidity />
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
