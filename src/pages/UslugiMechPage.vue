<script lang="ts" setup>
import UslugiLathe from '../components/sections/uslugi/UslugiLathe.vue'
import UslugiMilling from '../components/sections/uslugi/UslugiMilling.vue'
import UslugiTooling from '../components/sections/uslugi/UslugiTooling.vue'
import UslugiGrinding from '../components/sections/uslugi/UslugiGrinding.vue'
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/HyoggbbVUgCqJp5UR7EU8T/MaaS-DEV--Copy-?node-id=3379-1782 -->
  <div
    class="uslugi-page uslugi-mech-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-mech-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiLathe />
            <UslugiMilling />
            <UslugiGrinding />
            <UslugiTooling />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="cnc-milling" />
        </el-col>
        <UslugiLathe />
        <UslugiMilling />
        <UslugiGrinding />
        <UslugiTooling />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-mech-page--mobile :deep(.uslugi-wrapper) {
  gap: 24px;
}

.uslugi-mech-page--mobile :deep(.uslugi-section) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
}

.uslugi-mech-page--mobile :deep(.uslugi-wrapper--lathe .uslugi-title) {
  margin-bottom: -8px;
}

.uslugi-mech-page--mobile :deep(.uslugi-wrapper--milling .uslugi-title) {
  margin-bottom: -14px;
}

.uslugi-mech-page--mobile :deep(.uslugi-wrapper--grinding .uslugi-title) {
  margin-bottom: -14px;
}

.uslugi-mech-page--mobile :deep(.uslugi-wrapper--tooling .uslugi-title) {
  margin-bottom: -14px;
}

.uslugi-mech-page--mobile :deep(.uslugi-title) {
  margin: 0 0 10px;
}

.uslugi-mech-page--mobile :deep(.technical-requirements) {
  margin: 0;
}

.uslugi-mech-page--mobile :deep(.technical-requirements--expanded) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uslugi-mech-page--mobile :deep(.tooling-equipment) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.uslugi-mech-page--mobile :deep(.tooling-equipment__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-mech-page--mobile :deep(.tooling-equipment__box) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--button-bg);
  border-radius: 10px;
  background-color: #f2f3f7;
  box-sizing: border-box;
}

.uslugi-mech-page--mobile :deep(.tooling-equipment__list) {
  margin: 0;
  padding-left: 15px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
  list-style-type: disc;
}

.uslugi-mech-page--mobile :deep(.tooling-equipment__list li + li) {
  margin-top: 0;
}

.uslugi-mech-page--mobile :deep(.tooling-equipment__note) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
