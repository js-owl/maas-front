<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import UslugiLathe from '../components/sections/uslugi/UslugiLathe.vue'
import UslugiMilling from '../components/sections/uslugi/UslugiMilling.vue'
import UslugiTooling from '../components/sections/uslugi/UslugiTooling.vue'
import UslugiGrinding from '../components/sections/uslugi/UslugiGrinding.vue'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
</script>

<template>
  <!-- https://www.figma.com/design/HyoggbbVUgCqJp5UR7EU8T/MaaS-DEV--Copy-?node-id=3379-1782 -->
  <div class="uslugi-mech-page" :class="{ 'uslugi-mech-page--mobile': isMobile }">
    <el-row :gutter="0">
      <el-col :offset="isMobile ? 0 : 3" :span="isMobile ? 24 : 18">
        <div class="uslugi-mech-page__sections">
          <UslugiCalc v-if="!isMobile" service_id="cnc-milling" />
          <UslugiLathe />
          <UslugiMilling />
          <UslugiGrinding />
          <UslugiTooling />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-mech-page {
  background-color: var(--bgcolor);
  box-sizing: border-box;
}

.uslugi-mech-page__sections {
  display: flex;
  flex-direction: column;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections {
  gap: 12px;
  padding: 32px 10px 40px;
  box-sizing: border-box;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.el-col) {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
  padding: 16px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 5px #c8cfe3;
  box-sizing: border-box;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-card-content) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-text-block) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-text-block--lathe) {
  gap: 16px;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-text) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  height: 200px;
  min-height: 200px;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-image) {
  display: block;
  width: 100%;
  height: 200px;
  min-height: 200px;
  max-width: none;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: none;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.technical-requirements) {
  display: block;
  margin: 0;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.requirements-header) {
  height: 24px;
  min-height: 24px;
  padding: 0;
  border-radius: 0;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.requirements-arrow) {
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: #000000;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.tooling-equipment) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.tooling-equipment__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.tooling-equipment__box) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--button-bg);
  border-radius: 10px;
  background-color: #f2f3f7;
  box-sizing: border-box;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.tooling-equipment__list) {
  margin: 0;
  padding-left: 15px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  list-style-type: disc;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.tooling-equipment__list li + li) {
  margin-top: 0;
}

.uslugi-mech-page--mobile .uslugi-mech-page__sections :deep(.tooling-equipment__note) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
