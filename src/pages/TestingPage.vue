<script lang="ts" setup>
import HomeCalc from '@/components/sections/HomeCalc.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
        <el-col :offset="3" :span="18">
          <HomeCalc />
        </el-col>
      </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
