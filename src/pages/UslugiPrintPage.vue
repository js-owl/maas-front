<script lang="ts" setup>
import UslugiCalc from '@/components/sections/uslugi/UslugiCalc.vue'
import UslugiPrint from '@/components/sections/uslugi/UslugiPrint.vue'
import UslugiPrintExample from '@/components/sections/uslugi/UslugiPrintExample.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile, isTablet } = usePageBreakpoints()
</script>

<template>
  <!-- https://www.figma.com/design/e96iy6upXth5rfRtLTi3j6/MaaS--Copy-?node-id=5653-18418 -->
  <div
    class="uslugi-page uslugi-print-page content-page"
    :class="{
      'content-page--mobile': isMobile,
      'content-page--tablet': isTablet,
      'uslugi-page--mobile': isMobile,
      'uslugi-print-page--mobile': isMobile,
    }"
  >
    <el-row :gutter="0">
      <template v-if="isMobile">
        <el-col :span="24">
          <div class="uslugi-page__sections">
            <UslugiCalc service_id="printing" />
            <h1 class="uslugi-print-page__title">3D-печать</h1>
            <UslugiPrint />
            <UslugiPrintExample />
          </div>
        </el-col>
      </template>

      <template v-else>
        <el-col :offset="3" :span="18">
          <UslugiCalc service_id="printing" />
          <h1 class="uslugi-print-page__title">3D-печать</h1>
        </el-col>
        <UslugiPrint />
        <UslugiPrintExample />
      </template>
    </el-row>
  </div>
</template>

<style scoped>
.uslugi-print-page__title {
  margin: 0 0 40px;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 52px;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  color: #000;
}

.uslugi-print-page :deep(.uslugi-wrapper) {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-bottom: 40px;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 6px 7.5px rgba(224, 227, 237, 0.5);
}

.uslugi-print-page :deep(.uslugi-wrapper--application) {
  gap: 20px;
}

.uslugi-print-page :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-Black', sans-serif;
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
}

.uslugi-print-page :deep(.uslugi-section) {
  gap: 80px;
  margin-bottom: 0;
  align-items: flex-start;
}

.uslugi-print-page :deep(.uslugi-text) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.4;
}

.uslugi-print-page :deep(.uslugi-text p) {
  margin: 0;
}

.uslugi-print-page :deep(.uslugi-image-wrapper) {
  flex: 1 1 0;
  max-width: 500px;
  min-width: 0;
  min-height: 433px;
  height: 433px;
  border-radius: 20px;
  background-color: var(--bgcolor);
  overflow: hidden;
}

.uslugi-print-page :deep(.uslugi-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
}

.uslugi-print-page :deep(.uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.uslugi-print-page :deep(.print-examples .uslugi-table-title) {
  font-family: 'Montserrat-Medium', sans-serif;
  font-weight: 500;
  line-height: 1.4;
}

.uslugi-print-page :deep(.requirements-table-wrapper) {
  margin: 0;
}

@media (max-width: 1300px) and (min-width: 769px) {
  .uslugi-print-page__title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .uslugi-print-page :deep(.uslugi-image-wrapper) {
    max-width: 360px;
    height: 341px;
    min-height: 341px;
  }
}

.uslugi-print-page--mobile .uslugi-print-page__title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.uslugi-print-page--mobile :deep(.uslugi-print-cards) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper) {
  gap: 16px;
  margin-bottom: 0;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 0 5px #c8cfe3;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--print-materials) {
  gap: 20px;
}

.uslugi-print-page--mobile :deep(.uslugi-wrapper--application) {
  gap: 16px;
}

.uslugi-print-page--mobile :deep(.uslugi-section) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0;
}

.uslugi-print-page--mobile :deep(.uslugi-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
}

.uslugi-print-page--mobile :deep(.uslugi-text) {
  gap: 8px;
  font-size: 12px;
  line-height: normal;
}

.uslugi-print-page--mobile :deep(.uslugi-image-wrapper) {
  flex: none;
  width: 100%;
  max-width: none;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
}

.uslugi-print-page--mobile :deep(.uslugi-image) {
  width: 100%;
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  object-fit: contain;
}

.uslugi-print-page--mobile :deep(.technical-requirements) {
  margin: 0;
}

.uslugi-print-page--mobile :deep(.technical-requirements--expanded) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.uslugi-print-page--mobile :deep(.requirements-header .uslugi-table-title) {
  font-size: 16px;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background-color: #f2f3f7;
  border: 1px solid var(--button-bg);
  border-top: none;
  box-sizing: border-box;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item:first-child) {
  border-top: 1px solid var(--button-bg);
  border-radius: 8px 8px 0 0;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item:last-child) {
  border-radius: 0 0 8px 8px;
}

.uslugi-print-page--mobile :deep(.materials-mobile__item:only-child) {
  border-radius: 8px;
}

.uslugi-print-page--mobile :deep(.materials-mobile__title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.materials-mobile__text) {
  margin: 0;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.print-examples .uslugi-table-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-panel) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  background: none;
  border-radius: 0;
}

.uslugi-print-page--mobile :deep(.application-card) {
  padding: 16px;
  border-radius: 8px;
  background-color: var(--bgcolor);
}

.uslugi-print-page--mobile :deep(.application-title) {
  margin: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  color: #000000;
}

.uslugi-print-page--mobile :deep(.application-list) {
  padding-left: 18px;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: #000000;
}
</style>
