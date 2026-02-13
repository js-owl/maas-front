<script lang="ts" setup>
import UslugiLathe from '../components/sections/uslugi/UslugiLathe.vue'
import UslugiMilling from '../components/sections/uslugi/UslugiMilling.vue'
</script>

<template>
  <div class="main-container">

    <el-row>
      <UslugiLathe />
      <UslugiMilling />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}
</style>
